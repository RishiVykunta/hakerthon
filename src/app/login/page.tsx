'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ShieldCheck, UserCheck, Phone, Lock, ArrowRight, Sparkles, Landmark } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialRole = searchParams.get('role') === 'worker' ? 'worker' : 'supervisor'

  const [role, setRole] = useState<'supervisor' | 'worker'>(initialRole)
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          window.location.href = data.user.role === 'supervisor' ? '/supervisor/dashboard' : '/worker/dashboard'
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (role === 'supervisor') {
      setPhone('9876543210')
      setPassword('password123')
    } else {
      setPhone('9876543211')
      setPassword('')
    }
  }, [role])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password, role }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Hard navigation ensures cookies sync and Navbar updates cleanly
      if (role === 'supervisor') {
        window.location.href = '/supervisor/dashboard'
      } else {
        window.location.href = '/worker/dashboard'
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-12 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-amber-600 p-0.5 mx-auto shadow-xl shadow-amber-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            {role === 'supervisor' ? (
              <ShieldCheck className="w-7 h-7 text-amber-400" />
            ) : (
              <UserCheck className="w-7 h-7 text-amber-400" />
            )}
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold shadow-sm">
          <Landmark className="w-3.5 h-3.5 text-amber-600" />
          MGNREGA Rural Portal
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {role === 'supervisor' ? 'Site Supervisor Portal' : 'Worker Self-Service Portal'}
        </h1>
        <p className="text-xs text-slate-600 font-medium">Log in to manage site attendance & wage records</p>
      </div>

      {/* Role Switcher Tabs */}
      <div className="p-1.5 rounded-2xl bg-slate-200/80 border border-slate-300 flex items-center">
        <button
          type="button"
          onClick={() => setRole('supervisor')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
            role === 'supervisor'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Supervisor Login
        </button>
        <button
          type="button"
          onClick={() => setRole('worker')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
            role === 'worker'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Worker Login
        </button>
      </div>

      {/* Form Card */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 space-y-5 shadow-xl">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <div onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e as any)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Registered Phone Number *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="off"
                placeholder="Enter 10-digit mobile number"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 transition-colors font-mono shadow-sm"
              />
            </div>
          </div>

          {role === 'supervisor' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Supervisor Password *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off"
                  placeholder="Enter supervisor password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 transition-colors shadow-sm password-mask"
                />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit as any}
            disabled={loading || !phone || (role === 'supervisor' && !password)}
            className="w-full py-3.5 rounded-xl font-extrabold bg-amber-500 text-slate-950 hover:bg-amber-400 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Continue to Portal
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Demo Credentials Box */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600" /> Hackathon Demo Quick Test Logins:
          </div>
          {role === 'supervisor' ? (
            <div className="text-xs text-slate-700 space-y-1 font-mono">
              <div>Phone: <code className="text-amber-900 font-bold bg-amber-200/70 px-1 py-0.5 rounded">9876543210</code></div>
              <div>Password: <code className="text-amber-900 font-bold bg-amber-200/70 px-1 py-0.5 rounded">password123</code></div>
            </div>
          ) : (
            <div className="text-xs text-slate-700 space-y-1 font-mono">
              <div>Enter 10-digit mobile number of any enrolled site worker to view their worker dashboard</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-slate-500 text-sm font-medium">Loading Login Portal...</div>}>
      <LoginForm />
    </Suspense>
  )
}
