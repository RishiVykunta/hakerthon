import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import Navbar from '@/components/Navbar'
import { Camera, ShieldCheck } from 'lucide-react'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'GreenGrid | AI-Powered Worksite Management',
  description: 'AI-assisted attendance verification and wage-record management for rural employment worksites.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} light`}>
      <body className="font-sans bg-[#f8fafc] text-slate-900 min-h-screen flex flex-col antialiased selection:bg-amber-500 selection:text-slate-950">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        <footer className="border-t border-slate-200 bg-white py-10 text-xs text-slate-600 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-slate-900 flex items-center justify-center">
                  <Camera className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <span className="font-extrabold text-sm text-slate-900">GreenGrid</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-bold border border-slate-200 text-slate-700">
                  AI-Powered Worksite Management
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-md">
                AI-assisted attendance verification and wage-record management for rural employment worksites.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-slate-700">
              <Link href="/supervisor/dashboard" className="hover:text-slate-900 transition-colors">
                Dashboard
              </Link>
              <Link href="/supervisor/enroll" className="hover:text-slate-900 transition-colors">
                Workers
              </Link>
              <Link href="/supervisor/session/live" className="hover:text-slate-900 transition-colors">
                Live Attendance
              </Link>
              <Link href="/supervisor/export" className="hover:text-slate-900 transition-colors">
                Reports
              </Link>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-slate-400">
            <div>© {new Date().getFullYear()} GreenGrid Technology. All rights reserved.</div>
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Confidence-Based Verification • Human-in-the-Loop Review</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
