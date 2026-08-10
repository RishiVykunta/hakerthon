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
  ShieldAlert,
  Landmark,
  FileCheck,
  Activity,
  UserCheck,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="space-y-16 py-6 max-w-7xl mx-auto">
      {/* Executive Centered Hero Section */}
      <section className="py-6 text-center space-y-6 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.2] max-w-3xl mx-auto">
          AI Face Recognition Attendance & Wage Fraud Prevention for MGNREGA Job Sites
        </h1>

        {/* Feature Highlights Ribbon */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-900">
          <span className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 flex items-center gap-1.5 shadow-sm">
            <Cpu className="w-4 h-4 text-amber-700" /> 100% Client ML Recognition
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 flex items-center gap-1.5 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-700" /> Anti-Spoofing Liveness Check
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 flex items-center gap-1.5 shadow-sm">
            <FileSpreadsheet className="w-4 h-4 text-amber-700" /> Instant CSV Wage Export
          </span>
        </div>
      </section>

      {/* 4-Phase System Architecture Workflow */}
      <section className="space-y-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">End-to-End System Workflow</h2>
          <p className="text-sm text-slate-600 font-medium">Designed for non-tech supervisors using mobile devices and webcams at rural job sites</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl glass-card space-y-3.5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-amber-900 uppercase tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">Phase 01</span>
              <UserCheck className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Worker Enrollment</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Captures baseline reference photo and extracts 128-d face descriptor vector stored in Neon PostgreSQL.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card space-y-3.5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-orange-900 uppercase tracking-wider bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-300">Phase 02</span>
              <Camera className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Real-Time Kiosk Scan</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Webcam matches faces with Euclidean distance threshold &lt;0.5 for instant auto-confirmation.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card space-y-3.5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-amber-900 uppercase tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">Phase 03</span>
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Manual Review Queue</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Borderline matches (0.50 - 0.65) and failed liveness checks are held for side-by-side supervisor audit.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card space-y-3.5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-orange-900 uppercase tracking-wider bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-300">Phase 04</span>
              <FileSpreadsheet className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Wage & CSV Export</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Computes total daily payouts (`days_present * wage_rate`), generates official CSV reports, and logs audit trail.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Credentials Quick Callout Banner with Real Photo Accent */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-xl max-w-6xl mx-auto bg-cover bg-center" style={{ backgroundImage: `url('/mgnrega-attendance.png')` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/90 pointer-events-none" />

        <div className="relative z-10 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
              Ready for Hackathon Jury Demo
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Experience Live Recognition & Wage Auditing</h3>
            <p className="text-xs text-slate-600 font-medium">Pre-enrolled demo workers ready for instant webcam facial verification testing.</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/login?role=supervisor"
              className="px-5 py-3 rounded-xl text-xs font-extrabold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20 hover:scale-[1.02]"
            >
              Supervisor Login Demo
            </Link>
            <Link
              href="/login?role=worker"
              className="px-5 py-3 rounded-xl text-xs font-bold bg-white text-slate-800 hover:text-slate-900 border border-slate-300 shadow-sm transition-all hover:scale-[1.02]"
            >
              Worker Self-Service Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
