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
  UserMinus,
  Trash2,
  Search,
  Pencil,
  Save,
  X,
} from 'lucide-react'

export default function SupervisorDashboard() {
  const [session, setSession] = useState<any>(null)
  const [workers, setWorkers] = useState<any[]>([])
  const [attendances, setAttendances] = useState<any[]>([])
  const [lowAttendanceWorkers, setLowAttendanceWorkers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sessionActionLoading, setSessionActionLoading] = useState(false)

  // Worker Removal & Edit States
  const [deletingWorkerId, setDeletingWorkerId] = useState<string | null>(null)
  const [workerToDelete, setWorkerToDelete] = useState<any | null>(null)
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false)
  const [deletingAll, setDeletingAll] = useState(false)
  const [workerSearch, setWorkerSearch] = useState('')

  // Worker Edit States
  const [workerToEdit, setWorkerToEdit] = useState<any | null>(null)
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editWageRate, setEditWageRate] = useState('350')
  const [editingLoading, setEditingLoading] = useState(false)
  const [editError, setEditError] = useState('')

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
      const fetchedWorkers = workersData.workers || []
      setWorkers(fetchedWorkers)

      // 3. Fetch current session attendance
      if (activeSess?.id) {
        const attRes = await fetch(`/api/sessions/${activeSess.id}/attendance`)
        const attData = await attRes.json()
        setAttendances(attData.attendances || [])
      }

      // 4. Fetch low attendance analytics
      const lowAttRes = await fetch('/api/analytics/low-attendance?cutoff=70')
      const lowAttData = await lowAttRes.json()
      const flagged = lowAttData.flaggedWorkers || []
      const enrolledWorkerIds = new Set(fetchedWorkers.map((w: any) => w.id))
      setLowAttendanceWorkers(flagged.filter((w: any) => enrolledWorkerIds.has(w.id)))
    } catch (err) {
      console.error('Error loading dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(() => {
      fetchData()
    }, 3000)
    return () => clearInterval(interval)
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

  const handleDeleteWorker = async (workerId: string) => {
    setDeletingWorkerId(workerId)
    try {
      const res = await fetch(`/api/workers?id=${workerId}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok) {
        setWorkers((prev) => prev.filter((w) => w.id !== workerId))
        setLowAttendanceWorkers((prev) => prev.filter((w) => w.id !== workerId))
        setAttendances((prev) => prev.filter((a) => a.worker_id !== workerId))
        setWorkerToDelete(null)
      } else {
        alert(data.error || 'Failed to remove worker')
      }
    } catch (err) {
      console.error('Error removing worker:', err)
    } finally {
      setDeletingWorkerId(null)
    }
  }

  const handleDeleteAllWorkers = async () => {
    setDeletingAll(true)
    try {
      const res = await fetch('/api/workers?all=true', { method: 'DELETE' })
      const data = await res.json()
      if (res.ok) {
        setWorkers([])
        setLowAttendanceWorkers([])
        setAttendances([])
        setShowDeleteAllModal(false)
      } else {
        alert(data.error || 'Failed to remove all workers')
      }
    } catch (err) {
      console.error('Error removing all workers:', err)
    } finally {
      setDeletingAll(false)
    }
  }

  const openEditModal = (worker: any) => {
    setWorkerToEdit(worker)
    setEditName(worker.name || '')
    setEditPhone(worker.phone || '')
    setEditWageRate(String(worker.wage_rate_per_day || 350))
    setEditError('')
  }

  const handleSaveWorkerEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!workerToEdit) return
    setEditingLoading(true)
    setEditError('')

    try {
      const res = await fetch('/api/workers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: workerToEdit.id,
          name: editName,
          phone: editPhone,
          wage_rate_per_day: parseFloat(editWageRate),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update worker details')
      }

      setWorkers((prev) =>
        prev.map((w) => (w.id === workerToEdit.id ? { ...w, ...data.worker } : w))
      )
      setLowAttendanceWorkers((prev) =>
        prev.map((w) => (w.id === workerToEdit.id ? { ...w, name: editName, phone: editPhone } : w))
      )
      setAttendances((prev) =>
        prev.map((a) =>
          a.worker_id === workerToEdit.id
            ? { ...a, worker: { ...a.worker, name: editName, phone: editPhone, wage_rate_per_day: parseFloat(editWageRate) } }
            : a
        )
      )

      setWorkerToEdit(null)
    } catch (err: any) {
      setEditError(err.message || 'Failed to update worker details')
    } finally {
      setEditingLoading(false)
    }
  }

  const filteredWorkers = workers.filter((w) => {
    const q = workerSearch.toLowerCase()
    return w.name?.toLowerCase().includes(q) || w.phone?.includes(q)
  })

  const autoConfirmedCount = attendances.filter(
    (a) => a.status === 'auto_confirmed' || a.status === 'manual_approved'
  ).length
  const pendingReviewCount = attendances.filter((a) => a.status === 'manual_review').length
  const totalWagePayoutToday = attendances
    .filter((a) => a.status === 'auto_confirmed' || a.status === 'manual_approved')
    .reduce((sum, att) => {
      const hours = att.total_hours || (att.out_time ? 8.0 : 8.0)
      const rate = att.worker?.wage_rate_per_day || 350
      return sum + Math.round((hours / 8.0) * rate)
    }, 0)

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-900 px-3 py-0.5 rounded-full bg-amber-100 border border-amber-300 flex items-center gap-1 shadow-2xs">
              <Landmark className="w-3.5 h-3.5 text-amber-600" />
              Worksite #4 (Rampur)
            </span>
            <span className="text-slate-300">•</span>
            {session?.status === 'active' ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 px-3 py-0.5 rounded-full bg-amber-100 border border-amber-300 shadow-2xs">
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
          <div className="text-xs text-slate-600 mt-1 font-medium">Based on hours worked & wage rates</div>
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

      {/* Enrolled Site Workers Directory (With Remove Worker Option) */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-bold text-slate-900">Enrolled Site Workers Directory</h2>
            </div>
            <p className="text-xs text-slate-600 font-medium">Manage registered site workers and face descriptor profiles</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search name or phone..."
                value={workerSearch}
                onChange={(e) => setWorkerSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs w-48 sm:w-64"
              />
            </div>
            {workers.length > 0 && (
              <button
                onClick={() => setShowDeleteAllModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-extrabold text-xs hover:bg-rose-100 transition-all flex items-center gap-1.5 shadow-2xs shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                Remove All
              </button>
            )}
            <Link
              href="/supervisor/enroll"
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs hover:bg-amber-400 transition-all flex items-center gap-1.5 shadow-2xs shrink-0"
            >
              <UserCheck className="w-3.5 h-3.5" />
              + Enroll New
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-slate-600 border-b border-slate-200 uppercase tracking-wider bg-slate-50/80">
              <tr>
                <th className="py-3 px-4">Worker Profile</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Daily Wage</th>
                <th className="py-3 px-4">Face Descriptor</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filteredWorkers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 text-xs font-medium">
                    {workerSearch ? 'No workers match your search.' : 'No workers enrolled yet for this site.'}
                  </td>
                </tr>
              ) : (
                filteredWorkers.map((w: any) => (
                  <tr key={w.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <img
                        src={w.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                        alt={w.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">{w.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">ID: {w.id}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600">{w.phone}</td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      ₹{w.wage_rate_per_day || 350} / Day
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-mono font-bold">
                        128-D Cached
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(w)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300 transition-all flex items-center gap-1.5 shadow-2xs"
                        >
                          <Pencil className="w-3.5 h-3.5 text-amber-600" />
                          Edit Details
                        </button>
                        <button
                          onClick={() => setWorkerToDelete(w)}
                          disabled={deletingWorkerId === w.id}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-all flex items-center gap-1.5 shadow-2xs"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          Remove Worker
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Worker Details Modal */}
      {workerToEdit && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white max-w-md w-full space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center font-bold">
                  <Pencil className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Edit Worker Profile</h3>
                  <p className="text-[11px] text-slate-500 font-mono">ID: {workerToEdit.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setWorkerToEdit(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {editError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                {editError}
              </div>
            )}

            <form onSubmit={handleSaveWorkerEdit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Worker Full Name *</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-amber-500 shadow-2xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">10-Digit Mobile Number *</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono focus:outline-none focus:border-amber-500 shadow-2xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Daily Wage Rate (₹) *</label>
                <input
                  type="number"
                  value={editWageRate}
                  onChange={(e) => setEditWageRate(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono focus:outline-none focus:border-amber-500 shadow-2xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setWorkerToEdit(null)}
                  disabled={editingLoading}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editingLoading}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-all flex items-center gap-2 shadow-md shadow-amber-500/20"
                >
                  {editingLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Removing Worker */}
      {workerToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white max-w-md w-full space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <UserMinus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Remove Worker Record</h3>
                <p className="text-xs text-slate-500">Confirm worker deletion from site database</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 text-xs text-rose-900 space-y-2">
              <p className="font-semibold">
                Are you sure you want to remove <span className="font-extrabold text-slate-900 underline">{workerToDelete.name}</span> ({workerToDelete.phone})?
              </p>
              <p className="text-[11px] text-rose-700 leading-relaxed font-medium">
                This will delete their 128-d face descriptor profile and attendance records for this worksite. This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setWorkerToDelete(null)}
                disabled={deletingWorkerId === workerToDelete.id}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteWorker(workerToDelete.id)}
                disabled={deletingWorkerId === workerToDelete.id}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold transition-all flex items-center gap-2 shadow-lg shadow-rose-600/20"
              >
                {deletingWorkerId === workerToDelete.id ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Confirm Remove
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Removing ALL Workers */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white max-w-md w-full space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Remove All Enrolled Workers</h3>
                <p className="text-xs text-slate-500">Bulk delete worker directory & face vectors</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 text-xs text-rose-900 space-y-2">
              <p className="font-semibold">
                Are you sure you want to remove ALL <span className="font-extrabold text-slate-900 underline">{workers.length} worker(s)</span> from this worksite?
              </p>
              <p className="text-[11px] text-rose-700 leading-relaxed font-medium">
                This will delete all enrolled worker face profiles, attendance history, and low attendance records for this site. This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteAllModal(false)}
                disabled={deletingAll}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAllWorkers}
                disabled={deletingAll}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold transition-all flex items-center gap-2 shadow-lg shadow-rose-600/20"
              >
                {deletingAll ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Confirm Remove All
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Attendees Stream Table for Current Session */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Today's Live Attendance & Hourly Wage Log</h2>
            <p className="text-xs text-slate-600 font-medium">Tracks worker check-in time, check-out time, total hours, and computed wages</p>
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
                <th className="py-3 px-4">In Time</th>
                <th className="py-3 px-4">Out Time</th>
                <th className="py-3 px-4">Total Hours</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Computed Wage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {attendances.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500 text-xs font-medium">
                    No attendance records logged yet for today's session. Start the Live Scanner Kiosk to begin!
                  </td>
                </tr>
              ) : (
                attendances.map((att: any) => {
                  const inTimeStr = att.in_time ? new Date(att.in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(att.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  const outTimeStr = att.out_time ? new Date(att.out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'
                  const hours = att.total_hours || (att.out_time ? 8.0 : null)
                  const dailyRate = att.worker?.wage_rate_per_day || 350
                  const computedWage = hours ? Math.round((hours / 8.0) * dailyRate) : Math.round(dailyRate)

                  return (
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
                      <td className="py-3.5 px-4 text-xs font-mono font-bold text-emerald-700">
                        {inTimeStr}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono font-bold text-amber-800">
                        {outTimeStr}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs">
                        {hours ? (
                          <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 font-extrabold">
                            {hours} hrs
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[11px]">
                            In Progress
                          </span>
                        )}
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
                        ₹{computedWage}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
