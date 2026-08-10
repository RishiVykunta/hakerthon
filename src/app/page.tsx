import Link from 'next/link'
import {
  Camera,
  ShieldCheck,
  Cpu,
  ArrowRight,
  FileSpreadsheet,
  AlertTriangle,
  ShieldAlert,
  Landmark,
  UserCheck,
  Zap,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="space-y-16 py-6 max-w-7xl mx-auto px-2 sm:px-4">
      {/* Rich 2-Column Hero Section */}
      <section className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left 7 Columns: Headline, Subtitle, CTAs & Metrics */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-xs font-extrabold shadow-sm">
              <Landmark className="w-4 h-4 text-amber-600" />
              Hackathon Priority PS 9 • Agro-Tech & Rural Development
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.18]">
              AI Face Recognition Attendance & Wage Fraud Prevention for MGNREGA Job Sites
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium">
              Eliminate ghost workers, proxy attendance, and wage leakages at remote rural workfare sites. Powered by on-device 128-dimensional face recognition, anti-spoofing liveness verification, supervisor review queues, and instant CSV wage exports.
            </p>

            {/* CTA Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/supervisor/session/live"
                className="px-6 py-4 rounded-2xl font-extrabold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all flex items-center gap-2.5 shadow-xl shadow-amber-500/20 hover:scale-[1.02]"
              >
                <Camera className="w-5 h-5 text-slate-950 animate-pulse" />
                Launch Live Kiosk Scanner
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/supervisor/dashboard"
                className="px-6 py-4 rounded-2xl font-bold bg-white text-slate-800 hover:text-slate-900 border border-slate-300 hover:border-amber-500/50 shadow-sm transition-all flex items-center gap-2 hover:scale-[1.02]"
              >
                <Landmark className="w-4 h-4 text-amber-600" />
                Supervisor Dashboard
              </Link>
            </div>

            {/* Feature Pills */}
            <div className="pt-3 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-700">
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-1.5 shadow-sm">
                <Cpu className="w-4 h-4 text-amber-600" /> 100% Client ML
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Anti-Spoof Protected
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-1.5 shadow-sm">
                <FileSpreadsheet className="w-4 h-4 text-amber-600" /> Instant CSV Export
              </span>
            </div>
          </div>

          {/* Right 5 Columns: AI Biometric Kiosk Interactive Visual Preview */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl overflow-hidden border-2 border-slate-200 shadow-2xl bg-white relative group">
              <img
                src="/kiosk-preview.png"
                alt="AI Face Scan Kiosk Preview"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Status Badge Overlay */}
              <div className="absolute top-4 left-4 right-4 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  Kiosk AI Active
                </div>
                <span className="text-[10px] font-mono font-extrabold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                  Site #4 Rampur
                </span>
              </div>

              {/* Bottom Badge Overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-slate-900/90 text-white backdrop-blur-md border border-slate-700 shadow-xl space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <ShieldCheck className="w-4 h-4" /> 128-D Vector Match
                  </span>
                  <span className="font-mono text-emerald-400">Score &lt; 0.42</span>
                </div>
                <p className="text-[11px] text-slate-300">Real-time webcam anti-spoof liveness verification active.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3 Feature Core Capabilities Cards Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 text-amber-600" /> Key Technical Capabilities
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Built for High-Trust Rural Attendance Security
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl space-y-3.5 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-300 flex items-center justify-center text-orange-700 font-bold">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Ghost Worker Elimination</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Prevents unauthorized proxy signatures by matching incoming webcam frames against pre-enrolled worker face vector profiles in real time.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-3.5 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 font-bold">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">100% Client-Side Recognition</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              `face-api.js` extracts 128-dimensional floating point descriptors directly in the browser. Zero video stream payloads are transferred server-side.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-3.5 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Anti-Spoofing Liveness Check</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Calculates relative facial landmark movement across consecutive video frames to prevent static printed photo and smartphone screen spoofing.
            </p>
          </div>
        </div>
      </section>

      {/* 4-Phase System Architecture Workflow */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">End-to-End System Workflow</h2>
          <p className="text-sm text-slate-600 font-medium">Designed for non-tech supervisors using mobile devices and webcams at rural job sites</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl glass-card space-y-3.5 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-amber-900 uppercase tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">Phase 01</span>
              <UserCheck className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Worker Enrollment</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Captures baseline reference photo and extracts 128-d face descriptor vector stored in Neon PostgreSQL.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card space-y-3.5 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-orange-900 uppercase tracking-wider bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-300">Phase 02</span>
              <Camera className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Real-Time Kiosk Scan</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Webcam matches faces with Euclidean distance threshold &lt;0.5 for instant auto-confirmation.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card space-y-3.5 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-amber-900 uppercase tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">Phase 03</span>
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Manual Review Queue</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Borderline matches (0.50 - 0.65) and failed liveness checks are held for side-by-side supervisor audit.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card space-y-3.5 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
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

      {/* Demo Credentials Quick Callout Banner */}
      <section className="glass-panel p-8 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
            Ready for Hackathon Jury Demo
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">Experience Live Recognition & Wage Auditing</h3>
          <p className="text-xs text-slate-600 font-medium">Pre-enrolled demo workers ready for instant webcam facial verification testing.</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/supervisor/session/live"
            className="px-5 py-3 rounded-xl text-xs font-extrabold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20 hover:scale-[1.02]"
          >
            Launch Live Kiosk
          </Link>
          <Link
            href="/login?role=supervisor"
            className="px-5 py-3 rounded-xl text-xs font-bold bg-white text-slate-800 hover:text-slate-900 border border-slate-300 shadow-sm transition-all hover:scale-[1.02]"
          >
            Supervisor Login Demo
          </Link>
        </div>
      </section>
    </div>
  )
}
