import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mockStore, MockAttendance } from '@/lib/store'
import { getAuthUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { session_id, worker_id, confidence_score, status, snapshot_url, notes, scan_type } = body

    if (!session_id || !worker_id) {
      return NextResponse.json({ error: 'session_id and worker_id are required' }, { status: 400 })
    }

    const attStatus = status || 'auto_confirmed'
    const score = typeof confidence_score === 'number' ? confidence_score : 0.35
    const now = new Date()
    const targetMode = scan_type || 'AUTO' // 'CHECK_IN' | 'CHECK_OUT' | 'AUTO'

    // 1. Try Prisma DB Execution
    try {
      const existing = await prisma.attendance.findUnique({
        where: { session_id_worker_id: { session_id, worker_id } },
        include: { worker: true },
      })

      if (targetMode === 'CHECK_OUT' || (targetMode === 'AUTO' && existing && !existing.out_time)) {
        // Record CHECK OUT
        const inDate = existing ? new Date(existing.in_time || existing.timestamp) : new Date(now.getTime() - 8 * 3600 * 1000)
        const rawHours = (now.getTime() - inDate.getTime()) / (1000 * 60 * 60)
        const total_hours = rawHours > 0.05 ? Number(rawHours.toFixed(2)) : 8.0

        let updated
        if (existing) {
          updated = await prisma.attendance.update({
            where: { id: existing.id },
            data: {
              out_time: now,
              total_hours,
              notes: notes ? `${notes} (Checked Out)` : `Checked Out at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            },
            include: { worker: true },
          })
        } else {
          updated = await prisma.attendance.create({
            data: {
              session_id,
              worker_id,
              in_time: new Date(now.getTime() - 8 * 3600 * 1000),
              out_time: now,
              total_hours,
              confidence_score: score,
              status: attStatus,
              snapshot_url: snapshot_url || null,
              notes: notes || `Checked Out at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            },
            include: { worker: true },
          })
        }

        return NextResponse.json({
          success: true,
          action: 'check_out',
          message: `Checked OUT at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}! Worked ${total_hours} hrs today.`,
          attendance: updated,
        })
      }

      // Record CHECK IN
      if (existing) {
        const updated = await prisma.attendance.update({
          where: { id: existing.id },
          data: {
            in_time: now,
            notes: notes ? `${notes} (Checked In)` : `Checked In at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          },
          include: { worker: true },
        })
        return NextResponse.json({
          success: true,
          action: 'check_in',
          message: `Checked IN updated at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          attendance: updated,
        })
      }

      const attendance = await prisma.attendance.create({
        data: {
          session_id,
          worker_id,
          in_time: now,
          confidence_score: score,
          status: attStatus,
          snapshot_url: snapshot_url || null,
          notes: notes || `Checked In at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        },
        include: { worker: true },
      })

      return NextResponse.json({
        success: true,
        action: 'check_in',
        message: `Checked IN at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        attendance,
      })
    } catch (dbErr) {
      // Fallback to mockStore
      const mockDup = mockStore.attendances.find((a) => a.session_id === session_id && a.worker_id === worker_id)
      const worker = mockStore.workers.find((w) => w.id === worker_id)

      if (targetMode === 'CHECK_OUT' || (targetMode === 'AUTO' && mockDup && !mockDup.out_time)) {
        const inDate = mockDup ? new Date(mockDup.in_time || mockDup.timestamp) : new Date(now.getTime() - 8 * 3600 * 1000)
        const rawHours = (now.getTime() - inDate.getTime()) / (1000 * 60 * 60)
        const total_hours = rawHours > 0.05 ? Number(rawHours.toFixed(2)) : 8.0

        if (mockDup) {
          mockDup.out_time = now.toISOString()
          mockDup.total_hours = total_hours
          mockDup.type = 'CHECK_OUT'
          mockDup.notes = `Checked Out at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        } else {
          const newMockAtt: MockAttendance = {
            id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            worker_id,
            session_id,
            timestamp: now.toISOString(),
            in_time: new Date(now.getTime() - 8 * 3600 * 1000).toISOString(),
            out_time: now.toISOString(),
            total_hours,
            type: 'CHECK_OUT',
            confidence_score: score,
            status: attStatus,
            snapshot_url: snapshot_url || null,
            notes: `Checked Out at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            created_at: now.toISOString(),
          }
          mockStore.attendances.unshift(newMockAtt)
        }

        return NextResponse.json({
          success: true,
          action: 'check_out',
          message: `Checked OUT at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}! Worked ${total_hours} hrs today.`,
          attendance: mockDup ? { ...mockDup, worker } : { ...mockStore.attendances[0], worker },
          fallback: true,
        })
      }

      // Mock Check In
      if (mockDup) {
        mockDup.in_time = now.toISOString()
        mockDup.notes = `Checked In at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        return NextResponse.json({
          success: true,
          action: 'check_in',
          message: `Checked IN updated at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          attendance: { ...mockDup, worker },
          fallback: true,
        })
      }

      const newMockAtt: MockAttendance = {
        id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        worker_id,
        session_id,
        timestamp: now.toISOString(),
        in_time: now.toISOString(),
        out_time: null,
        total_hours: null,
        type: 'CHECK_IN',
        confidence_score: score,
        status: attStatus,
        snapshot_url: snapshot_url || null,
        notes: `Checked In at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        created_at: now.toISOString(),
      }
      mockStore.attendances.unshift(newMockAtt)

      return NextResponse.json({
        success: true,
        action: 'check_in',
        message: `Checked IN at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        attendance: { ...newMockAtt, worker },
        fallback: true,
      })
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
