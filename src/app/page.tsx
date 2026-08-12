'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  CheckCircle,
  Clock,
  User,
  Users,
  FileText,
  BarChart2,
  ScanFace
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
    <div className="min-h-[calc(100vh-64px)] bg-[#F8FAF9] relative overflow-hidden">
      
      {/* Wave bottom decoration - typical for this type of modern landing page */}
      <div className="absolute bottom-0 left-0 right-0 z-0 opacity-40 hidden lg:block pointer-events-none">
        <svg viewBox="0 0 1440 320" className="w-full h-auto" preserveAspectRatio="none">
          <path fill="#d1fae5" fillOpacity="1" d="M0,256L48,229.3C96,203,192,149,288,154.7C384,160,480,224,576,229.3C672,235,768,181,864,149.3C960,117,1056,107,1152,112C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] h-full">
        {/* LEFT COLUMN - TEXT & FEATURES */}
        <div className="flex flex-col justify-center p-6 sm:p-10 lg:pl-16 xl:pl-24 lg:pr-10 py-12 lg:py-20 relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-100 text-green-700 text-xs font-bold w-fit mb-6 sm:mb-8 shadow-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>AI-POWERED DIGITAL WORKFORCE MANAGEMENT</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
            AI-Powered Worksite<br className="hidden sm:block"/>
            Attendance &<br className="hidden sm:block"/>
            <span className="text-green-700">Wage Integrity</span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 text-base sm:text-lg max-w-xl mb-8 leading-relaxed font-medium">
            Verify workers, reduce proxy attendance, and maintain accurate attendance and wage records with AI-powered face-recognition.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <span className="px-4 py-2.5 rounded-lg bg-white border border-slate-100 flex items-center gap-2 shadow-sm text-sm font-semibold text-slate-700">
              <ScanFace className="w-4 h-4 text-green-600" /> AI Face Verification
            </span>
            <span className="px-4 py-2.5 rounded-lg bg-white border border-slate-100 flex items-center gap-2 shadow-sm text-sm font-semibold text-slate-700">
              <CheckCircle className="w-4 h-4 text-slate-500" /> Accurate Records
            </span>
            <span className="px-4 py-2.5 rounded-lg bg-white border border-slate-100 flex items-center gap-2 shadow-sm text-sm font-semibold text-slate-700">
              <Clock className="w-4 h-4 text-slate-500" /> Real-time Attendance
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 lg:mb-20 w-full sm:w-auto">
            {loading ? (
              <div className="text-sm text-slate-400 py-3 font-semibold">Loading portal...</div>
            ) : user ? (
              <Link
                href={user.role === 'supervisor' ? '/supervisor/dashboard' : '/worker/dashboard'}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-[#0d8236] text-white hover:bg-green-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-700/20"
              >
                <User className="w-5 h-5" />
                Go to {user.role === 'supervisor' ? 'Supervisor Dashboard' : 'Worker Dashboard'}
              </Link>
            ) : (
              <>
                <Link
                  href="/login?role=supervisor"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-[#0d8236] text-white hover:bg-green-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-700/20"
                >
                  <User className="w-5 h-5" />
                  Supervisor Portal Login
                </Link>
                <Link
                  href="/login?role=worker"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-white text-slate-800 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <User className="w-5 h-5 text-slate-600" />
                  Worker Self-Service Login
                </Link>
              </>
            )}
          </div>

          {/* Bottom Features Container */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-md border border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 relative z-20 xl:w-[120%]">
            
            {/* Feature 1 */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-green-700 mb-1">
                <ScanFace className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Face Recognition</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                AI-powered facial verification to ensure genuine attendance.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-green-700 mb-1">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Prevent Proxy Attendance</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Eliminates buddy punching and proxy attendance.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-green-700 mb-1">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Accurate Wage Payouts</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Ensure fair wages with accurate attendance and work records.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-green-700 mb-1">
                <BarChart2 className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Supervisor Dashboard</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Real-time insights and reports for better decision-making.
              </p>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN - IMAGE (visible on lg, stacked on mobile) */}
        <div className="relative h-[400px] lg:h-auto w-full overflow-hidden lg:rounded-bl-[4rem] order-first lg:order-last z-10">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat lg:bg-left"
            style={{ backgroundImage: 'url(/hero-bg.png)' }}
          >
            {/* Gradient overlay for mobile readability if image is dark at top */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F8FAF9]/80 lg:hidden"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
