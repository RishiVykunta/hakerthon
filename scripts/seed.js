const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

function generateMockDescriptor(seed) {
  const descriptor = []
  for (let i = 0; i < 128; i++) {
    const val = Math.sin(seed * 9999 + i * 13) * 0.15
    descriptor.push(Number(val.toFixed(5)))
  }
  return descriptor
}

async function main() {
  console.log('Seeding database for GreenGrid Rural Workfare Attendance System...')

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

  console.log('Site and Supervisor initialized successfully.')
  console.log('Seeding finished!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
