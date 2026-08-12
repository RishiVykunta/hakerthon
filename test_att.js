const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const worker = await prisma.worker.findFirst()
  if (!worker) {
    console.log("No workers found to mark attendance for")
    return
  }

  const session = await prisma.session.findFirst()
  let sessionId = session ? session.id : 'session_demo_01'

  if (!session) {
    const sup = await prisma.supervisor.findFirst()
    const newSession = await prisma.session.create({
      data: {
        site_id: worker.site_id,
        supervisor_id: sup ? sup.id : 'sup_01',
        status: 'active',
        date: new Date(),
      }
    })
    sessionId = newSession.id
  }

  const attendance = await prisma.attendance.create({
    data: {
      session_id: sessionId,
      worker_id: worker.id,
      in_time: new Date(),
      confidence_score: 0.1,
      status: 'auto_confirmed',
    },
    include: { worker: true }
  })
  console.log("Successfully created attendance in Prisma:", attendance.id)
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
