'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Users,
  Camera,
  UserCheck,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingDown,
  RefreshCw,
  Zap,
  Landmark,
  ShieldCheck,
} from 'lucide-react'

export default function SupervisorDashboard() {
  const [session, setSession] = useState<any>(null)
  const [workers, setWorkers] = useState<any[]>([])
  const [attendances, setAttendances] = useState<any[]>([])
  const [lowAttendanceWorkers, setLowAttendanceWorkers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sessionActionLoading, setSessionActionLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      // 1. Fetch active/recent session
      const sessionRes = await fetch('/api/sessions')
      const sessionData = await sessionRes.json()
      const activeSess = sessionData.sessions?.find((s: any) => s.status === 'active') || sessionData.sessions?.[0]
      setSession(activeSess)

      // 2. Fetch workers
      const workersRes = await fetch('/api/workers')
      const workersData = await workersRes.json()
      setWorkers(workersData.workers || [])

      // 3. Fetch current session attendance
      if (activeSess?.id) {
        const attRes = await fetch(`/api/sessions/${activeSess.id}/attendance`)
        const attData = await attRes.json()
        setAttendances(attData.attendances || [])
      }

      // 4. Fetch low attendance analytics
      const lowAttRes = await fetch('/api/analytics/low-attendance?cutoff=70')
      const lowAttData = await lowAttRes.json()
      setLowAttendanceWorkers(lowAttData.flaggedWorkers || [])
    } catch (err) {
      console.error('Error loading dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleToggleSession = async () => {
    setSessionActionLoading(true)
    try {
      if (session && session.status === 'active') {
        // Close session
        await fetch(`/api/sessions/${session.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'closed' }),
        })
      } else {
        // Start new session
        await fetch('/api/sessions', { method: 'POST' })
      }
      await fetchData()
    } catch (err) {
      console.error('Failed toggling session state:', err)
    } finally {
      setSessionActionLoading(false)
    }
  }

  const pendingReviewCount = attendances.filter((a) => a.status === 'manual_review').length
  const autoConfirmedCount = attendances.filter((a) => a.status === 'auto_confirmed' || a.status === 'manual_approved').length
  const totalWagePayoutToday = autoConfirmedCount * 350

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Site Top Header & Active Session Control */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5 shadow-sm">
              <Landmark className="w-3.5 h-3.5 text-amber-600" />
              Active Job Site: Rampur Panchayat #4
            </span>
            {session?.status === 'active' ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-900 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                ATTENDANCE SESSION ACTIVE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 px-3 py-1 rounded-full bg-slate-100 border border-slate-300">
                SESSION CLOSED
              </span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            MGNREGA Site Supervisor Command Dashboard
          </h1>
          <p className="text-xs text-slate-600 font-medium">Supervisor: Rajesh Kumar • District: Sitapur, UP • Job Card Schema v2.4</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-3 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-slate-900 hover:border-amber-500/40 shadow-sm transition-all"
            title="Refresh Site Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleToggleSession}
            disabled={sessionActionLoading}
            className={`px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg ${
              session?.status === 'active'
                ? 'bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200'
                : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/20 hover:scale-[1.02]'
            }`}
          >
            {sessionActionLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : session?.status === 'active' ? (
              <>
                <Clock className="w-4 h-4" />
                Close Session & Finalize Wages
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Start New Attendance Session
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/supervisor/session/live"
          className="glass-card p-5 rounded-2xl border border-slate-200 hover:border-amber-400 group transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6 animate-pulse" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
          </div>
          <h3 className="mt-3 font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
            Live Scanner Kiosk
          </h3>
          <p className="text-xs text-slate-600 mt-1 font-medium">Real-time AI face recognition & anti-spoof scanner</p>
        </Link>

        <Link
          href="/supervisor/enroll"
          className="glass-card p-5 rounded-2xl border border-slate-200 hover:border-amber-400 group transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-orange-100 border border-orange-300 flex items-center justify-center text-orange-700 group-hover:scale-110 transition-transform">
              <UserCheck className="w-6 h-6" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 transition-colors" />
          </div>
          <h3 className="mt-3 font-bold text-slate-900 group-hover:text-orange-700 transition-colors">
            Enroll New Worker
          </h3>
          <p className="text-xs text-slate-600 mt-1 font-medium">Capture webcam 128-d reference descriptor vector</p>
        </Link>

        <Link
          href="/supervisor/review"
          className="glass-card p-5 rounded-2xl border border-slate-200 hover:border-amber-400 group transition-all relative"
        >
          {pendingReviewCount > 0 && (
            <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950 animate-bounce shadow-md">
              {pendingReviewCount} PENDING
            </span>
          )}
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <h3 className="mt-3 font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
            Manual Review Queue
          </h3>
          <p className="text-xs text-slate-600 mt-1 font-medium">Side-by-side audit for borderline & spoof flags</p>
        </Link>

        <Link
          href="/supervisor/export"
          className="glass-card p-5 rounded-2xl border border-slate-200 hover:border-amber-400 group transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
          </div>
          <h3 className="mt-3 font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
            CSV Wage Export
          </h3>
          <p className="text-xs text-slate-600 mt-1 font-medium">Generate official site wage payout spreadsheet</p>
        </Link>
      </div>

      {/* Stats Overview Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-200">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Enrolled Site Workers</div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">{workers.length}</div>
          <div className="text-xs text-amber-700 mt-1 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> 100% Face vectors cached
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Confirmed Present Today</div>
          <div className="text-3xl font-extrabold text-amber-600 mt-1">{autoConfirmedCount}</div>
          <div className="text-xs text-slate-600 mt-1 font-medium">Verified via webcam AI</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Manual Review Needed</div>
          <div className="text-3xl font-extrabold text-amber-700 mt-1">{pendingReviewCount}</div>
          <div className="text-xs text-amber-700 mt-1 font-medium">Requires supervisor decision</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Computed Daily Payout</div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">₹{totalWagePayoutToday.toLocaleString('en-IN')}</div>
          <div className="text-xs text-slate-600 mt-1 font-medium">Standard ₹350/day wage rate</div>
        </div>
      </div>

      {/* Low Attendance Alert Section (<70% over 10 days) */}
      {lowAttendanceWorkers.length > 0 && (
        <div className="p-6 rounded-3xl bg-amber-50/80 border border-amber-200 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
              <TrendingDown className="w-5 h-5 text-amber-700" />
              Low Attendance Warning (&lt;70% Presence over last 10 sessions)
            </div>
            <span className="text-xs font-bold text-amber-900 px-2.5 py-0.5 rounded-full bg-amber-200/70 border border-amber-300">
              Potential Proxy Fraud Risk
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowAttendanceWorkers.map((w: any) => (
              <div key={w.id} className="p-4 rounded-2xl bg-white border border-amber-200 flex items-center gap-3.5 shadow-sm">
                <img
                  src={w.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={w.name}
                  className="w-11 h-11 rounded-xl object-cover border border-amber-300 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-900 truncate">{w.name}</div>
                  <div className="text-xs text-slate-500 font-mono">{w.phone}</div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-extrabold border border-amber-300">
                    {w.attendancePercentage}%
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1 font-mono">{w.presentCount}/10 Days</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Attendees Stream Table for Current Session */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Today's Live Attendance Log</h2>
            <p className="text-xs text-slate-600 font-medium">Updates live via background polling during active site sessions</p>
          </div>
          <span className="text-xs font-mono text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 font-semibold">
            {attendances.length} Records Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-slate-600 border-b border-slate-200 uppercase tracking-wider bg-slate-50/80">
              <tr>
                <th className="py-3 px-4">Worker</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Distance Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Daily Wage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {attendances.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500 text-xs font-medium">
                    No attendance records logged yet for today's session. Start the Live Scanner Kiosk to begin!
                  </td>
                </tr>
              ) : (
                attendances.map((att: any) => (
                  <tr key={att.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <img
                        src={att.worker?.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                        alt={att.worker?.name}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-sm"
                      />
                      <span className="font-semibold text-slate-900">{att.worker?.name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600">{att.worker?.phone}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {new Date(att.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-amber-800 border border-slate-200 font-bold">
                        {att.confidence_score?.toFixed(3)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {att.status === 'auto_confirmed' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          Auto-Confirmed
                        </span>
                      )}
                      {att.status === 'manual_review' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-900 border border-orange-300">
                          Needs Review
                        </span>
                      )}
                      {att.status === 'manual_approved' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          Approved
                        </span>
                      )}
                      {att.status === 'manual_rejected' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      ₹{att.worker?.wage_rate_per_day || 350}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
