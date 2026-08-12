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
      <div className="w-full relative lg:min-h-[calc(100vh-64px)] flex flex-col lg:grid lg:grid-cols-[1.1fr_0.9fr]">
        
        {/* DESKTOP FULL-BLEED BACKGROUND IMAGE & SHADE */}
        <div className="hidden lg:block absolute inset-0 z-0 overflow-hidden lg:rounded-bl-[3rem]">
          <Image 
            src="https://res.cloudinary.com/rdk6gzoj/image/upload/v1786544804/ChatGPT_Image_Aug_12_2026_07_55_26_PM.png" 
            alt="Rural worksite supervisor using AI tablet for face verification"
            fill
            className="object-cover object-right"
            priority
          />
          {/* Shade sits behind the text and fades smoothly toward the image, providing good contrast */}
          <div className="absolute inset-y-0 left-0 w-[75%] bg-gradient-to-r from-[#F9FCFA] via-[#F9FCFA]/95 to-transparent"></div>
        </div>

        {/* LEFT COLUMN - TEXT & BUTTONS */}
        <div className="flex flex-col justify-center px-4 sm:px-6 lg:pl-[10%] xl:pl-[15%] lg:pr-12 pt-16 pb-12 lg:py-24 text-center lg:text-left relative z-10 order-1 bg-gradient-to-b from-[#F9FCFA] via-[#F9FCFA]/95 to-transparent lg:bg-none">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-green-50 border border-green-200 text-green-800 text-[10px] sm:text-xs font-bold w-fit mx-auto lg:mx-0 mb-6 lg:mb-8 shadow-sm">
            <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="tracking-wide text-center">AI-POWERED RURAL WORKFORCE MANAGEMENT</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-4 lg:mb-6 tracking-tight">
            AI-Powered Worksite <br className="hidden lg:block"/>
            Attendance &<br className="hidden lg:block"/>
            <span className="text-green-700"> Wage Integrity</span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 text-base sm:text-lg lg:text-xl max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed font-medium">
            Verify workers, reduce proxy attendance, and maintain accurate attendance and wage records with AI-powered face recognition.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2 sm:gap-3 mb-10">
            <span className="w-auto px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-center lg:justify-start gap-1.5 sm:gap-2 shadow-sm text-xs sm:text-sm font-semibold text-slate-700">
              <ScanFace className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" /> AI Face Verification
            </span>
            <span className="w-auto px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-center lg:justify-start gap-1.5 sm:gap-2 shadow-sm text-xs sm:text-sm font-semibold text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" /> Liveness Detection
            </span>
            <span className="w-auto px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-center lg:justify-start gap-1.5 sm:gap-2 shadow-sm text-xs sm:text-sm font-semibold text-slate-700">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" /> Real-Time Attendance
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full">
            {loading ? (
              <div className="text-sm text-slate-500 py-3 font-medium flex items-center justify-center gap-2 w-full sm:w-auto">
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                Loading portal...
              </div>
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
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-xl font-bold bg-orange-600 text-white hover:bg-orange-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20"
                >
                  <User className="w-5 h-5" />
                  Supervisor Portal Login
                </Link>
                <Link
                  href="/login?role=worker"
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-xl font-bold bg-[#0d8236] text-white hover:bg-green-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-700/20"
                >
                  <User className="w-5 h-5" />
                  Worker Self-Service Login
                </Link>
              </>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN - IMAGE (Mobile only, on desktop it's just an empty spacer for the grid) */}
        <div className="w-full h-[350px] sm:h-[450px] lg:h-auto relative overflow-hidden lg:rounded-bl-[3rem] order-2 z-0">
          {/* Mobile Image */}
          <div className="lg:hidden absolute inset-0">
            <Image 
              src="https://res.cloudinary.com/rdk6gzoj/image/upload/v1786544804/ChatGPT_Image_Aug_12_2026_07_55_26_PM.png" 
              alt="Rural worksite supervisor using AI tablet for face verification"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Smooth top-to-bottom blend for mobile */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#F9FCFA] via-[#F9FCFA]/90 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* FEATURE CARDS SECTION */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 py-10 sm:py-16 lg:py-20 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col items-center sm:items-start text-center sm:text-left group hover:-translate-y-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-3 sm:mb-4 border border-green-100 group-hover:scale-110 transition-transform duration-300">
              <ScanFace className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.5]" />
            </div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-2">Face Recognition</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              AI-powered facial verification to ensure genuine attendance.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col items-center sm:items-start text-center sm:text-left group hover:-translate-y-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-3 sm:mb-4 border border-green-100 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.5]" />
            </div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-2">Prevent Proxy Attendance</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Eliminates buddy punching and proxy attendance.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col items-center sm:items-start text-center sm:text-left group hover:-translate-y-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-3 sm:mb-4 border border-green-100 group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.5]" />
            </div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-2">Accurate Wage Payouts</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Ensure fair wages with accurate attendance and work records.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col items-center sm:items-start text-center sm:text-left group hover:-translate-y-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-3 sm:mb-4 border border-green-100 group-hover:scale-110 transition-transform duration-300">
              <BarChart2 className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.5]" />
            </div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-2">Supervisor Dashboard</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Real-time insights and reports for better decision-making.
            </p>
          </div>

        </div>
      </div>


      {/* VISION & AIMS SECTION */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 py-10 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Left Large Image Card */}
          <div className="relative w-full h-[350px] sm:h-[400px] lg:h-auto rounded-3xl overflow-hidden shadow-xl group">
            <Image 
              src="https://res.cloudinary.com/rdk6gzoj/image/upload/v1786544427/Beneficiaries_at_home.jpg"
              alt="Beneficiaries at home"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Darker gradient overlay at bottom-left for mobile readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent sm:bg-gradient-to-r sm:from-black/80 sm:via-black/50 sm:to-transparent flex flex-col justify-end sm:justify-center p-6 sm:p-8 lg:p-12">
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white mb-4 sm:mb-6 leading-tight tracking-tight">
                What GreenGrid<br />Aims To Achieve
              </h2>
              <ul className="space-y-2 sm:space-y-3 text-white/90 font-medium text-sm sm:text-base max-w-md">
                <li className="flex items-start gap-2 sm:gap-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 mt-1.5 sm:mt-2 shrink-0"></div>
                  AI-enabled Analytics for better wage distribution.
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 mt-1.5 sm:mt-2 shrink-0"></div>
                  Spatial Technology-enabled Planning & Mobile-based Monitoring.
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side Stacked Cards */}
          <div className="flex flex-col gap-5 sm:gap-6 lg:gap-8">
            {/* Gradient Card */}
            <div className="rounded-3xl bg-gradient-to-br from-green-800 to-green-600 p-6 sm:p-8 lg:p-12 shadow-xl text-white flex-1 flex flex-col justify-center">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3 sm:mb-4 tracking-tight">Vision of GreenGrid</h3>
              <p className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed font-medium">
                Empowering rural India through enhanced livelihood security, productive asset creation, convergence, and technology-enabled governance in alignment with Viksit Bharat @2047.
              </p>
            </div>

            {/* White Card */}
            <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 lg:p-12 shadow-lg flex-1">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 sm:mb-6 tracking-tight">Need for Recalibration</h3>
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base lg:text-lg text-slate-600 font-medium leading-relaxed">
                <p>
                  GreenGrid enhances the statutory wage employment guarantee from 100 to 125 days and introduces a convergence-driven rural development framework focused on productive asset creation, resilience, saturation and technology-enabled governance.
                </p>
                <p>
                  GreenGrid introduces AI-enabled analytics, biometric authentication, real-time dashboards, spatial technology-enabled planning, mobile-based monitoring and strengthened transparency mechanisms to support accountable and effective rural development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW SECTION: HOW GREENGRID WORKS */}
      <section className="space-y-8 sm:space-y-12 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 py-10 sm:py-16 lg:py-20 border-t border-slate-200/80 bg-white">
        <div className="text-center max-w-2xl mx-auto space-y-3 sm:space-y-4">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            How GreenGrid Works
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 font-medium">
            From worker enrollment to verified attendance and wage records.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* CARD 01 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <span className="text-[10px] sm:text-xs font-bold text-green-800 uppercase tracking-wider bg-green-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-green-200">
                Card 01
              </span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
            </div>
            <h3 className="font-bold text-slate-900 text-base sm:text-xl mb-2 sm:mb-3">Worker Enrollment</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium flex-1">
              Register workers and securely enroll their face descriptor vectors on-site.
            </p>
          </div>

          {/* CARD 02 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <span className="text-[10px] sm:text-xs font-bold text-green-800 uppercase tracking-wider bg-green-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-green-200">
                Card 02
              </span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
            </div>
            <h3 className="font-bold text-slate-900 text-base sm:text-xl mb-2 sm:mb-3">AI Attendance Kiosk</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium flex-1">
              Verify workers in real time via live webcam face recognition scanner.
            </p>
          </div>

          {/* CARD 03 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <span className="text-[10px] sm:text-xs font-bold text-orange-800 uppercase tracking-wider bg-orange-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-orange-200">
                Card 03
              </span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              </div>
            </div>
            <h3 className="font-bold text-slate-900 text-base sm:text-xl mb-2 sm:mb-3">Review & Verification</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium flex-1">
              Send uncertain matches and low attendance flags to supervisor manual review.
            </p>
          </div>

          {/* CARD 04 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <span className="text-[10px] sm:text-xs font-bold text-green-800 uppercase tracking-wider bg-green-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-green-200">
                Card 04
              </span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
            </div>
            <h3 className="font-bold text-slate-900 text-base sm:text-xl mb-2 sm:mb-3">Wage Records & Export</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium flex-1">
              Maintain attendance-based wage records and export official CSV reports.
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
