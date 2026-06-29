import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@ticket.com',
      password: 'admin123',
    },
  });

  console.log('Admin user created:', admin);
  console.log('Email: admin@ticket.com');
  console.log('Password: admin123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
