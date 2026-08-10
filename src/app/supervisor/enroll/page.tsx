'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, CheckCircle2, UserCheck, RefreshCw, Sparkles, ArrowLeft, ShieldAlert, Zap, Landmark } from 'lucide-react'
import { loadFaceModels, extractFaceData } from '@/lib/faceApi'

export default function EnrollWorkerPage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [modelsReady, setModelsReady] = useState(false)
  const [modelStatusMsg, setModelStatusMsg] = useState('Initializing Face Recognition Engine...')
  const [cameraActive, setCameraActive] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [extractedDescriptor, setExtractedDescriptor] = useState<number[] | null>(null)
  const [capturedSnapshot, setCapturedSnapshot] = useState<string | null>(null)

  // Form Fields
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [wageRate, setWageRate] = useState('350')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // 1. Initialize face-api models & start camera
  useEffect(() => {
    async function init() {
      const ready = await loadFaceModels((msg) => setModelStatusMsg(msg))
      setModelsReady(ready)
      if (ready) {
        startCamera()
      }
    }
    init()

    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (err) {
      console.error('Camera access error:', err)
      setError('Unable to access webcam. Please check browser permissions.')
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((t) => t.stop())
      videoRef.current.srcObject = null
      setCameraActive(false)
    }
  }

  // 2. Extract 128-d descriptor on-device from live video frame
  const handleCaptureFace = async () => {
    if (!videoRef.current || !canvasRef.current) return
    setExtracting(true)
    setError('')

    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 480

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const photoDataUrl = canvas.toDataURL('image/jpeg', 0.85)
        setCapturedSnapshot(photoDataUrl)

        // Run face-api descriptor extraction on canvas
        const faceData = await extractFaceData(canvas)

        if (!faceData || !faceData.descriptor) {
          throw new Error('No face detected in webcam frame. Please align face inside the oval guide and try again.')
        }

        setExtractedDescriptor(faceData.descriptor)
        setSuccessMsg(`Face detected! Extracted 128-dimensional vector (${faceData.score.toFixed(2)} confidence score).`)
      }
    } catch (err: any) {
      setError(err.message || 'Face extraction failed')
    } finally {
      setExtracting(false)
    }
  }

  // 3. Submit Worker enrollment to API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!extractedDescriptor) {
      setError('Please capture face descriptor vector first!')
      return
    }

    setLoading(true)
    setError('')

    try {
      // 1. Upload photo to Cloudinary / base64 fallback API
      let photoUrl = capturedSnapshot
      if (capturedSnapshot) {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: capturedSnapshot }),
        })
        const uploadData = await uploadRes.json()
        if (uploadData.url) {
          photoUrl = uploadData.url
        }
      }

      // 2. Save worker to backend API
      const res = await fetch('/api/workers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          photo_url: photoUrl,
          face_descriptor: extractedDescriptor,
          wage_rate_per_day: parseFloat(wageRate),
          site_id: 'site_rampur_01',
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save worker record')
      }

      setSuccessMsg(`Worker ${name} successfully enrolled! Redirecting to dashboard...`)
      setTimeout(() => {
        router.push('/supervisor/dashboard')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Enrollment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <span className="text-xs font-extrabold text-amber-400 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center gap-1">
          <Landmark className="w-3.5 h-3.5 text-amber-400" />
          Phase 1 • On-Device Worker Enrollment
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Live Webcam Viewport */}
        <div className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden glass-panel border border-amber-500/20 bg-slate-950 aspect-[4/3] flex items-center justify-center shadow-xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Target Alignment Oval Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className={`w-48 h-64 rounded-[50%] border-2 border-dashed transition-colors ${
                  extractedDescriptor
                    ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/20'
                    : 'border-amber-500/50 animate-pulse'
                }`}
              />
            </div>

            {/* Status Badge */}
            <div className="absolute bottom-3 left-3 right-3 px-3.5 py-2 rounded-2xl glass-card text-xs font-semibold text-slate-200 flex items-center justify-between border border-slate-800">
              <span className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${modelsReady ? 'bg-amber-400 animate-ping' : 'bg-orange-400 animate-spin'}`} />
                {modelStatusMsg}
              </span>
              {modelsReady && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/40">
                  Client ML Active
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleCaptureFace}
            disabled={!modelsReady || extracting}
            className="w-full py-3.5 rounded-xl font-extrabold bg-amber-500 text-slate-950 hover:bg-amber-400 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-950/60"
          >
            {extracting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Extracting 128-D Face Vector...
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                Capture & Extract Face Descriptor
              </>
            )}
          </button>
        </div>

        {/* Right Column: Worker Profile Form */}
        <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 space-y-6 shadow-xl">
          <div>
            <h2 className="text-xl font-extrabold text-white">Worker Registration Form</h2>
            <p className="text-xs text-slate-400">Stores worker profile metadata and 128-d face descriptor vector</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-400" />
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">Worker Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Radheshyam Yadav"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">10-Digit Mobile Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="e.g. 9876543215"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">Daily Wage Rate (₹) *</label>
              <input
                type="number"
                value={wageRate}
                onChange={(e) => setWageRate(e.target.value)}
                required
                placeholder="350"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors font-mono"
              />
            </div>

            {/* Extracted Vector Preview Card */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">128-D Vector Status</span>
                {extractedDescriptor ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[10px] border border-amber-500/30">
                    128-D Extracted
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-extrabold text-[10px] border border-orange-500/30">
                    Pending Capture
                  </span>
                )}
              </div>

              {extractedDescriptor ? (
                <div className="text-[10px] font-mono text-amber-400 truncate bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  [{extractedDescriptor.slice(0, 8).join(', ')}, ...]
                </div>
              ) : (
                <p className="text-xs text-slate-400">Position face inside webcam oval guide and click "Capture & Extract".</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !extractedDescriptor}
              className="w-full py-3.5 rounded-xl font-extrabold bg-amber-500 text-slate-950 hover:bg-amber-400 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-950/60"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  Save & Register Worker Profile
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
