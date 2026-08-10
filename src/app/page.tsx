'use client'

import Link from 'next/link'
import {
  Camera,
  ShieldCheck,
  Cpu,
  FileSpreadsheet,
  Activity,
  Landmark,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="py-12 max-w-5xl mx-auto space-y-8 text-center">
      {/* Small Clean Pill / Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-extrabold shadow-2xs mx-auto">
        <Landmark className="w-4 h-4 text-amber-600" />
        <span>AI-POWERED RURAL WORKFORCE MANAGEMENT</span>
      </div>

      {/* Main Hero Title */}
      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.2] max-w-4xl mx-auto">
        AI-Powered Worksite Attendance & Wage Integrity
      </h1>

      {/* Supporting Subtitle */}
      <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
        Verify workers, reduce proxy attendance, and maintain accurate wage records with AI-powered identity verification.
      </p>

      {/* 4 Clean Feature Badges */}
      <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-700">
        <span className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 flex items-center gap-1.5 shadow-2xs">
          <Cpu className="w-4 h-4 text-amber-600" /> AI Face Verification
        </span>
        <span className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 flex items-center gap-1.5 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Liveness & Anti-Spoofing
        </span>
        <span className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 flex items-center gap-1.5 shadow-2xs">
          <Activity className="w-4 h-4 text-blue-600" /> Real-Time Attendance
        </span>
        <span className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 flex items-center gap-1.5 shadow-2xs">
          <FileSpreadsheet className="w-4 h-4 text-amber-600" /> Automated Wage Records
        </span>
      </div>

      {/* Hero CTA Buttons */}
      <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/supervisor/session/live"
          className="px-6 py-3.5 rounded-xl font-extrabold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all flex items-center gap-2 shadow-md shadow-amber-500/20 hover:scale-[1.01]"
        >
          <Camera className="w-4 h-4 text-slate-950" />
          Launch Live Kiosk →
        </Link>
        <Link
          href="/supervisor/dashboard"
          className="px-6 py-3.5 rounded-xl font-bold bg-white text-slate-800 hover:text-slate-900 border border-slate-300 hover:border-slate-400 shadow-2xs transition-all flex items-center gap-2"
        >
          View Dashboard
        </Link>
      </div>
    </div>
  )
}
