'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Camera, ShieldCheck, UserCheck, FileSpreadsheet, LogOut, Home, AlertCircle, Wallet, Sprout, MapPin } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<{ id: string; name: string; role: 'supervisor' | 'worker'; site_id: string } | null>(null)
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
  }, [pathname])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Clean Subtitle (Fixed Overlap) */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Camera className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                GreenGrid
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 flex items-center gap-1">
                <Sprout className="w-3 h-3" />
                MGNREGA AI
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Rural Workfare Attendance Portal
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {user?.role === 'supervisor' && (
            <>
              <Link
                href="/supervisor/dashboard"
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  pathname === '/supervisor/dashboard'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                href="/supervisor/enroll"
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  pathname === '/supervisor/enroll'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Enroll Worker
              </Link>
              <Link
                href="/supervisor/session/live"
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  pathname === '/supervisor/session/live'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Camera className="w-4 h-4 text-emerald-400 animate-pulse" />
                Live Kiosk
              </Link>
              <Link
                href="/supervisor/review"
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  pathname === '/supervisor/review'
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Review Queue
              </Link>
              <Link
                href="/supervisor/export"
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  pathname === '/supervisor/export'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                Wage CSV
              </Link>
            </>
          )}

          {user?.role === 'worker' && (
            <Link
              href="/worker/dashboard"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                pathname === '/worker/dashboard'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Wallet className="w-4 h-4 text-emerald-400" />
              My Wages & Attendance Audit
            </Link>
          )}
        </nav>

        {/* User Auth Action Bar */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-white leading-none">{user.name}</div>
                <div className="text-[10px] text-emerald-400 font-semibold capitalize flex items-center gap-1 justify-end mt-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Site {user.role}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
                title="Logout Portal"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login?role=supervisor"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-950/60 hover:scale-[1.02]"
              >
                Supervisor Login
              </Link>
              <Link
                href="/login?role=worker"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all"
              >
                Worker Portal
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
