const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const sessions = await prisma.session.findMany()
  const workers = await prisma.worker.findMany()
  const attendances = await prisma.attendance.findMany()
  
  console.log('Sessions:', sessions)
  console.log('Workers:', workers)
  console.log('Attendances:', attendances)
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
