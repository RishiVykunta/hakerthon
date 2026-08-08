import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mockStore, MockWorker } from '@/lib/store'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const site_id = searchParams.get('site_id') || 'site_rampur_01'

  try {
    const workers = await prisma.worker.findMany({
      where: { site_id },
      orderBy: { created_at: 'desc' },
    })

    const formattedWorkers = workers.map((w) => ({
      ...w,
      face_descriptor: Array.isArray(w.face_descriptor)
        ? (w.face_descriptor as number[])
        : JSON.parse(String(w.face_descriptor || '[]')),
    }))

    return NextResponse.json({ workers: formattedWorkers })
  } catch (err) {
    // Database fallback
    const mockWorkers = mockStore.workers.filter((w) => w.site_id === site_id || !site_id)
    return NextResponse.json({ workers: mockWorkers, fallback: true })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, phone, photo_url, face_descriptor, wage_rate_per_day, site_id } = body

    if (!name || !phone || !face_descriptor || !Array.isArray(face_descriptor)) {
      return NextResponse.json(
        { error: 'Name, phone number, and 128-d face descriptor vector are required' },
        { status: 400 }
      )
    }

    const targetSiteId = site_id || 'site_rampur_01'
    const wageRate = parseFloat(wage_rate_per_day) || 350.0

    try {
      const newWorker = await prisma.worker.create({
        data: {
          name,
          phone,
          photo_url: photo_url || null,
          face_descriptor: face_descriptor,
          wage_rate_per_day: wageRate,
          site_id: targetSiteId,
        },
      })
      return NextResponse.json({ success: true, worker: newWorker })
    } catch (dbErr: any) {
      // Duplicate key or fallback handling
      if (dbErr.code === 'P2002') {
        return NextResponse.json({ error: 'Worker with this phone number already exists' }, { status: 409 })
      }

      const newMockWorker: MockWorker = {
        id: `worker_${Date.now()}`,
        name,
        phone,
        photo_url: photo_url || null,
        face_descriptor,
        wage_rate_per_day: wageRate,
        site_id: targetSiteId,
        created_at: new Date().toISOString(),
      }
      mockStore.workers.unshift(newMockWorker)
      return NextResponse.json({ success: true, worker: newMockWorker, fallback: true })
    }
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || 'Failed to fetch workers' }, { status: 500 })
  }
}
