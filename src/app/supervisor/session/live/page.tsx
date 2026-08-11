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

  // Liveness Frame Memory
  const prevLandmarksRef = useRef<Point2D[] | null>(null)
  const lastMatchTimeRef = useRef<{ [workerId: string]: number }>({})

  // UI Feedback Cards
  const [lastMatch, setLastMatch] = useState<{
    workerName: string
    distance: number
    status: 'auto_confirmed' | 'manual_review' | 'no_match' | 'spoof_rejected'
    reason?: string
    photoUrl?: string
  } | null>(null)

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

    let isSubmitting = false

    const scanInterval = setInterval(async () => {
      if (isSubmitting || !videoRef.current || videoRef.current.paused || videoRef.current.ended) return

      try {
        setScanning(true)
        const faceResult = await extractFaceData(videoRef.current)

        // Draw Bounding Box overlay on Canvas
        drawCanvasOverlay(faceResult)

        if (faceResult) {
          isSubmitting = true
          await processFaceMatch(faceResult)
          setTimeout(() => {
            isSubmitting = false
          }, 2000) // 2 second cooldown per recognition cycle
        }
      } catch (err) {
        console.error('Scan error:', err)
      } finally {
        setScanning(false)
      }
    }, 800)

    return () => clearInterval(scanInterval)
  }, [modelsReady, enrolledWorkers, activeSession, scanMode])

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

  // 4. Process Match & Anti-Spoofing Liveness Check
  const processFaceMatch = async (faceResult: DetectedFaceResult) => {
    if (!enrolledWorkers || enrolledWorkers.length === 0) {
      setLastMatch({
        workerName: 'No Workers Enrolled',
        distance: 1.0,
        status: 'no_match',
        reason: 'Please enroll workers from the Enroll Worker page first',
      })
      return
    }

    // A. Liveness Check
    const livenessResult = checkLandmarkMovement(prevLandmarksRef.current || [], faceResult.landmarks)
    const livenessPassed = livenessResult.isLive
    const livenessMsg = livenessResult.message
    prevLandmarksRef.current = faceResult.landmarks

    // B. Match face descriptor against site database
    const match = findBestMatch(faceResult.descriptor, enrolledWorkers)

    if (!match.worker) {
      setLastMatch({
        workerName: 'Unknown Face',
        distance: match.distance,
        status: 'no_match',
        reason: 'Face does not match any enrolled site worker',
      })
      return
    }

    // Cooldown check to prevent rapid multi-logging
    const now = Date.now()
    const lastLogged = lastMatchTimeRef.current[match.worker.id] || 0
    if (now - lastLogged < 10000) {
      setLastMatch({
        workerName: match.worker.name,
        distance: match.distance,
        status: 'auto_confirmed',
        reason: 'Already logged (10s Cooldown active)',
        photoUrl: match.worker.photo_url || undefined,
      })
      return
    }

    // C. Force into manual_review if liveness check failed
    let finalStatus: 'auto_confirmed' | 'manual_review' = match.status === 'auto_confirmed' ? 'auto_confirmed' : 'manual_review'
    let finalNotes = match.reason || ''

    if (!livenessPassed) {
      finalStatus = 'manual_review'
      finalNotes = `Liveness Check Failed: Static photo suspected (${livenessMsg})`
    }

    // D. Capture snapshot canvas frame for submission
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

    // E. POST Attendance to Backend API with explicit scan_type
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: activeSession?.id || 'session_demo_01',
          worker_id: match.worker.id,
          confidence_score: match.distance,
          status: finalStatus,
          snapshot_url: snapshotUrl,
          notes: finalNotes,
          scan_type: scanMode, // Explicitly pass 'CHECK_IN' or 'CHECK_OUT'
        }),
      })

      const data = await res.json()

      lastMatchTimeRef.current[match.worker.id] = now

      setLastMatch({
        workerName: match.worker.name,
        distance: match.distance,
        status: !livenessPassed ? 'spoof_rejected' : finalStatus,
        reason: data.message || finalNotes,
        photoUrl: match.worker.photo_url || undefined,
      })

      // Refresh live attendance list
      if (activeSession?.id) {
        fetchSessionAttendance(activeSession.id)
      }
    } catch (err) {
      console.error('Error logging attendance match:', err)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
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

        {/* Prominent IN TIME / OUT TIME Mode Selector */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-md">
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
                {scanning ? 'PROCESSING...' : 'IDLE'}
              </div>
            </div>

            {/* Match Status Card Floating Overlay */}
            {lastMatch && (
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl glass-panel border border-slate-200 shadow-2xl flex items-center gap-4 transition-all animate-in fade-in slide-in-from-bottom-2">
                <img
                  src={lastMatch.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                  alt={lastMatch.workerName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shrink-0 shadow-md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-slate-900 text-base truncate">{lastMatch.workerName}</span>
                    {lastMatch.status === 'auto_confirmed' && (
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-extrabold flex items-center gap-1 border border-amber-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> MATCH CONFIRMED
                      </span>
                    )}
                    {lastMatch.status === 'manual_review' && (
                      <span className="px-2.5 py-0.5 rounded-md bg-orange-100 text-orange-900 text-[10px] font-extrabold flex items-center gap-1 border border-orange-300">
                        <AlertTriangle className="w-3.5 h-3.5 text-orange-600" /> MANUAL REVIEW
                      </span>
                    )}
                    {lastMatch.status === 'spoof_rejected' && (
                      <span className="px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-900 text-[10px] font-extrabold flex items-center gap-1 border border-rose-300">
                        <Lock className="w-3.5 h-3.5 text-rose-600" /> SPOOF SUSPECTED
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-700 flex items-center gap-3 mt-1 font-mono">
                    <span>Dist Score: {lastMatch.distance.toFixed(3)}</span>
                    {lastMatch.reason && <span className="font-semibold text-amber-900">• {lastMatch.reason}</span>}
                  </div>
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
    </div>
  )
}
