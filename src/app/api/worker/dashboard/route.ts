import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mockStore } from '@/lib/store'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const authUser = await getAuthUser()
  const worker_id = searchParams.get('worker_id') || authUser?.id

  try {
    try {
      if (!worker_id) {
        throw new Error('Worker ID not provided')
      }

      const worker = await prisma.worker.findUnique({
        where: { id: worker_id },
        include: {
          site: true,
          attendances: {
            include: { session: true },
            orderBy: { timestamp: 'desc' },
          },
          wage_records: {
            orderBy: { exported_at: 'desc' },
          },
        },
      })

      if (!worker) {
        throw new Error('Worker not found in Prisma DB')
      }

      const totalDaysPresent = worker.attendances.filter(
        (a) => a.status === 'auto_confirmed' || a.status === 'manual_approved'
      ).length

      const totalWagesEarned = worker.attendances
        .filter((a) => a.status === 'auto_confirmed' || a.status === 'manual_approved')
        .reduce((sum, att) => {
          const hours = att.total_hours || (att.out_time ? 8.0 : 8.0)
          return sum + Math.round((hours / 8.0) * worker.wage_rate_per_day)
        }, 0)

      return NextResponse.json({
        worker: {
          id: worker.id,
          name: worker.name,
          phone: worker.phone,
          photo_url: worker.photo_url,
          wage_rate_per_day: worker.wage_rate_per_day,
          site_name: worker.site.name,
        },
        stats: {
          totalDaysPresent,
          totalWagesEarned,
          pendingReviewCount: worker.attendances.filter((a) => a.status === 'manual_review').length,
        },
        attendances: worker.attendances,
        wageRecords: worker.wage_records,
      })
    } catch (dbErr) {
      const mockWorker = mockStore.workers.find((w) => (worker_id && w.id === worker_id) || w.phone === authUser?.phone) || mockStore.workers[0]

      if (!mockWorker) {
        return NextResponse.json({
          worker: null,
          stats: {
            totalDaysPresent: 0,
            totalWagesEarned: 0,
            pendingReviewCount: 0,
          },
          attendances: [],
          wageRecords: [],
          fallback: true,
        })
      }

      const site = mockStore.sites.find((s) => s.id === mockWorker.site_id)
      const workerAtts = mockStore.attendances.filter((a) => a.worker_id === mockWorker.id)

      const totalDaysPresent = workerAtts.filter((a) => a.status === 'auto_confirmed' || a.status === 'manual_approved').length
      const totalWagesEarned = workerAtts
        .filter((a) => a.status === 'auto_confirmed' || a.status === 'manual_approved')
        .reduce((sum, att) => {
          const hours = att.total_hours || (att.out_time ? 8.0 : 8.0)
          return sum + Math.round((hours / 8.0) * mockWorker.wage_rate_per_day)
        }, 0)

      return NextResponse.json({
        worker: {
          id: mockWorker.id,
          name: mockWorker.name,
          phone: mockWorker.phone,
          photo_url: mockWorker.photo_url,
          wage_rate_per_day: mockWorker.wage_rate_per_day,
          site_name: site?.name || 'GreenGrid MGNREGA Worksite #4',
        },
        stats: {
          totalDaysPresent,
          totalWagesEarned,
          pendingReviewCount: workerAtts.filter((a) => a.status === 'manual_review').length,
        },
        attendances: workerAtts,
        wageRecords: mockStore.wageRecords.filter((wr) => wr.worker_id === mockWorker.id),
        fallback: true,
      })
    }
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to fetch worker dashboard' }, { status: 500 })
  }
}
