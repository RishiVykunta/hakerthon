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
          select: { id: true, name: true, phone: true, photo_url: true, wage_rate_per_day: true },
        },
      },
      orderBy: { timestamp: 'desc' },
    })

    return NextResponse.json({ attendances, count: attendances.length })
  } catch (err) {
    const mockAtts = mockStore.attendances.filter((a) => a.session_id === id)
    const formattedMock = mockAtts.map((a) => {
      const worker = mockStore.workers.find((w) => w.id === a.worker_id)
      return {
        ...a,
        worker: worker || { id: a.worker_id, name: 'Worker ' + a.worker_id, phone: 'N/A', photo_url: null, wage_rate_per_day: 350 },
      }
    })
    return NextResponse.json({ attendances: formattedMock, count: formattedMock.length, fallback: true })
  }
}
