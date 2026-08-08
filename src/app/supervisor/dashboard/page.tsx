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
    <div className="space-y-8">
      {/* Site Top Header & Active Session Control */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Active Site: Rampur Panchayat
            </span>
            {session?.status === 'active' ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                SESSION ACTIVE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                SESSION CLOSED
              </span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            GreenGrid MGNREGA Worksite #4
          </h1>
          <p className="text-xs text-slate-400">Site Supervisor: Rajesh Kumar • Location: Sitapur District, UP</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleToggleSession}
            disabled={sessionActionLoading}
            className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg ${
              session?.status === 'active'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-950/50'
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
          className="glass-card p-5 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/50 group transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Camera className="w-5 h-5 animate-pulse" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </div>
          <h3 className="mt-3 font-bold text-white group-hover:text-emerald-400 transition-colors">
            Live Scanner Kiosk
          </h3>
          <p className="text-xs text-slate-400 mt-1">Start webcam recognition & liveness check</p>
        </Link>

        <Link
          href="/supervisor/enroll"
          className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 group transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
          </div>
          <h3 className="mt-3 font-bold text-white group-hover:text-teal-400 transition-colors">
            Enroll New Worker
          </h3>
          <p className="text-xs text-slate-400 mt-1">Capture 128-d descriptor & reference photo</p>
        </Link>

        <Link
          href="/supervisor/review"
          className="glass-card p-5 rounded-2xl border border-amber-500/20 hover:border-amber-500/50 group transition-all relative"
        >
          {pendingReviewCount > 0 && (
            <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950 animate-bounce">
              {pendingReviewCount} PENDING
            </span>
          )}
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <h3 className="mt-3 font-bold text-white group-hover:text-amber-400 transition-colors">
            Manual Review Queue
          </h3>
          <p className="text-xs text-slate-400 mt-1">Inspect borderline & liveness flagged entries</p>
        </Link>

        <Link
          href="/supervisor/export"
          className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 group transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
          </div>
          <h3 className="mt-3 font-bold text-white group-hover:text-blue-400 transition-colors">
            CSV Wage Export
          </h3>
          <p className="text-xs text-slate-400 mt-1">Export session wage breakdown spreadsheet</p>
        </Link>
      </div>

      {/* Stats Overview Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Enrolled Site Workers</div>
          <div className="text-3xl font-extrabold text-white mt-1">{workers.length}</div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Face descriptors cached
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Confirmed Present Today</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1">{autoConfirmedCount}</div>
          <div className="text-xs text-slate-400 mt-1">Auto-matched via AI webcam</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Manual Review Needed</div>
          <div className="text-3xl font-extrabold text-amber-400 mt-1">{pendingReviewCount}</div>
          <div className="text-xs text-amber-400/80 mt-1">Requires supervisor check</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Computed Daily Payout</div>
          <div className="text-3xl font-extrabold text-white mt-1">₹{totalWagePayoutToday.toLocaleString('en-IN')}</div>
          <div className="text-xs text-slate-400 mt-1">Based on ₹350 standard rate</div>
        </div>
      </div>

      {/* Low Attendance Alert Section */}
      {lowAttendanceWorkers.length > 0 && (
        <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
            <TrendingDown className="w-5 h-5" />
            Low Attendance Alert (&lt;70% over last 10 sessions)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowAttendanceWorkers.map((w: any) => (
              <div key={w.id} className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/20 flex items-center gap-3">
                <img
                  src={w.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={w.name}
                  className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">{w.name}</div>
                  <div className="text-xs text-slate-400">{w.phone}</div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 text-xs font-bold">
                    {w.attendancePercentage}%
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">{w.presentCount}/10 Days</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Attendees List for Current Session */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Today's Live Attendance Stream</h2>
            <p className="text-xs text-slate-400">Updates live via short polling during active session</p>
          </div>
          <span className="text-xs text-slate-400">{attendances.length} Records Logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-slate-400 border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Worker</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Distance / Confidence</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Daily Wage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {attendances.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                    No attendance records logged yet for today's session. Start the Live Scanner Kiosk to begin!
                  </td>
                </tr>
              ) : (
                attendances.map((att: any) => (
                  <tr key={att.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={att.worker?.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                        alt={att.worker?.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-700"
                      />
                      <span className="font-semibold text-white">{att.worker?.name}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-400">{att.worker?.phone}</td>
                    <td className="py-3 px-4 text-xs text-slate-400">
                      {new Date(att.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400">
                        {att.confidence_score?.toFixed(3)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {att.status === 'auto_confirmed' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Auto-Confirmed
                        </span>
                      )}
                      {att.status === 'manual_review' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          Needs Review
                        </span>
                      )}
                      {att.status === 'manual_approved' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-500/15 text-teal-400 border border-teal-500/30">
                          Approved
                        </span>
                      )}
                      {att.status === 'manual_rejected' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
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
