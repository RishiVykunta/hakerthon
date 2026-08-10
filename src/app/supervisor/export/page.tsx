'use client'

import { useEffect, useState } from 'react'
import { FileSpreadsheet, Download, RefreshCw, CheckCircle2, ArrowLeft, Calendar, DollarSign, Sprout } from 'lucide-react'

export default function WageExportPage() {
  const [sessions, setSessions] = useState<any[]>([])
  const [selectedSessionId, setSelectedSessionId] = useState<string>('')
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSessions() {
      try {
        const res = await fetch('/api/sessions')
        const data = await res.json()
        const sessList = data.sessions || []
        setSessions(sessList)
        if (sessList.length > 0) {
          setSelectedSessionId(sessList[0].id)
          fetchSessionAttendance(sessList[0].id)
        }
      } catch (err) {
        console.error('Error fetching sessions:', err)
      } finally {
        setLoading(false)
      }
    }
    loadSessions()
  }, [])

  const fetchSessionAttendance = async (sessionId: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/sessions/${sessionId}/attendance`)
      const data = await res.json()
      setAttendanceRecords(data.attendances || [])
    } catch (err) {
      console.error('Error fetching session attendance:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSessionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value
    setSelectedSessionId(id)
    fetchSessionAttendance(id)
  }

  // Filter only valid confirmed / approved attendance entries for wage payout
  const validRecords = attendanceRecords.filter(
    (a) => a.status === 'auto_confirmed' || a.status === 'manual_approved'
  )

  const totalPayout = validRecords.reduce((sum, item) => sum + (item.worker?.wage_rate_per_day || 350), 0)

  // Generate & Download CSV Client-Side
  const handleDownloadCSV = () => {
    if (validRecords.length === 0) return

    const headers = ['Worker ID', 'Worker Name', 'Phone Number', 'Site ID', 'Session Date', 'Status', 'Days Present', 'Daily Rate (INR)', 'Computed Wage (INR)']
    
    const rows = validRecords.map((r) => [
      r.worker_id,
      `"${r.worker?.name || 'N/A'}"`,
      r.worker?.phone || 'N/A',
      'site_rampur_01',
      new Date(r.timestamp).toISOString().split('T')[0],
      r.status,
      '1.0',
      r.worker?.wage_rate_per_day || 350,
      r.worker?.wage_rate_per_day || 350,
    ])

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `GreenGrid_MGNREGA_WageReport_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1">
              <Sprout className="w-3.5 h-3.5" />
              Phase 4 • Wage Audit Center
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">CSV Payout Spreadsheets</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            Official Site Wage Payout Export
          </h1>
        </div>

        <button
          onClick={handleDownloadCSV}
          disabled={validRecords.length === 0}
          className="px-5 py-3 rounded-xl font-extrabold bg-emerald-500 text-slate-950 hover:bg-emerald-400 disabled:opacity-50 transition-all flex items-center gap-2 shadow-xl shadow-emerald-950/60 self-start sm:self-auto hover:scale-[1.02]"
        >
          <Download className="w-4 h-4 text-slate-950" />
          Export Wage CSV
        </button>
      </div>

      {/* Session Selector & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 space-y-2">
          <label className="block text-xs font-bold text-slate-300">Select Site Work Session</label>
          <select
            value={selectedSessionId}
            onChange={handleSessionChange}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
          >
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {new Date(s.date || s.created_at).toLocaleDateString()} • {s.id} ({s.status})
              </option>
            ))}
          </select>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Verified Attendees</div>
          <div className="text-2xl font-extrabold text-white">{validRecords.length} Workers</div>
          <div className="text-xs text-emerald-400 font-semibold">Confirmed for daily wage payout</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Computed Site Payout</div>
          <div className="text-2xl font-extrabold text-emerald-400">₹{totalPayout.toLocaleString('en-IN')}</div>
          <div className="text-xs text-slate-400">Calculated via verified daily wage rates</div>
        </div>
      </div>

      {/* Wage Table Preview */}
      <div className="glass-panel p-6 rounded-3xl border border-emerald-500/20 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-white text-base">Session Wage Payout Table Preview</h2>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            {validRecords.length} Verified Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-slate-400 border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Worker Name</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Verification Status</th>
                <th className="py-3 px-4">Days Present</th>
                <th className="py-3 px-4">Daily Rate</th>
                <th className="py-3 px-4">Computed Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {validRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                    No confirmed attendance records found for this session.
                  </td>
                </tr>
              ) : (
                validRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-900/40">
                    <td className="py-3.5 px-4 font-semibold text-white">{r.worker?.name}</td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-400">{r.worker?.phone}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-300">1.0 Day</td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-300">₹{r.worker?.wage_rate_per_day || 350}</td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-400">₹{r.worker?.wage_rate_per_day || 350}</td>
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
