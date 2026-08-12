import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mockStore } from '@/lib/store'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const site_id = searchParams.get('site_id') || 'site_rampur_01'

  try {
    try {
      // 1. Registered Workers count
      const totalWorkers = await prisma.worker.count({
        where: { site_id },
      })

      // 2. Attendance count for confirmed / approved
      const presentCount = await prisma.attendance.count({
        where: {
          session: { site_id },
          status: { in: ['auto_confirmed', 'manual_approved'] },
        },
      })

      // 3. Workers with their wage rate to calculate estimated wages
      const verifiedAttendances = await prisma.attendance.findMany({
        where: {
          session: { site_id },
          status: { in: ['auto_confirmed', 'manual_approved'] },
        },
        include: {
          worker: { select: { wage_rate_per_day: true } },
        },
      })

      const totalWages = verifiedAttendances.reduce((acc, curr) => {
        const hours = curr.total_hours || (curr.out_time ? 8.0 : 8.0)
        const rate = curr.worker?.wage_rate_per_day || 350
        return acc + Math.round((hours / 8.0) * rate)
      }, 0)

      const attendanceRate = totalWorkers > 0 ? Math.round((presentCount / totalWorkers) * 100) : 0

      return NextResponse.json({
        totalWorkers,
        presentToday: presentCount,
        attendanceRate: `${attendanceRate}%`,
        estimatedWages: `₹${totalWages.toLocaleString('en-IN')}`,
        rawWages: totalWages,
      })
    } catch (dbErr) {
      // Fallback using mockStore
      const mockWorkers = mockStore.workers.filter((w) => w.site_id === site_id || !site_id)
      const totalWorkers = mockWorkers.length

      const confirmedAtts = mockStore.attendances.filter(
        (a) => a.status === 'auto_confirmed' || a.status === 'manual_approved'
      )
      const presentToday = confirmedAtts.length
      const rateNum = totalWorkers > 0 ? Math.min(Math.round((presentToday / totalWorkers) * 100), 100) : 0

      let totalWages = 0
      confirmedAtts.forEach((att) => {
        const worker = mockWorkers.find((w) => w.id === att.worker_id)
        const hours = att.total_hours || (att.out_time ? 8.0 : 8.0)
        const rate = worker?.wage_rate_per_day || 350
        totalWages += Math.round((hours / 8.0) * rate)
      })

      return NextResponse.json({
        totalWorkers,
        presentToday,
        attendanceRate: `${rateNum}%`,
        estimatedWages: `₹${totalWages.toLocaleString('en-IN')}`,
        rawWages: totalWages,
        fallback: true,
      })
    }
  } catch (err) {
    return NextResponse.json(
      {
        totalWorkers: 0,
        presentToday: 0,
        attendanceRate: '0%',
        estimatedWages: '₹0',
        fallback: true,
      },
      { status: 200 }
    )
  }
}
