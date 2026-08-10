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

      if (role === 'supervisor') {
        router.push('/supervisor/dashboard')
      } else {
        router.push('/worker/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-12 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-amber-600 p-0.5 mx-auto shadow-xl shadow-amber-950/60">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            {role === 'supervisor' ? (
              <ShieldCheck className="w-7 h-7 text-amber-400" />
            ) : (
              <UserCheck className="w-7 h-7 text-amber-400" />
            )}
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold">
          <Landmark className="w-3.5 h-3.5 text-amber-400" />
          MGNREGA Rural Portal
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          {role === 'supervisor' ? 'Site Supervisor Portal' : 'Worker Self-Service Portal'}
        </h1>
        <p className="text-xs text-slate-400">Log in to manage site attendance & wage records</p>
      </div>

      {/* Role Switcher Tabs */}
      <div className="p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center">
        <button
          type="button"
          onClick={() => setRole('supervisor')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
            role === 'supervisor'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/60'
              : 'text-slate-400 hover:text-white'
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
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/60'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Worker Login
        </button>
      </div>

      {/* Form Card */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 space-y-5">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">Registered Phone Number *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="Enter 10-digit mobile number"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors font-mono"
              />
            </div>
          </div>

          {role === 'supervisor' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">Supervisor Password *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter supervisor password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-extrabold bg-amber-500 text-slate-950 hover:bg-amber-400 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-950/60"
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
        </form>

        {/* Demo Credentials Box */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <Sparkles className="w-4 h-4" /> Hackathon Demo Quick Test Logins:
          </div>
          {role === 'supervisor' ? (
            <div className="text-xs text-slate-300 space-y-1 font-mono">
              <div>Phone: <code className="text-amber-300 font-bold">9876543210</code></div>
              <div>Password: <code className="text-amber-300 font-bold">password123</code></div>
            </div>
          ) : (
            <div className="text-xs text-slate-300 space-y-1 font-mono">
              <div>Ramesh Singh: <code className="text-amber-300 font-bold">9876543211</code></div>
              <div>Sunita Devi: <code className="text-amber-300 font-bold">9876543212</code></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-slate-400 text-sm">Loading Login Portal...</div>}>
      <LoginForm />
    </Suspense>
  )
}
