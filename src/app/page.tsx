import Link from 'next/link'
import {
  Camera,
  ShieldCheck,
  Cpu,
  Database,
  CheckCircle2,
  ArrowRight,
  Zap,
  FileSpreadsheet,
  AlertTriangle,
  Users,
  Sprout,
  ShieldAlert,
  Landmark,
  FileCheck,
  Activity,
  UserCheck,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="space-y-16 py-4 max-w-7xl mx-auto">
      {/* Hero Banner with Modern Dark Gradient */}
      <section className="relative overflow-hidden rounded-3xl glass-panel-emerald p-8 sm:p-12 border border-emerald-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-extrabold shadow-sm">
            <Sprout className="w-4 h-4 text-emerald-400" />
            Hackathon Priority PS 9 • Agro-Tech & Rural Development Portal
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            AI Face Recognition Attendance & <span className="gradient-text-emerald">Wage Fraud Prevention</span> for MGNREGA Job Sites
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Eliminate ghost workers, proxy attendance, and wage leakages at remote rural workfare sites. Powered by on-device 128-dimensional face recognition, anti-spoofing liveness verification, supervisor review queues, and instant CSV wage exports.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href="/supervisor/session/live"
              className="px-6 py-4 rounded-2xl font-extrabold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all flex items-center gap-2.5 shadow-xl shadow-emerald-950/80 hover:scale-[1.02]"
            >
              <Camera className="w-5 h-5 text-slate-950 animate-pulse" />
              Launch Live Attendance Kiosk
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/supervisor/dashboard"
              className="px-6 py-4 rounded-2xl font-bold bg-slate-900/90 text-slate-200 hover:text-white border border-slate-700/80 hover:border-emerald-500/50 transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <Landmark className="w-4 h-4 text-amber-400" />
              Supervisor Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Core Pain Point & Problem Statement Highlights */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-extrabold">
            <ShieldAlert className="w-3.5 h-3.5" /> High-Impact Rural Problem Statement
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Why MGNREGA Attendance Security Wins Hackathons
          </h2>
          <p className="text-sm text-slate-400">
            Real, well-documented rural workfare challenge across thousands of panchayats nationwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Ghost Worker Elimination</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Prevents unauthorized proxy signatures by matching incoming webcam frames against pre-enrolled worker face vector profiles in real time.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">100% Client-Side Recognition</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              `face-api.js` extracts 128-dimensional floating point descriptors directly in the browser. Zero video stream payloads are transferred server-side.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Anti-Spoofing Liveness Verification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates relative facial landmark movement across consecutive video frames to prevent static printed photo and smartphone screen spoofing.
            </p>
          </div>
        </div>
      </section>

      {/* 4-Phase System Architecture Workflow */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">End-to-End System Workflow</h2>
          <p className="text-sm text-slate-400">Designed for non-tech supervisors using mobile devices and webcams at rural job sites</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-3xl glass-card space-y-3">
            <div className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">Phase 1</div>
            <div className="font-bold text-white flex items-center gap-2 text-base">
              <UserCheck className="w-5 h-5 text-emerald-400" /> Worker Enrollment
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Captures baseline reference photo and extracts 128-d face descriptor vector stored in Neon PostgreSQL.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card space-y-3">
            <div className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">Phase 2</div>
            <div className="font-bold text-white flex items-center gap-2 text-base">
              <Camera className="w-5 h-5 text-emerald-400" /> Real-Time Kiosk Scan
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Webcam matches faces with Euclidean distance threshold &lt;0.5 for instant auto-confirmation.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card space-y-3">
            <div className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Phase 3</div>
            <div className="font-bold text-white flex items-center gap-2 text-base">
              <AlertTriangle className="w-5 h-5 text-amber-400" /> Manual Review Queue
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Borderline matches (0.50 - 0.65) and failed liveness checks are held for side-by-side supervisor audit.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card space-y-3">
            <div className="text-xs font-extrabold text-teal-400 uppercase tracking-wider">Phase 4</div>
            <div className="font-bold text-white flex items-center gap-2 text-base">
              <FileSpreadsheet className="w-5 h-5 text-teal-400" /> Wage & CSV Audit Export
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Computes total daily payouts (`days_present * wage_rate`), generates official CSV reports, and logs audit trail.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Credentials Quick Callout */}
      <section className="glass-panel p-8 rounded-3xl border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Ready for Hackathon Jury Demo
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-white">Experience Live Recognition & Wage Auditing</h3>
          <p className="text-xs text-slate-400">Pre-enrolled demo workers ready for instant webcam facial verification testing.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login?role=supervisor"
            className="px-5 py-3 rounded-xl text-xs font-extrabold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-950/60"
          >
            Supervisor Login Demo
          </Link>
          <Link
            href="/login?role=worker"
            className="px-5 py-3 rounded-xl text-xs font-bold bg-slate-900 text-slate-200 hover:text-white border border-slate-700 transition-all"
          >
            Worker Self-Service Demo
          </Link>
        </div>
      </section>
    </div>
  )
}
