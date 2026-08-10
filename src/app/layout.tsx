import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { Camera } from 'lucide-react'

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

        <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-600 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-slate-900 flex items-center justify-center">
                <Camera className="w-3 h-3 text-amber-500" />
              </div>
              <span className="font-extrabold text-sm text-slate-900">GreenGrid</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">
                AI-Powered Worksite Management
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              © {new Date().getFullYear()} GreenGrid. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
