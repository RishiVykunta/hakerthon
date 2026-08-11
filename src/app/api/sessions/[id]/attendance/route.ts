import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mockStore } from '@/lib/store'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const attendances = await prisma.attendance.findMany({
      where: { session_id: id },
      include: {
        worker: {
          select: { id: true, name: true, phone: true, photo_url: true, wage_rate_per_day: true, site_id: true },
        },
      },
      orderBy: { timestamp: 'desc' },
    })

    const validAttendances = attendances.filter((a: any) => a.worker != null)

    return NextResponse.json({ attendances: validAttendances, count: validAttendances.length })
  } catch (err) {
    const validMockAtts = mockStore.attendances
      .filter((a) => a.session_id === id)
      .map((a) => {
        const worker = mockStore.workers.find((w) => w.id === a.worker_id)
        if (!worker) return null
        return {
          ...a,
          worker,
        }
      })
      .filter((a): a is NonNullable<typeof a> => a !== null)

    return NextResponse.json({ attendances: validMockAtts, count: validMockAtts.length, fallback: true })
  }
}
