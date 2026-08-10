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
    <div className="space-y-16 py-4 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-12 border border-slate-200 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-xs font-extrabold shadow-sm">
            <Landmark className="w-4 h-4 text-slate-700" />
            Hackathon Priority PS 9 • Agro-Tech & Rural Development Portal
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            AI Face Recognition Attendance & Wage Fraud Prevention for MGNREGA Job Sites
          </h1>
        </div>
      </section>


      {/* 4-Phase System Architecture Workflow */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">End-to-End System Workflow</h2>
          <p className="text-sm text-slate-600">Designed for non-tech supervisors using mobile devices and webcams at rural job sites</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-3xl glass-card space-y-3">
            <div className="text-xs font-extrabold text-amber-600 uppercase tracking-wider">Phase 1</div>
            <div className="font-bold text-slate-900 flex items-center gap-2 text-base">
              <UserCheck className="w-5 h-5 text-amber-600" /> Worker Enrollment
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Captures baseline reference photo and extracts 128-d face descriptor vector stored in Neon PostgreSQL.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card space-y-3">
            <div className="text-xs font-extrabold text-orange-600 uppercase tracking-wider">Phase 2</div>
            <div className="font-bold text-slate-900 flex items-center gap-2 text-base">
              <Camera className="w-5 h-5 text-orange-600" /> Real-Time Kiosk Scan
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Webcam matches faces with Euclidean distance threshold &lt;0.5 for instant auto-confirmation.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card space-y-3">
            <div className="text-xs font-extrabold text-amber-600 uppercase tracking-wider">Phase 3</div>
            <div className="font-bold text-slate-900 flex items-center gap-2 text-base">
              <AlertTriangle className="w-5 h-5 text-amber-600" /> Manual Review Queue
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Borderline matches (0.50 - 0.65) and failed liveness checks are held for side-by-side supervisor audit.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card space-y-3">
            <div className="text-xs font-extrabold text-orange-600 uppercase tracking-wider">Phase 4</div>
            <div className="font-bold text-slate-900 flex items-center gap-2 text-base">
              <FileSpreadsheet className="w-5 h-5 text-orange-600" /> Wage & CSV Audit Export
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Computes total daily payouts (`days_present * wage_rate`), generates official CSV reports, and logs audit trail.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Credentials Quick Callout */}
      <section className="glass-panel p-8 rounded-3xl border border-amber-300 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
              Ready for Hackathon Jury Demo
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">Experience Live Recognition & Wage Auditing</h3>
          <p className="text-xs text-slate-600 font-medium">Pre-enrolled demo workers ready for instant webcam facial verification testing.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login?role=supervisor"
            className="px-5 py-3 rounded-xl text-xs font-extrabold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
          >
            Supervisor Login Demo
          </Link>
          <Link
            href="/login?role=worker"
            className="px-5 py-3 rounded-xl text-xs font-bold bg-white text-slate-800 hover:text-slate-900 border border-slate-300 shadow-sm transition-all"
          >
            Worker Self-Service Demo
          </Link>
        </div>
      </section>
    </div>
  )
}
