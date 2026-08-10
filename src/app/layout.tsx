import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

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
  title: 'GreenGrid | AI Face Attendance Portal for MGNREGA Workfare Sites',
  description: 'Automated 128-d Client ML Face Recognition Attendance & Anti-Spoofing Wage Audit Portal for MGNREGA Work Sites',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} dark`}>
      <body className="font-sans bg-[#030712] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-slate-950">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-800/60 bg-[#030712]/90 backdrop-blur-md py-5 text-xs text-slate-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-400">GreenGrid AI Portal</span>
              <span className="text-slate-600">•</span>
              <span>MGNREGA Rural Workfare Technology Stack</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
              <span className="inline-flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Vercel Serverless Ready
              </span>
              <span>•</span>
              <span>Neon PostgreSQL + Prisma</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
