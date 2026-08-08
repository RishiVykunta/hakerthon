import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mockStore, MockWageRecord } from '@/lib/store'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        site: true,
        supervisor: { select: { name: true, phone: true } },
        attendances: {
          include: { worker: true },
          orderBy: { timestamp: 'desc' },
        },
      },
    })

    if (!session) {
      // Check mockStore
      const mockSession = mockStore.sessions.find((s) => s.id === id)
      if (mockSession) return NextResponse.json({ session: mockSession })
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    return NextResponse.json({ session })
  } catch (err) {
    const mockSession = mockStore.sessions.find((s) => s.id === id) || mockStore.sessions[0]
    return NextResponse.json({ session: mockSession, fallback: true })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const body = await req.json()
    const { status } = body // e.g. 'closed'

    try {
      const updatedSession = await prisma.session.update({
        where: { id },
        data: { status: status || 'closed' },
        include: {
          attendances: {
            where: { status: { in: ['auto_confirmed', 'manual_approved'] } },
            include: { worker: true },
          },
        },
      })

      // Generate Wage Records for present workers
      for (const att of updatedSession.attendances) {
        await prisma.wageRecord.upsert({
          where: { session_id_worker_id: { session_id: id, worker_id: att.worker_id } },
          update: { computed_wage: att.worker.wage_rate_per_day },
          create: {
            session_id: id,
            worker_id: att.worker_id,
            days_present: 1.0,
            computed_wage: att.worker.wage_rate_per_day,
          },
        })
      }

      return NextResponse.json({ success: true, session: updatedSession })
    } catch (dbErr) {
      const mockS = mockStore.sessions.find((s) => s.id === id)
      if (mockS) {
        mockS.status = 'closed'
        // Compute mock wage records
        const confirmedAtts = mockStore.attendances.filter(
          (a) => a.session_id === id && (a.status === 'auto_confirmed' || a.status === 'manual_approved')
        )
        for (const att of confirmedAtts) {
          const w = mockStore.workers.find((wk) => wk.id === att.worker_id)
          const wage = w ? w.wage_rate_per_day : 350.0
          const existingWr = mockStore.wageRecords.find((wr) => wr.session_id === id && wr.worker_id === att.worker_id)
          if (!existingWr) {
            const newWr: MockWageRecord = {
              id: `wr_${Date.now()}_${att.worker_id}`,
              worker_id: att.worker_id,
              session_id: id,
              days_present: 1.0,
              computed_wage: wage,
              exported_at: new Date().toISOString(),
            }
            mockStore.wageRecords.push(newWr)
          }
        }
      }
      return NextResponse.json({ success: true, session: mockS, fallback: true })
    }
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || 'Failed session operation' }, { status: 500 })
  }
}
