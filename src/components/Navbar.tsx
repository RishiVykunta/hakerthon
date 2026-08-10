'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Camera,
  ShieldCheck,
  UserCheck,
  FileSpreadsheet,
  LogOut,
  Home,
  AlertCircle,
  Landmark,
  Menu,
  X,
} from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<{ id: string; name: string; role: 'supervisor' | 'worker'; site_id: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  const supervisorNavItems = [
    { label: 'Dashboard', href: '/supervisor/dashboard', icon: Home },
    { label: 'Enroll Worker', href: '/supervisor/enroll', icon: UserCheck },
    { label: 'Live Kiosk', href: '/supervisor/session/live', icon: Camera, highlight: true },
    { label: 'Review Queue', href: '/supervisor/review', icon: AlertCircle },
    { label: 'Reports / Wage CSV', href: '/supervisor/export', icon: FileSpreadsheet },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 shadow-sm group-hover:border-amber-500 transition-colors">
            <Camera className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
                GreenGrid
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200 flex items-center gap-1">
                <Landmark className="w-3 h-3 text-slate-600" />
                MGNREGA
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
              AI-Powered Worksite Management
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {supervisorNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${item.highlight && !isActive ? 'text-amber-600' : ''}`} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User Profile Area */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-extrabold text-slate-900 leading-none">{user.name}</div>
                <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 justify-end mt-1">
                  <ShieldCheck className="w-3 h-3 text-amber-600" />
                  Site Supervisor
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all flex items-center gap-1 text-xs font-semibold"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login?role=supervisor"
                className="px-3.5 py-2 rounded-lg text-xs font-extrabold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all shadow-2xs"
              >
                Supervisor Login
              </Link>
              <Link
                href="/login?role=worker"
                className="px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all"
              >
                Worker Login
              </Link>
            </div>
          )}

          {/* Mobile Navigation Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Dropdown Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-lg">
          {supervisorNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}
