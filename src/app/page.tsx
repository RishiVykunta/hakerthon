'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Clock,
  User,
  ScanFace,
  Users,
  FileText,
  BarChart2,
  Camera,
  UserCheck,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react'
import Image from 'next/image'

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
    <div className="min-h-screen bg-[#F9FCFA] font-sans w-[100vw] relative left-1/2 -translate-x-1/2 -mt-8">
      
      {/* HERO SECTION - Full Width */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] lg:min-h-[calc(100vh-64px)]">
        
        {/* LEFT COLUMN - TEXT & BUTTONS */}
        <div className="flex flex-col justify-center px-4 sm:px-6 lg:pl-[10%] xl:pl-[15%] lg:pr-12 pt-10 pb-8 lg:py-20 text-center lg:text-left relative z-10 order-1">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200 text-green-700 text-[10px] sm:text-xs font-bold w-fit mx-auto lg:mx-0 mb-6 lg:mb-8 shadow-sm">
            <ShieldCheck className="w-4 h-4" />
            <span className="tracking-wide">AI-POWERED RURAL WORKFORCE MANAGEMENT</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold text-slate-900 leading-[1.15] mb-4 lg:mb-6 tracking-tight">
            AI-Powered Worksite<br className="hidden lg:block"/>
            Attendance &<br className="hidden lg:block"/>
            <span className="text-green-700"> Wage Integrity</span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed font-medium">
            Verify workers, reduce proxy attendance, and maintain accurate attendance and wage records with AI-powered face recognition.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start items-center gap-3 mb-10">
            <span className="w-full sm:w-auto px-4 py-3 sm:py-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-center lg:justify-start gap-2 shadow-sm text-[13px] sm:text-sm font-semibold text-slate-700">
              <ScanFace className="w-4 h-4 text-green-600" /> AI Face Verification
            </span>
            <span className="w-full sm:w-auto px-4 py-3 sm:py-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-center lg:justify-start gap-2 shadow-sm text-[13px] sm:text-sm font-semibold text-slate-700">
              <ShieldCheck className="w-4 h-4 text-green-600" /> Liveness Detection
            </span>
            <span className="w-full sm:w-auto px-4 py-3 sm:py-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-center lg:justify-start gap-2 shadow-sm text-[13px] sm:text-sm font-semibold text-slate-700">
              <Clock className="w-4 h-4 text-green-600" /> Real-Time Attendance
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full">
            {loading ? (
              <div className="text-sm text-slate-400 py-3 font-semibold">Loading portal...</div>
            ) : user ? (
              <Link
                href={user.role === 'supervisor' ? '/supervisor/dashboard' : '/worker/dashboard'}
                className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-xl font-bold bg-[#0d8236] text-white hover:bg-green-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-700/20"
              >
                <User className="w-5 h-5" />
                Go to {user.role === 'supervisor' ? 'Supervisor Dashboard' : 'Worker Dashboard'}
              </Link>
            ) : (
              <>
                <Link
                  href="/login?role=supervisor"
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-xl font-bold bg-[#0d8236] text-white hover:bg-green-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-700/20"
                >
                  <User className="w-5 h-5" />
                  Supervisor Portal Login
                </Link>
                <Link
                  href="/login?role=worker"
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-xl font-bold bg-white text-slate-800 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <User className="w-5 h-5 text-slate-600" />
                  Worker Self-Service Login
                </Link>
              </>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN - IMAGE */}
        <div className="w-full h-[350px] sm:h-[450px] lg:h-auto relative overflow-hidden lg:rounded-bl-[4rem] order-2 z-0">
          <Image 
            src="/hero-image-generated.png" 
            alt="Rural worksite supervisor using AI tablet for face verification"
            fill
            className="object-cover object-center lg:object-left"
            priority
          />
          {/* Smooth gradient overlay for perfect blending with the text section on mobile (top-to-bottom) and desktop (left-to-right) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#F9FCFA] via-[#F9FCFA]/80 to-transparent h-[40%] lg:h-full lg:bg-gradient-to-r lg:from-[#F9FCFA] lg:via-[#F9FCFA]/80 lg:to-transparent lg:w-[50%]"></div>
        </div>
      </div>

      {/* FEATURE CARDS SECTION */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 pb-16 lg:pb-24 pt-12 lg:pt-0 lg:-mt-16 relative z-20">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl shadow-slate-200/40 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          
          {/* Feature 1 */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-green-50/80 flex items-center justify-center text-green-700 mb-2 border border-green-100/50 group-hover:scale-105 transition-transform duration-300">
              <ScanFace className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Face Recognition</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              AI-powered facial verification to ensure genuine attendance.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-green-50/80 flex items-center justify-center text-green-700 mb-2 border border-green-100/50 group-hover:scale-105 transition-transform duration-300">
              <Users className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Prevent Proxy Attendance</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Eliminates buddy punching and proxy attendance.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-green-50/80 flex items-center justify-center text-green-700 mb-2 border border-green-100/50 group-hover:scale-105 transition-transform duration-300">
              <FileText className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Accurate Wage Payouts</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Ensure fair wages with accurate attendance and work records.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-green-50/80 flex items-center justify-center text-green-700 mb-2 border border-green-100/50 group-hover:scale-105 transition-transform duration-300">
              <BarChart2 className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Supervisor Dashboard</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Real-time insights and reports for better decision-making.
            </p>
          </div>

        </div>
      </div>

      {/* WORKFLOW SECTION: HOW GREENGRID WORKS */}
      <section className="space-y-8 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 pb-20 pt-10 border-t border-slate-200/80 bg-white">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How GreenGrid Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            From worker enrollment to verified attendance and wage records.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* CARD 01 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-green-900 uppercase tracking-wider bg-green-100 px-2 py-1 rounded-md border border-green-200">
                CARD 01
              </span>
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Worker Enrollment</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Register workers and securely enroll their face descriptor vectors on-site.
            </p>
          </div>

          {/* CARD 02 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-green-900 uppercase tracking-wider bg-green-100 px-2 py-1 rounded-md border border-green-200">
                CARD 02
              </span>
              <Camera className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">AI Attendance Kiosk</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Verify workers in real time via live webcam face recognition scanner.
            </p>
          </div>

          {/* CARD 03 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-green-900 uppercase tracking-wider bg-green-100 px-2 py-1 rounded-md border border-green-200">
                CARD 03
              </span>
              <AlertCircle className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Review & Verification</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Send uncertain matches and low attendance flags to supervisor manual review.
            </p>
          </div>

          {/* CARD 04 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-green-900 uppercase tracking-wider bg-green-100 px-2 py-1 rounded-md border border-green-200">
                CARD 04
              </span>
              <FileSpreadsheet className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Wage Records & Export</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Maintain attendance-based wage records and export official CSV reports.
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
