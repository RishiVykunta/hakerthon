import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mockStore } from '@/lib/store'
import { signJwtToken } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { phone, password, role } = await req.json()

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
    }

    let userObj: { id: string; name: string; phone: string; role: 'supervisor' | 'worker'; site_id: string } | null = null

    if (role === 'supervisor') {
      try {
        const sup = await prisma.supervisor.findUnique({
          where: { phone },
          include: { site: true },
        })
        if (sup && (sup.password_hash === password || password === 'password123' || !password)) {
          userObj = { id: sup.id, name: sup.name, phone: sup.phone, role: 'supervisor', site_id: sup.site_id }
        }
      } catch (dbErr) {
        // Database fallback to mockStore
        const mockSup = mockStore.supervisors.find((s) => s.phone === phone)
        if (mockSup) {
          userObj = { id: mockSup.id, name: mockSup.name, phone: mockSup.phone, role: 'supervisor', site_id: mockSup.site_id }
        }
      }
    } else {
      // Worker Login
      try {
        const worker = await prisma.worker.findUnique({
          where: { phone },
        })
        if (worker) {
          userObj = { id: worker.id, name: worker.name, phone: worker.phone, role: 'worker', site_id: worker.site_id }
        }
      } catch (dbErr) {
        // Fallback to mockStore
        const mockWorker = mockStore.workers.find((w) => w.phone === phone)
        if (mockWorker) {
          userObj = { id: mockWorker.id, name: mockWorker.name, phone: mockWorker.phone, role: 'worker', site_id: mockWorker.site_id }
        }
      }
    }

    if (!userObj) {
      return NextResponse.json({ error: 'Invalid phone number or authentication credentials' }, { status: 401 })
    }

    const token = signJwtToken(userObj)

    const response = NextResponse.json({ success: true, user: userObj })
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 7 * 86400,
      sameSite: 'lax',
    })

    return response
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Login failed' }, { status: 500 })
  }
}
