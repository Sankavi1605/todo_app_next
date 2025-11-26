import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ['query', 'error'] });

async function test() {
  console.log('\n🔍 Testing Prisma queries...\n');
  
  try {
    // Test if we can query users
    const users = await prisma.user.findMany();
    console.log('✅ Users found:', users.length);
    console.log('Users:', JSON.stringify(users, null, 2));
    
    // Test specific user lookup
    const user = await prisma.user.findUnique({
      where: { email: 'admin@todo.app' },
      include: { accounts: true }
    });
    
    console.log('\n✅ Admin user lookup:');
    console.log(JSON.stringify(user, null, 2));
    
    if (!user) {
      console.log('❌ User not found via Prisma!');
    } else if (!user.accounts || user.accounts.length === 0) {
      console.log('❌ User found but no accounts!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
