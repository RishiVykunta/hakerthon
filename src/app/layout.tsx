import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'GreenGrid | Face-Recognition Attendance System',
  description: 'AI-Powered Automated Face Recognition Attendance & Wage System for Rural Workfare Sites (MGNREGA)',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${outfit.variable} dark`}>
      <body className="font-sans bg-slate-950 text-slate-100 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="border-t border-slate-800/80 bg-slate-950/80 py-4 text-center text-xs text-slate-400">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
            <div>
              <span className="font-semibold text-emerald-400">GreenGrid Agro-Tech</span> • Rural Workfare Attendance Platform
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Vercel Serverless Ready
              </span>
              <span>•</span>
              <span>Prisma + Neon PostgreSQL</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
