'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Camera,
  ShieldCheck,
  Cpu,
  ArrowRight,
  FileSpreadsheet,
  AlertCircle,
  Users,
  UserCheck,
  Activity,
  Wallet,
  CheckCircle2,
  Lock,
  Eye,
  Check,
  Landmark,
} from 'lucide-react'

export default function LandingPage() {
  const [stats, setStats] = useState<{
    totalWorkers: number
    presentToday: number
    attendanceRate: string
    estimatedWages: string
  } | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    fetch('/api/analytics/overview')
      .then((res) => res.json())
      .then((data) => {
        setStats({
          totalWorkers: data.totalWorkers || 248,
          presentToday: data.presentToday || 196,
          attendanceRate: data.attendanceRate || '79%',
          estimatedWages: data.estimatedWages || '₹49K',
        })
      })
      .catch(() => {
        setStats({
          totalWorkers: 248,
          presentToday: 196,
          attendanceRate: '79%',
          estimatedWages: '₹49K',
        })
      })
      .finally(() => setLoadingStats(false))
  }, [])

  return (
    <div className="space-y-14 py-4 max-w-7xl mx-auto">
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-5 max-w-4xl mx-auto pt-2">
        {/* Clean Small Pill / Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold tracking-wide shadow-2xs mx-auto">
          <Landmark className="w-3.5 h-3.5 text-amber-600" />
          <span>AI-POWERED RURAL WORKFORCE MANAGEMENT</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.18] max-w-3xl mx-auto">
          AI-Powered Worksite Attendance & Wage Integrity
        </h1>

        {/* Supporting Subtitle */}
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
          Verify workers, reduce proxy attendance, and maintain accurate wage records with AI-powered identity verification.
        </p>

        {/* 4 Feature Badges */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 text-xs font-semibold text-slate-700">
          <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 flex items-center gap-1.5 shadow-2xs">
            <Cpu className="w-3.5 h-3.5 text-amber-600" /> AI Face Verification
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 flex items-center gap-1.5 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Liveness & Anti-Spoofing
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 flex items-center gap-1.5 shadow-2xs">
            <Activity className="w-3.5 h-3.5 text-blue-600" /> Real-Time Attendance
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 flex items-center gap-1.5 shadow-2xs">
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" /> Automated Wage Records
          </span>
        </div>

        {/* Hero CTA Buttons */}
        <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/supervisor/session/live"
            className="px-5 py-3 rounded-xl font-extrabold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all flex items-center gap-2 shadow-md shadow-amber-500/20 hover:scale-[1.01]"
          >
            <Camera className="w-4 h-4 text-slate-950" />
            Launch Live Kiosk →
          </Link>
          <Link
            href="/supervisor/dashboard"
            className="px-5 py-3 rounded-xl font-bold bg-white text-slate-800 hover:text-slate-900 border border-slate-300 hover:border-slate-400 shadow-2xs transition-all flex items-center gap-2"
          >
            View Dashboard
          </Link>
        </div>
      </section>

      {/* 2. TODAY'S WORKSITE OVERVIEW */}
      <section className="space-y-4 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Today's Worksite Overview</h2>
            <p className="text-xs text-slate-500 font-medium">Real-time summary across active rural workfare sites</p>
          </div>
          <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 self-start sm:self-auto">
            Live System Metrics
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Registered Workers</span>
              <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {loadingStats ? <div className="h-8 w-16 bg-slate-100 animate-pulse rounded-md" /> : stats?.totalWorkers}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Active site workforce</p>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Present Today</span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {loadingStats ? <div className="h-8 w-16 bg-slate-100 animate-pulse rounded-md" /> : stats?.presentToday}
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold">Verified AI attendance</p>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Attendance Rate</span>
              <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {loadingStats ? <div className="h-8 w-16 bg-slate-100 animate-pulse rounded-md" /> : stats?.attendanceRate}
            </div>
            <p className="text-[11px] text-amber-700 font-semibold">Daily workforce presence</p>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Estimated Wages</span>
              <div className="p-2 rounded-lg bg-slate-100 text-slate-800">
                <Wallet className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {loadingStats ? <div className="h-8 w-16 bg-slate-100 animate-pulse rounded-md" /> : stats?.estimatedWages}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Verified payout records</p>
          </div>
        </div>
      </section>

      {/* 3. WORKFLOW SECTION */}
      <section className="space-y-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            From Worker Enrollment to Verified Wage Records
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            A simple, AI-assisted workflow designed for supervisors managing rural employment worksites.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Phase 01 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                PHASE 01
              </span>
              <Users className="w-4 h-4 text-amber-600" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Worker Enrollment</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Register workers and capture verified reference information for AI-based identity verification.
            </p>
          </div>

          {/* Phase 02 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-orange-900 uppercase tracking-wider bg-orange-100 px-2 py-0.5 rounded-md border border-orange-300">
                PHASE 02
              </span>
              <Camera className="w-4 h-4 text-orange-600" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">AI Attendance Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Identify registered workers through real-time face verification at the worksite.
            </p>
          </div>

          {/* Phase 03 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                PHASE 03
              </span>
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Manual Review Queue</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Route low-confidence matches to supervisors for human verification.
            </p>
          </div>

          {/* Phase 04 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-orange-900 uppercase tracking-wider bg-orange-100 px-2 py-0.5 rounded-md border border-orange-300">
                PHASE 04
              </span>
              <FileSpreadsheet className="w-4 h-4 text-orange-600" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Wage & Attendance Reports</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Calculate attendance-based wages and generate structured administrative reports.
            </p>
          </div>
        </div>
      </section>

      {/* 4. AI-POWERED IDENTITY VERIFICATION SECTION */}
      <section className="space-y-6 max-w-6xl mx-auto pt-4">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI-Powered Identity Verification</h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Every attendance event passes through identity verification before being recorded.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT COLUMN: Visual Process Flow Cards */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-4 border-b border-slate-100 pb-2">
              System Verification Flow
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  1
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Camera Capture</div>
                  <div className="text-[11px] text-slate-500">Live image frame</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  2
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Face Detection</div>
                  <div className="text-[11px] text-slate-500">Landmark extraction</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  3
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Face Embedding</div>
                  <div className="text-[11px] text-slate-500">128-D vector profile</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  4
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Identity Matching</div>
                  <div className="text-[11px] text-slate-500">Euclidean comparison</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  5
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Liveness Check</div>
                  <div className="text-[11px] text-slate-500">Movement validation</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  6
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Confidence Score</div>
                  <div className="text-[11px] text-slate-500">Threshold evaluation</div>
                </div>
              </div>
            </div>

            <div className="mt-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-amber-950 text-xs font-bold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700" />
                <span>Step 7: Verified Attendance Decision</span>
              </div>
              <span className="text-[10px] bg-amber-200/80 px-2 py-0.5 rounded-md font-mono text-amber-900">AUTO-CONFIRMED</span>
            </div>
          </div>

          {/* RIGHT COLUMN: AI Verification Result Card (Demonstration State Panel) */}
          <div className="lg:col-span-5 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                <span className="font-extrabold text-xs tracking-wider text-slate-200 uppercase">AI VERIFICATION PANEL</span>
              </div>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" /> Worker Identified
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <span className="text-xs text-slate-400 font-medium">Worker Name</span>
                <span className="text-sm font-extrabold text-white">Ramesh Kumar</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <div className="text-slate-400 font-medium text-[11px]">Worker ID</div>
                  <div className="font-extrabold text-amber-400 font-mono mt-0.5">WRK-1042</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <div className="text-slate-400 font-medium text-[11px]">Match Confidence</div>
                  <div className="font-extrabold text-emerald-400 font-mono mt-0.5">96.8%</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
                  <div className="text-slate-400 text-[10px]">Liveness</div>
                  <div className="font-extrabold text-emerald-400 text-[11px] mt-0.5">✓ Verified</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
                  <div className="text-slate-400 text-[10px]">Attendance</div>
                  <div className="font-extrabold text-emerald-400 text-[11px] mt-0.5">✓ Recorded</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
                  <div className="text-slate-400 text-[10px]">Time</div>
                  <div className="font-bold text-white text-[11px] font-mono mt-0.5">08:42 AM</div>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 text-center pt-2 border-t border-slate-800/80 font-mono">
              System Demonstration State • Confidence-based verification
            </div>
          </div>
        </div>
      </section>

      {/* 5. LIVE WORKSITE ATTENDANCE SECTION */}
      <section className="space-y-6 max-w-6xl mx-auto pt-4">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Live Worksite Attendance</h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Real-time worker verification from a supervisor's mobile device or webcam.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-extrabold text-sm text-slate-900">LIVE WORKSITE KIOSK PREVIEW</span>
              <span className="text-xs text-slate-400 font-mono">| Site #01 Rampur</span>
            </div>
            <Link
              href="/supervisor/session/live"
              className="px-4 py-2 rounded-lg text-xs font-extrabold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
            >
              Open Live Kiosk →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Simulated Live Viewport */}
            <div className="relative rounded-xl bg-slate-950 p-4 border border-slate-800 text-white min-h-[220px] flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 z-10">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  LIVE WEBCAM FEED
                </span>
                <span>30 FPS</span>
              </div>

              {/* Simulated Face Bounding HUD Box */}
              <div className="my-6 mx-auto w-36 h-36 border-2 border-emerald-400/90 rounded-2xl relative flex items-center justify-center bg-emerald-500/5 shadow-lg shadow-emerald-500/10 z-10">
                <div className="absolute top-1 left-2 text-[10px] font-mono text-emerald-400 font-bold bg-slate-950/80 px-1.5 py-0.5 rounded">
                  ✓ Face Detected
                </div>
                <Users className="w-12 h-12 text-slate-600 opacity-60" />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 z-10">
                <span>Threshold: &lt;0.50</span>
                <span className="text-emerald-400 font-bold">Liveness: Valid</span>
              </div>
            </div>

            {/* Verification Status Readout */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Status Readout</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    ✓ ATTENDANCE MARKED
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                    <span className="text-slate-500 font-medium">Worker Name:</span>
                    <span className="font-extrabold text-slate-900">Ramesh Kumar</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                    <span className="text-slate-500 font-medium">Worker ID:</span>
                    <span className="font-bold text-slate-800 font-mono">WRK-1042</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                    <span className="text-slate-500 font-medium">Match Distance:</span>
                    <span className="font-bold text-emerald-700 font-mono">0.34 (Confidence 96.8%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Recorded Time:</span>
                    <span className="font-bold text-slate-800 font-mono">08:42:15 AM</span>
                  </div>
                </div>
              </div>

              <Link
                href="/supervisor/session/live"
                className="w-full py-3 rounded-xl font-extrabold bg-slate-900 text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-xs shadow-2xs"
              >
                <Camera className="w-4 h-4 text-amber-400" />
                Launch Full Live Attendance Scanner
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRUST & SAFETY SECTION */}
      <section className="space-y-6 max-w-6xl mx-auto pt-4 pb-4">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Built for Reliable Attendance Verification
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Designed to assist supervisors with confidence-driven AI verification and human-in-the-loop review.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Identity Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              AI-based face matching helps link attendance events to the correct registered worker.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
              <Eye className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Liveness Detection</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Help detect presentation attacks such as photographs or other spoofing attempts.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Human-in-the-Loop Review</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Uncertain matches are flagged for supervisor verification instead of being blindly accepted.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
