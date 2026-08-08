import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mockStore, MockAttendance } from '@/lib/store'
import { getAuthUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { session_id, worker_id, confidence_score, status, snapshot_url, notes } = body

    if (!session_id || !worker_id) {
      return NextResponse.json({ error: 'session_id and worker_id are required' }, { status: 400 })
    }

    const attStatus = status || 'auto_confirmed'
    const score = typeof confidence_score === 'number' ? confidence_score : 0.35

    // 1. Check for Duplicate Entry in this session
    try {
      const existing = await prisma.attendance.findUnique({
        where: { session_id_worker_id: { session_id, worker_id } },
        include: { worker: { select: { name: true } } },
      })

      if (existing) {
        return NextResponse.json(
          {
            duplicate: true,
            message: `Attendance already recorded for ${existing.worker?.name || 'this worker'} in session`,
            attendance: existing,
          },
          { status: 200 }
        )
      }

      // Create new attendance record
      const attendance = await prisma.attendance.create({
        data: {
          session_id,
          worker_id,
          confidence_score: score,
          status: attStatus,
          snapshot_url: snapshot_url || null,
          notes: notes || null,
        },
        include: { worker: true },
      })

      return NextResponse.json({ success: true, attendance })
    } catch (dbErr) {
      // Fallback to mockStore
      const mockDup = mockStore.attendances.find((a) => a.session_id === session_id && a.worker_id === worker_id)
      if (mockDup) {
        const worker = mockStore.workers.find((w) => w.id === worker_id)
        return NextResponse.json(
          {
            duplicate: true,
            message: `Attendance already recorded for ${worker?.name || 'this worker'} in session`,
            attendance: { ...mockDup, worker },
          },
          { status: 200 }
        )
      }

      const newMockAtt: MockAttendance = {
        id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        worker_id,
        session_id,
        timestamp: new Date().toISOString(),
        confidence_score: score,
        status: attStatus,
        snapshot_url: snapshot_url || null,
        notes: notes || null,
        created_at: new Date().toISOString(),
      }
      mockStore.attendances.unshift(newMockAtt)
      const worker = mockStore.workers.find((w) => w.id === worker_id)

      return NextResponse.json({ success: true, attendance: { ...newMockAtt, worker }, fallback: true })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to record attendance' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getAuthUser()
    const body = await req.json()
    const { attendance_id, status, notes } = body // status: 'manual_approved' | 'manual_rejected'

    if (!attendance_id || !status) {
      return NextResponse.json({ error: 'attendance_id and status are required' }, { status: 400 })
    }

    const reviewer = user ? user.name : 'Supervisor'

    try {
      const updated = await prisma.attendance.update({
        where: { id: attendance_id },
        data: {
          status: status,
          reviewed_by: reviewer,
          notes: notes ? `${notes} (Reviewed by ${reviewer})` : `Updated to ${status} by ${reviewer}`,
        },
        include: { worker: true },
      })
      return NextResponse.json({ success: true, attendance: updated })
    } catch (dbErr) {
      const mockAtt = mockStore.attendances.find((a) => a.id === attendance_id)
      if (mockAtt) {
        mockAtt.status = status
        mockAtt.reviewed_by = reviewer
        mockAtt.notes = notes ? `${notes} (Reviewed by ${reviewer})` : `Updated to ${status} by ${reviewer}`
      }
      return NextResponse.json({ success: true, attendance: mockAtt, fallback: true })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update attendance review' }, { status: 500 })
  }
}
