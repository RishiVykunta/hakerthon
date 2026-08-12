import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mockStore } from '@/lib/store'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const site_id = searchParams.get('site_id') || 'site_rampur_01'
  const cutoffPercent = parseFloat(searchParams.get('cutoff') || '70') // default 70%

  try {
    try {
      // Fetch recent 10 sessions for site
      const recentSessions = await prisma.session.findMany({
        where: { site_id },
        orderBy: { created_at: 'desc' },
        take: 10,
        select: { id: true },
      })

      if (recentSessions.length === 0) {
        return NextResponse.json({ flaggedWorkers: [], cutoffPercent, totalSessionsEvaluated: 0 })
      }

      const totalSessionsCount = recentSessions.length
      const sessionIds = recentSessions.map((s) => s.id)

      const workers = await prisma.worker.findMany({
        where: { site_id },
        include: {
          attendances: {
            where: {
              session_id: { in: sessionIds },
              status: { in: ['auto_confirmed', 'manual_approved'] },
            },
          },
        },
      })

      if (workers.length === 0) {
        return NextResponse.json({ flaggedWorkers: [], cutoffPercent, totalSessionsEvaluated: totalSessionsCount })
      }

      const flaggedWorkers = workers
        .map((w) => {
          const presentCount = w.attendances.length
          const attendancePercentage = Number(((presentCount / totalSessionsCount) * 100).toFixed(1))
          return {
            id: w.id,
            name: w.name,
            phone: w.phone,
            photo_url: w.photo_url,
            presentCount,
            totalSessionsCount,
            attendancePercentage,
          }
        })
        .filter((w) => w.attendancePercentage < cutoffPercent)

      return NextResponse.json({ flaggedWorkers, cutoffPercent, totalSessionsEvaluated: totalSessionsCount })
    } catch (dbErr) {
      // Dynamic computation based on actual store workers and attendances
      const mockWorkers = mockStore.workers.filter((w) => w.site_id === site_id || !site_id)
      const mockSessions = mockStore.sessions.filter((s) => s.site_id === site_id || !site_id).slice(0, 10)

      if (mockWorkers.length === 0 || mockSessions.length === 0) {
        return NextResponse.json({
          flaggedWorkers: [],
          cutoffPercent,
          totalSessionsEvaluated: mockSessions.length,
          fallback: true,
        })
      }

      const totalSessionsCount = mockSessions.length

      const flaggedWorkers = mockWorkers
        .map((w) => {
          const presentCount = mockStore.attendances.filter(
            (a) => a.worker_id === w.id && (a.status === 'auto_confirmed' || a.status === 'manual_approved')
          ).length
          const attendancePercentage = Number(((presentCount / totalSessionsCount) * 100).toFixed(1))
          return {
            id: w.id,
            name: w.name,
            phone: w.phone,
            photo_url: w.photo_url,
            presentCount,
            totalSessionsCount,
            attendancePercentage,
          }
        })
        .filter((w) => w.attendancePercentage < cutoffPercent)

      return NextResponse.json({
        flaggedWorkers,
        cutoffPercent,
        totalSessionsEvaluated: totalSessionsCount,
        fallback: true,
      })
    }
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to compute attendance alerts' }, { status: 500 })
  }
}
