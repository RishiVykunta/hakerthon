'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, RefreshCw, ArrowLeft, Eye, Sprout } from 'lucide-react'

export default function ManualReviewQueuePage() {
  const [reviewItems, setReviewItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [notesInput, setNotesInput] = useState<{ [id: string]: string }>({})

  const fetchReviewQueue = async () => {
    setLoading(true)
    try {
      // Fetch active session or last session attendances
      const sessionRes = await fetch('/api/sessions')
      const sessionData = await sessionRes.json()
      const activeSess = sessionData.sessions?.[0]

      if (activeSess?.id) {
        const attRes = await fetch(`/api/sessions/${activeSess.id}/attendance`)
        const attData = await attRes.json()
        const pending = (attData.attendances || []).filter(
          (a: any) => a.status === 'manual_review'
        )
        setReviewItems(pending)
      }
    } catch (err) {
      console.error('Error fetching review queue:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviewQueue()
  }, [])

  const handleDecision = async (attendanceId: string, decisionStatus: 'manual_approved' | 'manual_rejected') => {
    setProcessingId(attendanceId)
    try {
      const note = notesInput[attendanceId] || ''
      const res = await fetch('/api/attendance', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attendance_id: attendanceId,
          status: decisionStatus,
          notes: note,
        }),
      })

      if (res.ok) {
        setReviewItems((prev) => prev.filter((item) => item.id !== attendanceId))
      }
    } catch (err) {
      console.error('Error updating review decision:', err)
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-amber-400 flex items-center gap-1">
              <Sprout className="w-3.5 h-3.5 text-amber-400" />
              Phase 3 • Site Verification
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Manual Review Queue</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            Borderline & Spoof Inspection Queue
          </h1>
        </div>

        <button
          onClick={fetchReviewQueue}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Queue
        </button>
      </div>

      {loading ? (
        <div className="glass-panel p-12 rounded-3xl text-center text-slate-400 space-y-3">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-400" />
          <p className="text-sm font-semibold">Loading borderline attendance review queue...</p>
        </div>
      ) : reviewItems.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4 border border-emerald-500/20 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white">Manual Review Queue Clear!</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            All attendance matches for today's site session are either auto-confirmed or already verified by the supervisor.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviewItems.map((item) => (
            <div
              key={item.id}
              className="glass-panel-amber p-6 rounded-3xl border border-amber-500/40 space-y-6 shadow-2xl relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-extrabold text-white text-lg">{item.worker?.name || 'Best Match Candidate'}</div>
                    <div className="text-xs text-slate-400 font-mono">
                      Logged at {new Date(item.timestamp).toLocaleTimeString()} • Phone: {item.worker?.phone}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Euclidean Dist: {item.confidence_score?.toFixed(3)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300">
                    Daily Wage: ₹{item.worker?.wage_rate_per_day || 350}
                  </span>
                </div>
              </div>

              {/* Side-by-Side Photo Audit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Captured Frame Snapshot */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-rose-400 flex items-center gap-1.5">
                      <Eye className="w-4 h-4" /> Captured Frame Snapshot
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Live Webcam Frame</span>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 aspect-[4/3] flex items-center justify-center shadow-md">
                    <img
                      src={item.snapshot_url || item.worker?.photo_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'}
                      alt="Captured Frame"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Enrolled Reference Photo */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> Enrolled Reference Photo
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Cloudinary Reference</span>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 aspect-[4/3] flex items-center justify-center shadow-md">
                    <img
                      src={item.worker?.photo_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'}
                      alt="Enrolled Reference"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Reason & Supervisor Verification Notes Input */}
              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                  <span className="font-bold text-amber-400">Review Trigger Reason:</span>
                  <span>{item.notes || 'Borderline match similarity score requires visual verification'}</span>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400">Supervisor Verification Note (Optional)</label>
                  <input
                    type="text"
                    value={notesInput[item.id] || ''}
                    onChange={(e) => setNotesInput({ ...notesInput, [item.id]: e.target.value })}
                    placeholder="e.g. Visually confirmed worker identity at job site"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => handleDecision(item.id, 'manual_rejected')}
                  disabled={processingId === item.id}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-all flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" /> Reject Attendance
                </button>
                <button
                  onClick={() => handleDecision(item.id, 'manual_approved')}
                  disabled={processingId === item.id}
                  className="px-5 py-2.5 rounded-xl font-extrabold text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-950/60"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve & Record Wage
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
