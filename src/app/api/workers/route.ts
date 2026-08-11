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

      // Sync with in-memory store
      const formattedMock: MockWorker = {
        id: newWorker.id,
        name: newWorker.name,
        phone: newWorker.phone,
        photo_url: newWorker.photo_url,
        face_descriptor: face_descriptor,
        wage_rate_per_day: newWorker.wage_rate_per_day,
        site_id: newWorker.site_id,
        created_at: newWorker.created_at.toISOString(),
      }
      const existingIdx = mockStore.workers.findIndex((w) => w.id === newWorker.id || w.phone === newWorker.phone)
      if (existingIdx !== -1) {
        mockStore.workers[existingIdx] = formattedMock
      } else {
        mockStore.workers.unshift(formattedMock)
      }

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

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, name, phone, wage_rate_per_day, photo_url } = body

    if (!id || !name || !phone) {
      return NextResponse.json({ error: 'Worker ID, name, and phone number are required' }, { status: 400 })
    }

    const wageRate = parseFloat(wage_rate_per_day) || 350.0

    try {
      const updatedWorker = await prisma.worker.update({
        where: { id },
        data: {
          name,
          phone,
          wage_rate_per_day: wageRate,
          ...(photo_url ? { photo_url } : {}),
        },
      })

      const descriptorArr = Array.isArray(updatedWorker.face_descriptor)
        ? (updatedWorker.face_descriptor as number[])
        : JSON.parse(String(updatedWorker.face_descriptor || '[]'))

      const formatted = {
        ...updatedWorker,
        face_descriptor: descriptorArr,
      }

      // Sync mockStore
      const mockW = mockStore.workers.find((w) => w.id === id)
      if (mockW) {
        mockW.name = name
        mockW.phone = phone
        mockW.wage_rate_per_day = wageRate
        if (photo_url) mockW.photo_url = photo_url
      }

      return NextResponse.json({ success: true, worker: formatted })
    } catch (dbErr: any) {
      if (dbErr.code === 'P2002') {
        return NextResponse.json({ error: 'Another worker with this phone number already exists' }, { status: 409 })
      }

      const mockWorker = mockStore.workers.find((w) => w.id === id)
      if (mockWorker) {
        mockWorker.name = name
        mockWorker.phone = phone
        mockWorker.wage_rate_per_day = wageRate
        if (photo_url) mockWorker.photo_url = photo_url
        return NextResponse.json({ success: true, worker: mockWorker, fallback: true })
      }
      return NextResponse.json({ error: 'Worker not found' }, { status: 404 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update worker details' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Worker ID is required' }, { status: 400 })
    }

    try {
      await prisma.attendance.deleteMany({ where: { worker_id: id } })
      await prisma.wageRecord.deleteMany({ where: { worker_id: id } })

      const deletedWorker = await prisma.worker.delete({
        where: { id },
      })

      // Sync mockStore deletion
      mockStore.workers = mockStore.workers.filter((w) => w.id !== id)
      mockStore.attendances = mockStore.attendances.filter((a) => a.worker_id !== id)
      mockStore.wageRecords = mockStore.wageRecords.filter((wr) => wr.worker_id !== id)

      return NextResponse.json({ success: true, message: `Worker ${deletedWorker.name} removed successfully`, id })
    } catch (dbErr) {
      const index = mockStore.workers.findIndex((w) => w.id === id)
      if (index !== -1) {
        const removed = mockStore.workers.splice(index, 1)[0]
        mockStore.attendances = mockStore.attendances.filter((a) => a.worker_id !== id)
        mockStore.wageRecords = mockStore.wageRecords.filter((wr) => wr.worker_id !== id)
        return NextResponse.json({ success: true, message: `Worker ${removed.name} removed successfully`, id, fallback: true })
      }
      return NextResponse.json({ error: 'Worker not found' }, { status: 404 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to remove worker' }, { status: 500 })
  }
}
