'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Camera,
  ShieldCheck,
  Cpu,
  Activity,
  Landmark,
  UserCheck,
  AlertCircle,
  FileSpreadsheet,
  ArrowRight,
} from 'lucide-react'

export default function LandingPage() {
  const [user, setUser] = useState<{ name: string; role: 'supervisor' | 'worker' } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user)
        } else {
          setUser(null)
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="py-6 max-w-6xl mx-auto space-y-12">
      {/* HERO SECTION */}
      <section className="text-center space-y-5 max-w-4xl mx-auto pt-2">
        {/* Product Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-extrabold shadow-2xs mx-auto">
          <Landmark className="w-3.5 h-3.5 text-amber-600" />
          <span>AI-POWERED RURAL WORKFORCE MANAGEMENT</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.2] max-w-3xl mx-auto">
          AI-Powered Worksite Attendance & Wage Integrity
        </h1>

        {/* Subtitle */}
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
          Verify workers, reduce proxy attendance, and maintain accurate attendance and wage records with AI-powered face recognition.
        </p>

        {/* Hero Feature Badges */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-700">
          <span className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 flex items-center gap-1.5 shadow-2xs">
            <Cpu className="w-3.5 h-3.5 text-amber-600" /> AI Face Verification
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 flex items-center gap-1.5 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Liveness Detection
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 flex items-center gap-1.5 shadow-2xs">
            <Activity className="w-3.5 h-3.5 text-blue-600" /> Real-Time Attendance
          </span>
        </div>

        {/* Hero Action Buttons */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto max-w-md mx-auto">
          {loading ? (
            <div className="text-xs text-slate-400 py-3 font-semibold">Loading portal options...</div>
          ) : user ? (
            <Link
              href={user.role === 'supervisor' ? '/supervisor/dashboard' : '/worker/dashboard'}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-extrabold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 hover:scale-[1.01]"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              Go to {user.role === 'supervisor' ? 'Supervisor Dashboard' : 'Worker Dashboard'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/login?role=supervisor"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-extrabold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 hover:scale-[1.01]"
              >
                <ShieldCheck className="w-4 h-4 text-slate-950" />
                Supervisor Portal Login
              </Link>
              <Link
                href="/login?role=worker"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold bg-white text-slate-800 hover:text-slate-900 border border-slate-300 hover:border-slate-400 shadow-2xs transition-all flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-slate-700" />
                Worker Self-Service Login
              </Link>
            </>
          )}
        </div>
      </section>

      {/* WORKFLOW SECTION: HOW GREENGRID WORKS */}
      <section className="space-y-6 max-w-6xl mx-auto pt-4 border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How GreenGrid Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            From worker enrollment to verified attendance and wage records.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* CARD 01 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                CARD 01
              </span>
              <UserCheck className="w-4 h-4 text-amber-600" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Worker Enrollment</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Register workers and securely enroll their face descriptor vectors on-site.
            </p>
          </div>

          {/* CARD 02 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-orange-900 uppercase tracking-wider bg-orange-100 px-2 py-0.5 rounded-md border border-orange-300">
                CARD 02
              </span>
              <Camera className="w-4 h-4 text-orange-600" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">AI Attendance Kiosk</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Verify workers in real time via live webcam face recognition scanner.
            </p>
          </div>

          {/* CARD 03 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                CARD 03
              </span>
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Review & Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Send uncertain matches and low attendance flags to supervisor manual review.
            </p>
          </div>

          {/* CARD 04 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-orange-900 uppercase tracking-wider bg-orange-100 px-2 py-0.5 rounded-md border border-orange-300">
                CARD 04
              </span>
              <FileSpreadsheet className="w-4 h-4 text-orange-600" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Wage Records & Export</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Maintain attendance-based wage records and export official CSV reports.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

