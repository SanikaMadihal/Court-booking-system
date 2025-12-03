import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'test@university.edu' },
    update: {},
    create: {
      email: 'test@university.edu',
      name: 'Test User',
      password: hashedPassword,
      role: 'student',
    },
  })

  console.log('Created user:', user)

  // Create a staff user
  const staffPassword = await bcrypt.hash('staff123', 10)
  
  const staffUser = await prisma.user.upsert({
    where: { email: 'staff@sportsarena.com' },
    update: {},
    create: {
      email: 'staff@sportsarena.com',
      name: 'Arena Staff',
      password: staffPassword,
      role: 'staff',
    },
  })

  console.log('Created staff user:', staffUser)

  // Create an admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@sportsarena.com' },
    update: {},
    create: {
      email: 'admin@sportsarena.com',
      name: 'Arena Admin',
      password: adminPassword,
      role: 'admin',
    },
  })

  console.log('Created admin user:', adminUser)

  // Create courts
  const badmintonCourts = await Promise.all([
    prisma.court.upsert({
      where: { id: 'badminton-1' },
      update: {},
      create: {
        id: 'badminton-1',
        name: 'Badminton Court 1',
        sport: 'badminton',
        courtNumber: 1,
        maxCapacity: 4,
      },
    }),
    prisma.court.upsert({
      where: { id: 'badminton-2' },
      update: {},
      create: {
        id: 'badminton-2',
        name: 'Badminton Court 2',
        sport: 'badminton',
        courtNumber: 2,
        maxCapacity: 4,
      },
    }),
  ])

  const tableTennisCourts = await Promise.all([
    prisma.court.upsert({
      where: { id: 'table-tennis-1' },
      update: {},
      create: {
        id: 'table-tennis-1',
        name: 'Table Tennis Court 1',
        sport: 'table-tennis',
        courtNumber: 1,
        maxCapacity: 4,
      },
    }),
    prisma.court.upsert({
      where: { id: 'table-tennis-2' },
      update: {},
      create: {
        id: 'table-tennis-2',
        name: 'Table Tennis Court 2',
        sport: 'table-tennis',
        courtNumber: 2,
        maxCapacity: 4,
      },
    }),
    prisma.court.upsert({
      where: { id: 'table-tennis-3' },
      update: {},
      create: {
        id: 'table-tennis-3',
        name: 'Table Tennis Court 3',
        sport: 'table-tennis',
        courtNumber: 3,
        maxCapacity: 4,
      },
    }),
  ])

  const squashCourts = await Promise.all([
    prisma.court.upsert({
      where: { id: 'squash-1' },
      update: {},
      create: {
        id: 'squash-1',
        name: 'Squash Court 1',
        sport: 'squash',
        courtNumber: 1,
        maxCapacity: 2,
      },
    }),
    prisma.court.upsert({
      where: { id: 'squash-2' },
      update: {},
      create: {
        id: 'squash-2',
        name: 'Squash Court 2',
        sport: 'squash',
        courtNumber: 2,
        maxCapacity: 2,
      },
    }),
  ])

  console.log('Created courts:', [...badmintonCourts, ...tableTennisCourts, ...squashCourts].length)

  // Create some sample events
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)

  await prisma.event.upsert({
    where: { id: 'event-1' },
    update: {},
    create: {
      id: 'event-1',
      title: 'Inter-Department Badminton Tournament',
      description: 'Annual badminton championship. Register your team now!',
      sport: 'badminton',
      date: nextWeek,
      startTime: '09:00',
      endTime: '17:00',
      location: 'Sports Complex - Main Hall',
      maxParticipants: 32,
    },
  })

  await prisma.event.upsert({
    where: { id: 'event-2' },
    update: {},
    create: {
      id: 'event-2',
      title: 'Table Tennis Championship',
      description: 'Open for all students. Singles and doubles categories available.',
      sport: 'table-tennis',
      date: tomorrow,
      startTime: '14:00',
      endTime: '18:00',
      location: 'Indoor Sports Arena',
      maxParticipants: 24,
    },
  })

  console.log('Created events')
  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
