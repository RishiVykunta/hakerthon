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

      const totalSessionsCount = Math.max(recentSessions.length, 1)
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
      // Mock fallback computation
      const mockWorkers = mockStore.workers.filter((w) => w.site_id === site_id || !site_id)
      const flaggedWorkers = mockWorkers.map((w, index) => {
        const percent = index === 3 ? 40.0 : index === 1 ? 60.0 : 90.0
        return {
          id: w.id,
          name: w.name,
          phone: w.phone,
          photo_url: w.photo_url,
          presentCount: Math.round((percent / 100) * 10),
          totalSessionsCount: 10,
          attendancePercentage: percent,
        }
      }).filter((w) => w.attendancePercentage < cutoffPercent)

      return NextResponse.json({
        flaggedWorkers,
        cutoffPercent,
        totalSessionsEvaluated: 10,
        fallback: true,
      })
    }
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to compute attendance alerts' }, { status: 500 })
  }
}
