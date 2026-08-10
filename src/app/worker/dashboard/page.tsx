'use client'

import { useEffect, useState } from 'react'
import { Wallet, Calendar, CheckCircle2, Clock, AlertCircle, ShieldCheck, ArrowLeft, History, FileText, Landmark } from 'lucide-react'

export default function WorkerDashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadWorkerDashboard() {
      try {
        const res = await fetch('/api/worker/dashboard')
        const result = await res.json()
        setData(result)
      } catch (err) {
        console.error('Error fetching worker dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    loadWorkerDashboard()
  }, [])

  if (loading) {
    return (
      <div className="glass-panel p-12 rounded-3xl text-center text-slate-400 space-y-3 max-w-xl mx-auto my-12">
        <Clock className="w-6 h-6 animate-spin mx-auto text-amber-400" />
        <p className="text-sm font-semibold">Fetching worker attendance history & wage records...</p>
      </div>
    )
  }

  const { worker, stats, attendances } = data || {}

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Profile Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <img
            src={worker?.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'}
            alt={worker?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-900 px-3 py-0.5 rounded-full bg-amber-100 border border-amber-300 flex items-center gap-1 shadow-sm">
                <Landmark className="w-3.5 h-3.5 text-amber-600" />
                Registered MGNREGA Worker
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">{worker?.name || 'Ramesh Singh'}</h1>
            <p className="text-xs text-slate-600 font-mono">
              Phone: {worker?.phone || '9876543211'} • Site: {worker?.site_name || 'Rampur Panchayat'}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-center sm:text-right shadow-sm">
          <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Daily Wage Rate</div>
          <div className="text-xl font-extrabold text-amber-700 mt-0.5">₹{worker?.wage_rate_per_day || 350} / Day</div>
        </div>
      </div>

      {/* Earnings & Presence Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-200 space-y-1">
          <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Days Worked</div>
          <div className="text-3xl font-extrabold text-slate-900">{stats?.totalDaysPresent || 12} Days</div>
          <div className="text-xs text-amber-700 font-semibold">Verified AI presence</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200 space-y-1">
          <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Payout Accumulated</div>
          <div className="text-3xl font-extrabold text-amber-600">₹{(stats?.totalWagesEarned || 4200).toLocaleString('en-IN')}</div>
          <div className="text-xs text-slate-600 font-medium">Direct wage calculation</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200 space-y-1">
          <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Disputed / In-Review</div>
          <div className="text-3xl font-extrabold text-amber-700">{stats?.pendingReviewCount || 0} Entries</div>
          <div className="text-xs text-amber-700 font-medium">Pending supervisor verification</div>
        </div>
      </div>

      {/* Attendance & Wage Audit Trail */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-600" />
            <h2 className="font-bold text-slate-900 text-lg">Attendance & Wage Dispute Audit Trail</h2>
          </div>
          <span className="text-xs font-mono text-slate-500 font-medium">Transparent Log</span>
        </div>

        <div className="space-y-3">
          {(!attendances || attendances.length === 0) ? (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 font-medium">
              No recent attendance entries recorded.
            </div>
          ) : (
            attendances.map((att: any) => (
              <div
                key={att.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {new Date(att.timestamp).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      ({new Date(att.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    {att.notes || 'Webcam AI face recognition verification'}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-extrabold text-slate-900">₹{worker?.wage_rate_per_day || 350}</div>
                    <div className="text-[10px] text-slate-500 font-mono">1.0 Day</div>
                  </div>

                  {att.status === 'auto_confirmed' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Auto Confirmed
                    </span>
                  )}
                  {att.status === 'manual_approved' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Approved
                    </span>
                  )}
                  {att.status === 'manual_review' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-900 border border-orange-300 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-orange-600" /> Under Review
                    </span>
                  )}
                  {att.status === 'manual_rejected' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Disputed / Rejected
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
