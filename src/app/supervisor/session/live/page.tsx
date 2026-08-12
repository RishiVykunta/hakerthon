'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Camera,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  UserCheck,
  Zap,
  ArrowLeft,
  Lock,
  Eye,
  Landmark,
  LogIn,
  LogOut,
  Clock,
  Search,
  Check,
  X,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'
import { loadFaceModels, extractFaceData, DetectedFaceResult } from '@/lib/faceApi'
import { findBestMatch, checkLandmarkMovement, EnrolledCandidate, Point2D } from '@/lib/math'

export default function LiveAttendancePage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // State Management
  const [activeSession, setActiveSession] = useState<any>(null)
  const [enrolledWorkers, setEnrolledWorkers] = useState<EnrolledCandidate[]>([])
  const [modelsReady, setModelsReady] = useState(false)
  const [statusMsg, setStatusMsg] = useState('Initializing Face Recognition Engine...')
  const [scanning, setScanning] = useState(false)

  // Scan Mode Selection State: 'CHECK_IN' (In Time) vs 'CHECK_OUT' (Out Time)
  const [scanMode, setScanMode] = useState<'CHECK_IN' | 'CHECK_OUT'>('CHECK_IN')

  // Auto-Mark vs Require Manual "Mark Attendance" Click Toggle
  // Default to false so attendance is ONLY marked when clicking "Mark Attendance" button
  const [autoMarkMode, setAutoMarkMode] = useState(false)

  // Detected Scanned Candidate (Waiting for Supervisor "Mark Attendance" Click)
  const [scannedCandidate, setScannedCandidate] = useState<{
    worker: any
    distance: number
    livenessPassed: boolean
    livenessMsg: string
    snapshotUrl: string | null
    finalStatus: 'auto_confirmed' | 'manual_review'
    finalNotes: string
  } | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [successAlert, setSuccessAlert] = useState<string | null>(null)
  const [manualSearch, setManualSearch] = useState('')

  // Liveness Frame Memory
  const prevLandmarksRef = useRef<Point2D[] | null>(null)
  const lastMatchTimeRef = useRef<{ [workerId: string]: number }>({})

  const [attendances, setAttendances] = useState<any[]>([])

  // 1. Initial Setup: Load Models, Active Session & Enrolled Workers
  useEffect(() => {
    async function init() {
      // Load face-api models
      const ready = await loadFaceModels((msg) => setStatusMsg(msg))
      setModelsReady(ready)

      // Fetch or start session
      try {
        const sessionRes = await fetch('/api/sessions', { method: 'POST' })
        const sessionData = await sessionRes.json()
        if (sessionData.session) {
          setActiveSession(sessionData.session)
          fetchSessionAttendance(sessionData.session.id)
        }
      } catch (err) {
        console.error('Session init error:', err)
      }

      // Fetch enrolled worker descriptors for this site
      try {
        const workersRes = await fetch('/api/workers?site_id=site_rampur_01')
        const workersData = await workersRes.json()
        setEnrolledWorkers(workersData.workers || [])
      } catch (err) {
        console.error('Error fetching site workers:', err)
      }

      startCamera()
    }

    init()

    return () => {
      stopCamera()
    }
  }, [])

  // 2. Poll session attendance list every 3 seconds (Short Polling)
  useEffect(() => {
    if (!activeSession?.id) return
    const interval = setInterval(() => {
      fetchSessionAttendance(activeSession.id)
    }, 3000)
    return () => clearInterval(interval)
  }, [activeSession])

  const fetchSessionAttendance = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}/attendance`)
      const data = await res.json()
      setAttendances(data.attendances || [])
    } catch (err) {
      console.error('Error polling attendance:', err)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error('Camera access failed:', err)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((t) => t.stop())
      videoRef.current.srcObject = null
    }
  }

  // 3. Continuous Scanning Loop
  useEffect(() => {
    if (!modelsReady || !videoRef.current) return

    let isScanningCycle = false

    const scanInterval = setInterval(async () => {
      if (isScanningCycle || !videoRef.current || videoRef.current.paused || videoRef.current.ended) return

      try {
        setScanning(true)
        const faceResult = await extractFaceData(videoRef.current)

        // Draw Bounding Box overlay on Canvas
        drawCanvasOverlay(faceResult)

        if (faceResult) {
          isScanningCycle = true
          await processFaceMatch(faceResult)
          setTimeout(() => {
            isScanningCycle = false
          }, 1500)
        }
      } catch (err) {
        console.error('Scan error:', err)
      } finally {
        setScanning(false)
      }
    }, 800)

    return () => clearInterval(scanInterval)
  }, [modelsReady, enrolledWorkers, activeSession, scanMode, autoMarkMode])

  const drawCanvasOverlay = (result: DetectedFaceResult | null) => {
    if (!canvasRef.current || !videoRef.current) return
    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (result && result.box) {
      const { x, y, width, height } = result.box
      // Draw Bounding box based on mode
      ctx.strokeStyle = scanMode === 'CHECK_IN' ? '#10b981' : '#f59e0b'
      ctx.lineWidth = 3
      ctx.strokeRect(x, y, width, height)

      // Draw Corner Reticles
      const lineLen = 16
      ctx.lineWidth = 4
      ctx.strokeStyle = scanMode === 'CHECK_IN' ? '#34d399' : '#fbbf24'

      // Top-Left
      ctx.beginPath()
      ctx.moveTo(x, y + lineLen)
      ctx.lineTo(x, y)
      ctx.lineTo(x + lineLen, y)
      ctx.stroke()

      // Top-Right
      ctx.beginPath()
      ctx.moveTo(x + width - lineLen, y)
      ctx.lineTo(x + width, y)
      ctx.lineTo(x + width, y + lineLen)
      ctx.stroke()

      // Bottom-Left
      ctx.beginPath()
      ctx.moveTo(x, y + height - lineLen)
      ctx.lineTo(x, y + height)
      ctx.lineTo(x + lineLen, y + height)
      ctx.stroke()

      // Bottom-Right
      ctx.beginPath()
      ctx.moveTo(x + width - lineLen, y + height)
      ctx.lineTo(x + width, y + height)
      ctx.lineTo(x + width, y + height - lineLen)
      ctx.stroke()
    }
  }

  // 4. Process Match & Candidate Selection
  const processFaceMatch = async (faceResult: DetectedFaceResult) => {
    if (!enrolledWorkers || enrolledWorkers.length === 0) return

    // A. Liveness Check
    const livenessResult = checkLandmarkMovement(prevLandmarksRef.current || [], faceResult.landmarks)
    const livenessPassed = livenessResult.isLive
    const livenessMsg = livenessResult.message
    prevLandmarksRef.current = faceResult.landmarks

    // B. Match face descriptor against site database
    const match = findBestMatch(faceResult.descriptor, enrolledWorkers)

    if (!match.worker) return

    // Cooldown check (don't override candidate if already logged in last 10s)
    const now = Date.now()
    const lastLogged = lastMatchTimeRef.current[match.worker.id] || 0
    if (now - lastLogged < 10000 && !scannedCandidate) {
      return
    }

    let finalStatus: 'auto_confirmed' | 'manual_review' = match.status === 'auto_confirmed' ? 'auto_confirmed' : 'manual_review'
    let finalNotes = match.reason || ''

    if (!livenessPassed) {
      finalStatus = 'manual_review'
      finalNotes = `Liveness Check Failed: Static photo suspected (${livenessMsg})`
    }

    // Capture snapshot canvas frame
    let snapshotUrl: string | null = null
    if (canvasRef.current && videoRef.current) {
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = videoRef.current.videoWidth || 640
      tempCanvas.height = videoRef.current.videoHeight || 480
      const tCtx = tempCanvas.getContext('2d')
      if (tCtx) {
        tCtx.drawImage(videoRef.current, 0, 0)
        snapshotUrl = tempCanvas.toDataURL('image/jpeg', 0.8)
      }
    }

    const candidateObj = {
      worker: match.worker,
      distance: match.distance,
      livenessPassed,
      livenessMsg,
      snapshotUrl,
      finalStatus,
      finalNotes,
    }

    setScannedCandidate(candidateObj)

    // If Auto-Mark mode is explicitly turned ON by supervisor, auto-submit
    if (autoMarkMode) {
      await handleExecuteMarkAttendance(candidateObj)
    }
  }

  // 5. Core Action Handler: MARK ATTENDANCE (Triggered when user clicks "Mark Attendance" button)
  const handleExecuteMarkAttendance = async (candidateToMark?: any, directWorkerId?: string) => {
    const targetCandidate = candidateToMark || scannedCandidate
    const workerId = directWorkerId || targetCandidate?.worker?.id

    if (!workerId) return

    setSubmitting(true)

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: activeSession?.id || 'session_demo_01',
          worker_id: workerId,
          confidence_score: targetCandidate?.distance || 0.18,
          status: targetCandidate?.finalStatus || 'auto_confirmed',
          snapshot_url: targetCandidate?.snapshotUrl || null,
          notes: targetCandidate?.finalNotes || `Marked via Supervisor Option (${scanMode})`,
          scan_type: scanMode, // Explicitly pass 'CHECK_IN' or 'CHECK_OUT'
        }),
      })

      const data = await res.json()

      lastMatchTimeRef.current[workerId] = Date.now()

      const workerName = targetCandidate?.worker?.name || enrolledWorkers.find((w) => w.id === workerId)?.name || 'Worker'
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

      setSuccessAlert(
        `🎉 Attendance Marked Successfully! Worker: ${workerName} • Mode: ${scanMode === 'CHECK_IN' ? 'CHECK-IN (In Time)' : 'CHECK-OUT (Out Time)'} • Logged at ${timeStr}`
      )

      // Refresh live attendance list immediately
      if (activeSession?.id) {
        await fetchSessionAttendance(activeSession.id)
      }

      setScannedCandidate(null)

      setTimeout(() => {
        setSuccessAlert(null)
      }, 5000)
    } catch (err) {
      console.error('Error executing Mark Attendance:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const filteredEnrolledWorkers = enrolledWorkers.filter((w) => {
    const q = manualSearch.toLowerCase()
    return w.name.toLowerCase().includes(q) || w.phone.includes(q)
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Success Toast */}
      {successAlert && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-between shadow-xl animate-in slide-in-from-top border border-emerald-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-100" />
            <span>{successAlert}</span>
          </div>
          <button onClick={() => setSuccessAlert(null)} className="p-1 hover:bg-emerald-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Attendance Mode Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/supervisor/dashboard"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </Link>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-extrabold text-amber-800 flex items-center gap-1">
              <Landmark className="w-3.5 h-3.5 text-amber-600" /> Live Kiosk Attendance Scanner
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            MGNREGA Site Face Recognition Kiosk
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Require Manual Click vs Auto Mark Mode Toggle */}
          <button
            type="button"
            onClick={() => setAutoMarkMode(!autoMarkMode)}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 border ${
              autoMarkMode
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-slate-900 text-white border-slate-800 shadow-md'
            }`}
            title="Toggle whether attendance requires clicking 'Mark Attendance' button"
          >
            {autoMarkMode ? (
              <>
                <ToggleRight className="w-4 h-4 text-amber-600" />
                Mode: Auto-Mark ON
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4 text-emerald-400" />
                Mode: Click "Mark Attendance"
              </>
            )}
          </button>

          {/* Prominent IN TIME / OUT TIME Mode Selector */}
          <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-md">
            <button
              type="button"
              onClick={() => setScanMode('CHECK_IN')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                scanMode === 'CHECK_IN'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <LogIn className="w-4 h-4" />
              IN TIME (Check-In)
            </button>
            <button
              type="button"
              onClick={() => setScanMode('CHECK_OUT')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                scanMode === 'CHECK_OUT'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700'
              }`}
            >
              <LogOut className="w-4 h-4" />
              OUT TIME (Check-Out)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Live Video Feed & Bounding Overlay */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-200 bg-slate-950 aspect-[4/3] flex items-center justify-center shadow-2xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none transform -scale-x-100" />

            {/* Scanner HUD Overlay Header */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2">
                <div className="px-3.5 py-1.5 rounded-xl glass-card text-xs font-mono font-bold text-amber-700 flex items-center gap-2 border border-amber-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  CAM STREAM
                </div>

                {/* Mode Indicator Banner */}
                {scanMode === 'CHECK_IN' ? (
                  <span className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-600 text-white shadow-md flex items-center gap-1.5 border border-emerald-500 animate-in fade-in">
                    <LogIn className="w-3.5 h-3.5" />
                    MODE: IN-TIME (CHECK IN)
                  </span>
                ) : (
                  <span className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-amber-600 text-white shadow-md flex items-center gap-1.5 border border-amber-500 animate-in fade-in">
                    <LogOut className="w-3.5 h-3.5" />
                    MODE: OUT-TIME (CHECK OUT)
                  </span>
                )}
              </div>

              <div className="px-3.5 py-1.5 rounded-xl glass-card text-xs font-mono font-bold text-slate-700 border border-slate-300">
                {scanning ? 'SCANNING...' : 'READY'}
              </div>
            </div>

            {/* Candidate Match Action Card Floating Overlay with Prominent "Mark Attendance" Option */}
            {scannedCandidate && (
              <div className="absolute bottom-4 left-4 right-4 p-5 rounded-3xl glass-panel bg-white/95 border-2 border-amber-400 shadow-2xl space-y-3 transition-all animate-in fade-in slide-in-from-bottom-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={scannedCandidate.worker?.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                      alt={scannedCandidate.worker?.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500 shrink-0 shadow-md"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-lg truncate">
                          {scannedCandidate.worker?.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-extrabold border border-amber-300">
                          Matched (Dist: {scannedCandidate.distance.toFixed(3)})
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 font-mono mt-0.5 flex items-center gap-2">
                        <span>Phone: {scannedCandidate.worker?.phone}</span>
                        <span>•</span>
                        <span className="font-bold text-slate-900">Wage: ₹{scannedCandidate.worker?.wage_rate_per_day || 350}/day</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setScannedCandidate(null)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Dismiss"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Primary Option: MARK ATTENDANCE BUTTON */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => handleExecuteMarkAttendance()}
                    disabled={submitting}
                    className={`flex-1 py-3 px-5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-xl ${
                      scanMode === 'CHECK_IN'
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                        : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                    }`}
                  >
                    {submitting ? (
                      <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        MARK ATTENDANCE ({scanMode === 'CHECK_IN' ? 'Check-In' : 'Check-Out'})
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setScannedCandidate(null)}
                    className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-300"
                  >
                    Scan Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Real-Time Session Attendees Side Drawer */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-200 space-y-4 flex flex-col h-[480px] shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Session Attendees</h2>
              <p className="text-[11px] text-slate-500 font-medium">In/Out Times & Total Hours Log</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
              {attendances.length} Logged
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {attendances.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
                <UserCheck className="w-10 h-10 opacity-50 text-amber-600" />
                <p className="text-xs font-medium">Waiting for workers to stand in front of webcam scanner...</p>
              </div>
            ) : (
              attendances.map((att: any) => {
                const inTimeStr = att.in_time ? new Date(att.in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(att.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                const outTimeStr = att.out_time ? new Date(att.out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null

                return (
                  <div
                    key={att.id}
                    className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={att.worker?.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                        alt={att.worker?.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{att.worker?.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                          <span className="text-emerald-700 font-bold">In: {inTimeStr}</span>
                          {outTimeStr ? (
                            <span className="text-amber-800 font-bold">• Out: {outTimeStr}</span>
                          ) : (
                            <span className="text-slate-400 font-medium">• Working</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {att.out_time ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                          {att.total_hours || 8.0} hrs
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                          Checked In
                        </span>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Manual Worker Attendance Register & Option Panel */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-bold text-slate-900">Enrolled Worker Direct Attendance Register</h2>
            </div>
            <p className="text-xs text-slate-600 font-medium">Select any worker to directly trigger their Check-In or Check-Out attendance</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search worker by name or phone..."
              value={manualSearch}
              onChange={(e) => setManualSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEnrolledWorkers.length === 0 ? (
            <div className="col-span-full py-8 text-center text-slate-500 text-xs font-medium">
              No workers match your search.
            </div>
          ) : (
            filteredEnrolledWorkers.map((w) => {
              const existingAtt = attendances.find((a) => a.worker_id === w.id)
              const isCheckedIn = existingAtt && !existingAtt.out_time
              const isCheckedOut = existingAtt && existingAtt.out_time

              return (
                <div key={w.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm hover:border-amber-400/60 transition-all">
                  <div className="flex items-center gap-3">
                    <img
                      src={w.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                      alt={w.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-slate-900 truncate">{w.name}</div>
                      <div className="text-xs text-slate-500 font-mono">{w.phone}</div>
                      <div className="text-[11px] font-extrabold text-amber-700 mt-0.5">₹{w.wage_rate_per_day || 350}/day</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[11px]">
                    <span className="text-slate-500 font-medium">
                      {isCheckedOut ? (
                        <span className="text-amber-800 font-bold">Checked Out ({existingAtt.total_hours || 8} hrs)</span>
                      ) : isCheckedIn ? (
                        <span className="text-emerald-700 font-bold">Checked In</span>
                      ) : (
                        <span>Not Logged Today</span>
                      )}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleExecuteMarkAttendance(null, w.id)}
                      disabled={submitting}
                      className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-sm ${
                        scanMode === 'CHECK_IN'
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                          : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      Mark Attendance
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
