import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Generate realistic 128-dimensional mock face descriptors
function generateMockDescriptor(seed: number): number[] {
  const descriptor: number[] = []
  for (let i = 0; i < 128; i++) {
    const val = Math.sin(seed * 9999 + i * 13) * 0.15
    descriptor.push(Number(val.toFixed(5)))
  }
  return descriptor
}

async function main() {
  console.log('Seeding database for GreenGrid Rural Workfare Attendance System...')

  // 1. Create Site
  const site = await prisma.site.upsert({
    where: { id: 'site_rampur_01' },
    update: {},
    create: {
      id: 'site_rampur_01',
      name: 'GreenGrid MGNREGA Worksite #4 - Rampur',
      location: 'Rampur Panchayat, District Sitapur, UP',
    },
  })

  console.log('Site created:', site.name)

  // 2. Create Supervisor
  const supervisor = await prisma.supervisor.upsert({
    where: { phone: '9876543210' },
    update: {},
    create: {
      id: 'sup_01',
      name: 'Rajesh Kumar (Site Supervisor)',
      phone: '9876543210',
      password_hash: 'password123',
      site_id: site.id,
    },
  })

  console.log('Supervisor created:', supervisor.name)

  // 3. Create Sample Workers
  const workerData = [
    {
      id: 'worker_01',
      name: 'Ramesh Singh',
      phone: '9876543211',
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      face_descriptor: generateMockDescriptor(1),
      wage_rate_per_day: 350.0,
      site_id: site.id,
    },
    {
      id: 'worker_02',
      name: 'Sunita Devi',
      phone: '9876543212',
      photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300',
      face_descriptor: generateMockDescriptor(2),
      wage_rate_per_day: 350.0,
      site_id: site.id,
    },
    {
      id: 'worker_03',
      name: 'Manoj Sharma',
      phone: '9876543213',
      photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
      face_descriptor: generateMockDescriptor(3),
      wage_rate_per_day: 375.0,
      site_id: site.id,
    },
    {
      id: 'worker_04',
      name: 'Anita Verma',
      phone: '9876543214',
      photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
      face_descriptor: generateMockDescriptor(4),
      wage_rate_per_day: 350.0,
      site_id: site.id,
    },
  ]

  for (const w of workerData) {
    await prisma.worker.upsert({
      where: { phone: w.phone },
      update: {},
      create: w,
    })
  }

  console.log('4 Workers created successfully.')

  // 4. Create Active Session
  const session = await prisma.session.upsert({
    where: { id: 'session_demo_01' },
    update: {},
    create: {
      id: 'session_demo_01',
      site_id: site.id,
      supervisor_id: supervisor.id,
      status: 'active',
    },
  })

  console.log('Active session created:', session.id)

  // 5. Create Sample Attendance records
  await prisma.attendance.upsert({
    where: { session_id_worker_id: { session_id: session.id, worker_id: 'worker_01' } },
    update: {},
    create: {
      session_id: session.id,
      worker_id: 'worker_01',
      confidence_score: 0.28,
      status: 'auto_confirmed',
    },
  })

  await prisma.attendance.upsert({
    where: { session_id_worker_id: { session_id: session.id, worker_id: 'worker_02' } },
    update: {},
    create: {
      session_id: session.id,
      worker_id: 'worker_02',
      confidence_score: 0.54,
      status: 'manual_review',
      snapshot_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300',
      notes: 'Borderline match distance (0.54) - Supervisor review requested',
    },
  })

  console.log('Sample attendance records created.')
  console.log('Seeding finished successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
