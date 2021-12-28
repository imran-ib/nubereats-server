import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

const USERS = [
  {
    email: 'imran@test2.com',
    password: '123456',
    name: 'imran',
  },
  {
    email: 'john@test.com',
    password: '123456',
    name: 'john',
  },
  {
    email: 'jane@test.com',
    password: '123456',
    name: 'jane',
  },
];

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function main() {
  const users = await prisma.user.createMany({
    data: [...USERS],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
