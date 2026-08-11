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

  workers: MockWorker[] = [
    {
      id: 'worker_01',
      name: 'Ramesh Singh',
      phone: '9876543211',
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      face_descriptor: generateMockDescriptor(1),
      wage_rate_per_day: 350.0,
      site_id: 'site_rampur_01',
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
    {
      id: 'worker_02',
      name: 'Sunita Devi',
      phone: '9876543212',
      photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300',
      face_descriptor: generateMockDescriptor(2),
      wage_rate_per_day: 350.0,
      site_id: 'site_rampur_01',
      created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    },
    {
      id: 'worker_03',
      name: 'Manoj Sharma',
      phone: '9876543213',
      photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
      face_descriptor: generateMockDescriptor(3),
      wage_rate_per_day: 375.0,
      site_id: 'site_rampur_01',
      created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    },
    {
      id: 'worker_04',
      name: 'Anita Verma',
      phone: '9876543214',
      photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
      face_descriptor: generateMockDescriptor(4),
      wage_rate_per_day: 350.0,
      site_id: 'site_rampur_01',
      created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    },
  ]

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

  attendances: MockAttendance[] = [
    {
      id: 'att_01',
      worker_id: 'worker_01',
      session_id: 'session_demo_01',
      timestamp: new Date(Date.now() - 28800000).toISOString(),
      in_time: new Date(Date.now() - 28800000).toISOString(),
      out_time: new Date().toISOString(),
      total_hours: 8.0,
      type: 'CHECK_OUT',
      confidence_score: 0.28,
      status: 'auto_confirmed',
      created_at: new Date(Date.now() - 28800000).toISOString(),
    },
    {
      id: 'att_02',
      worker_id: 'worker_02',
      session_id: 'session_demo_01',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      in_time: new Date(Date.now() - 14400000).toISOString(),
      out_time: null,
      total_hours: null,
      type: 'CHECK_IN',
      confidence_score: 0.54,
      status: 'manual_review',
      snapshot_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300',
      notes: 'Borderline match distance (0.54) - Supervisor review requested',
      created_at: new Date(Date.now() - 14400000).toISOString(),
    },
  ]

  wageRecords: MockWageRecord[] = []
}

// Global Singleton Store Instance
const globalStore = globalThis as unknown as { mockStore?: InMemoryStore }
export const mockStore = globalStore.mockStore ?? new InMemoryStore()
if (process.env.NODE_ENV !== 'production') globalStore.mockStore = mockStore
