import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUsers() {
  console.log('\n=== Checking Users ===\n');
  
  const users = await prisma.user.findMany({
    include: {
      accounts: {
        select: {
          providerId: true,
          accountId: true,
          password: true,
        }
      }
    }
  });
  
  console.log(`Found ${users.length} users:\n`);
  
  for (const user of users) {
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log(`ID: ${user.id}`);
    console.log(`Accounts: ${user.accounts.length}`);
    if (user.accounts.length > 0) {
      user.accounts.forEach(acc => {
        console.log(`  - Provider: ${acc.providerId}, Has Password: ${!!acc.password}`);
      });
    } else {
      console.log('  - No accounts found (this will prevent login)');
    }
    console.log('---');
  }
  
  await prisma.$disconnect();
}

checkUsers().catch((e) => {
  console.error(e);
  process.exit(1);
});
