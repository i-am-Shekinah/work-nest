import * as bcrypt from 'bcrypt';

import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../../generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

async function main() {
  // create admin dept & admin user
  const adminDept = await prisma.department.upsert({
    where: { name: 'Admin Department' },
    update: {},
    create: { name: 'Admin Department ' },
  });

  const adminExists = await prisma.user.findUnique({
    where: { email: 'admin@worknest.com' },
  });

  if (!adminExists) {
    const hashedPassword =
      '$2a$12$iTojejiZ6RG4qYHMciyetO6eEbkabWFQTtLvrnHq9kH3cdzZaJxfW';

    await prisma.user.create({
      data: {
        email: 'admin@worknest.com',
        hashedPassword,
        firstName: 'Mikky',
        lastName: 'Fire',
        role: 'ADMIN',
        status: 'ACTIVE',
        departmentId: adminDept.id,
        headedDepartment: { connect: { id: adminDept.id } },
      },
    });
    console.log(`Admin user admin@worknest.com created successfully...`);
  }

  bcrypt.compare;

  // create staff dept and staff users
  const staffDept = await prisma.department.upsert({
    where: { name: 'Technical Department' },
    update: {},
    create: { name: 'Technical Department' },
  });

  const staffUsersData = [
    { email: 'staff1@worknest.com', firstName: 'Silver', lastName: 'Smith' },
    { email: 'staff2@worknest.com', firstName: 'Zayden', lastName: 'Tare' },
  ];

  for (const staff of staffUsersData) {
    const exists = await prisma.user.findUnique({
      where: { email: staff.email },
    });

    if (!exists) {
      const hashedPassword =
        '$2a$12$FGz5LqqOKPh3uzFoDYMeju8Woy0AoWFzM7UpD6ai5BgLT9fsMrRS.';
      await prisma.user.create({
        data: {
          email: staff.email,
          hashedPassword,
          firstName: staff.firstName,
          lastName: staff.lastName,
          role: 'STAFF',
          status: 'ACTIVE',
          departmentId: staffDept.id,
        },
      });
      console.log(`Staff user ${staff.email} has been created successfully...`);
    }
  }

  // create clients
  const clientsData = [
    {
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice@example.com',
      phone: '1234567890',
      notes: 'VIP client',
    },
    {
      firstName: 'Bob',
      lastName: 'Smith',
      email: 'bob@example.com',
      phone: '0987654321',
      notes: 'Regular client with special needs',
    },
  ];

  for (const client of clientsData) {
    const exists = await prisma.client.findUnique({
      where: { email: client.email },
    });

    if (!exists) {
      await prisma.client.create({ data: client });
      console.log(`Client ${client.email} created successfully...`);
    }
  }

  // create sample bookings
  const staffUsers = await prisma.user.findMany({
    where: { role: 'STAFF' },
  });
  const clients = await prisma.client.findMany();

  const now = new Date();
  const bookingsData = [
    {
      title: 'Project Kickoff',
      description: 'Initial meeting with Alice',
      startTime: new Date(now.getTime() + 3600 * 1000), // 1 hour from now
      endTime: new Date(now.getTime() + 7200 * 1000), // 2 hours from now
      assignedUserId: staffUsers[0].id,
      clientId: clients[0].id,
    },

    {
      title: 'Design Review',
      description: 'Review design documents with Bob',
      startTime: new Date(now.getTime() + 10800 * 1000), // 3 hours from now
      endTime: new Date(now.getTime() + 14400 * 1000), // 4 hours from now
      assignedUserId: staffUsers[1].id,
      clientId: clients[1].id,
    },

    {
      title: 'Weekly Sync',
      description: 'Internal team sync meeting',
      startTime: new Date(now.getTime() + 172800 * 1000), // 2 days from now
      endTime: new Date(now.getTime() + 174000 * 1000), // ~2 days + 1 hr
      assignedUserId: staffUsers[0].id,
      clientId: clients[0].id,
    },
  ];

  for (const booking of bookingsData) {
    await prisma.booking.create({
      data: {
        ...booking,
        status: 'PENDING',
      },
    });
  }

  console.log('Sample bookings created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
