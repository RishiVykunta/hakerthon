import Link from 'next/link'
import { Camera, ShieldCheck, Cpu, Database, CheckCircle2, ArrowRight, Zap, FileSpreadsheet, AlertTriangle, Users } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="space-y-16 py-6">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-12 border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            Hackathon Edition • Agro-Tech & Rural Development
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Automated AI Face Recognition Attendance for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Rural Workfare Sites</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Eliminate proxy attendance and wage leakages at MGNREGA work sites. Uses on-device 128-d face recognition, anti-spoofing liveness verification, real-time supervisor polling dashboards, and instant wage CSV export.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href="/login?role=supervisor"
              className="px-6 py-3.5 rounded-xl font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-lg shadow-emerald-950/60 hover:scale-[1.02]"
            >
              Supervisor Dashboard Demo
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/supervisor/session/live"
              className="px-6 py-3.5 rounded-xl font-bold bg-slate-900 text-slate-200 hover:text-white border border-slate-700 hover:border-emerald-500/50 transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              Test Live Attendance Kiosk
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Demo Pre-flight Info */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">100% Client-Side ML</h3>
          <p className="text-sm text-slate-400">
            `face-api.js` extracts 128-d floating point descriptors in the browser. Zero raw video payloads sent server-side for fast serverless execution.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Liveness Check</h3>
          <p className="text-sm text-slate-400">
            Anti-spoofing landmark micro-movement verification across consecutive frames prevents photo printout and smartphone screen spoofing.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Neon PostgreSQL + Prisma</h3>
          <p className="text-sm text-slate-400">
            Serverless connection pooling via PgBouncer with Prisma singleton pattern prevents connection pool exhaustion across Vercel API routes.
          </p>
        </div>
      </section>

      {/* Workflow Phases */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-white">System Architecture Workflow</h2>
          <p className="text-sm text-slate-400">Designed specifically for non-tech supervisors using mobile devices at remote work sites</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Phase 1</div>
            <div className="font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" /> Worker Enrollment
            </div>
            <p className="text-xs text-slate-400">Webcam snapshot computes 128-d reference descriptor. Reference photo uploaded to Cloudinary.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Phase 2</div>
            <div className="font-bold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-400" /> Attendance Matching
            </div>
            <p className="text-xs text-slate-400">Real-time Euclidean distance comparison. Auto-confirms distance &lt;0.5, flags borderline 0.5-0.65.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Phase 3</div>
            <div className="font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Manual Review Queue
            </div>
            <p className="text-xs text-slate-400">Supervisor inspects borderline snapshots side-by-side with enrolled photo for instant approval/rejection.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-teal-400 uppercase tracking-wider">Phase 4</div>
            <div className="font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-teal-400" /> Wage & Dispute Audit
            </div>
            <p className="text-xs text-slate-400">Calculates daily payouts (`days_present * wage_rate`), instant CSV exports, and worker self-service history.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
