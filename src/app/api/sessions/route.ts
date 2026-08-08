import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mockStore, MockSession } from '@/lib/store'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const site_id = searchParams.get('site_id') || 'site_rampur_01'

  try {
    const sessions = await prisma.session.findMany({
      where: { site_id },
      include: {
        supervisor: { select: { name: true } },
        _count: { select: { attendances: true } },
      },
      orderBy: { created_at: 'desc' },
    })

    return NextResponse.json({ sessions })
  } catch (err) {
    const mockSessions = mockStore.sessions.filter((s) => s.site_id === site_id || !site_id)
    return NextResponse.json({ sessions: mockSessions, fallback: true })
  }
}

export async function POST(req: Request) {
  const user = await getAuthUser()
  const site_id = user?.site_id || 'site_rampur_01'
  const supervisor_id = user?.id || 'sup_01'

  try {
    try {
      // Check if there is already an active session for this site
      const activeSession = await prisma.session.findFirst({
        where: { site_id, status: 'active' },
      })

      if (activeSession) {
        return NextResponse.json({ success: true, session: activeSession, message: 'Existing active session retrieved' })
      }

      const newSession = await prisma.session.create({
        data: {
          site_id,
          supervisor_id,
          status: 'active',
          date: new Date(),
        },
      })
      return NextResponse.json({ success: true, session: newSession })
    } catch (dbErr) {
      const activeMock = mockStore.sessions.find((s) => s.site_id === site_id && s.status === 'active')
      if (activeMock) {
        return NextResponse.json({ success: true, session: activeMock, message: 'Existing active session retrieved' })
      }

      const newMockSession: MockSession = {
        id: `session_${Date.now()}`,
        site_id,
        supervisor_id,
        date: new Date().toISOString(),
        status: 'active',
        created_at: new Date().toISOString(),
      }
      mockStore.sessions.unshift(newMockSession)
      return NextResponse.json({ success: true, session: newMockSession, fallback: true })
    }
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || 'Failed session request' }, { status: 500 })
  }
}
