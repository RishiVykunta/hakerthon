/**
 * In-Memory Fallback Data Store & Prisma Adapter
 * Ensures the application runs seamlessly even if Neon DB credentials are not yet configured.
 */

export interface MockSite {
  id: string
  name: string
  location: string
}

export interface MockSupervisor {
  id: string
  name: string
  phone: string
  password_hash: string
  site_id: string
}

export interface MockWorker {
  id: string
  name: string
  phone: string
  photo_url: string | null
  face_descriptor: number[]
  wage_rate_per_day: number
  site_id: string
  created_at: string
}

export interface MockSession {
  id: string
  site_id: string
  supervisor_id: string
  date: string
  status: 'active' | 'closed'
  created_at: string
}

export interface MockAttendance {
  id: string
  worker_id: string
  session_id: string
  timestamp: string
  in_time: string
  out_time?: string | null
  total_hours?: number | null
  type?: 'CHECK_IN' | 'CHECK_OUT'
  confidence_score: number
  status: 'auto_confirmed' | 'manual_review' | 'manual_approved' | 'manual_rejected'
  reviewed_by?: string | null
  snapshot_url?: string | null
  notes?: string | null
  created_at: string
}

export interface MockWageRecord {
  id: string
  worker_id: string
  session_id: string
  days_present: number
  total_hours: number
  computed_wage: number
  exported_at: string
}

// Generate realistic 128-dimensional mock face descriptors
function generateMockDescriptor(seed: number): number[] {
  const descriptor: number[] = []
  for (let i = 0; i < 128; i++) {
    // Generate normalized float between -0.2 and +0.2 with determinism
    const val = Math.sin(seed * 9999 + i * 13) * 0.15
    descriptor.push(Number(val.toFixed(5)))
  }
  return descriptor
}

class InMemoryStore {
  sites: MockSite[] = [
    {
      id: 'site_rampur_01',
      name: 'GreenGrid MGNREGA Worksite #4 - Rampur',
      location: 'Rampur Panchayat, District Sitapur, UP',
    },
  ]

  supervisors: MockSupervisor[] = [
    {
      id: 'sup_01',
      name: 'Rajesh Kumar (Site Supervisor)',
      phone: '9876543210',
      password_hash: 'password123',
      site_id: 'site_rampur_01',
    },
  ]

  workers: MockWorker[] = []

  sessions: MockSession[] = [
    {
      id: 'session_demo_01',
      site_id: 'site_rampur_01',
      supervisor_id: 'sup_01',
      date: new Date().toISOString(),
      status: 'active',
      created_at: new Date().toISOString(),
    },
  ]

  attendances: MockAttendance[] = []

  wageRecords: MockWageRecord[] = []
}

// Global Singleton Store Instance
const globalStore = globalThis as unknown as { mockStore?: InMemoryStore }
export const mockStore = globalStore.mockStore ?? new InMemoryStore()
if (process.env.NODE_ENV !== 'production') globalStore.mockStore = mockStore
