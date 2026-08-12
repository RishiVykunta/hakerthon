const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Clearing all workers, attendances, and wage records from database...')
  try {
    await prisma.attendance.deleteMany({})
    await prisma.wageRecord.deleteMany({})
    const deleted = await prisma.worker.deleteMany({})
    console.log(`Deleted ${deleted.count} workers successfully!`)
  } catch (err) {
    console.error('Error clearing database:', err)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
