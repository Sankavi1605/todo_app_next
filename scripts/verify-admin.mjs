import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ['query'] });

async function verifyAdmin() {
  console.log('\n🔍 Verifying admin user with Prisma...\n');
  
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'admin@todo.app' },
      include: { accounts: true, sessions: true }
    });
    
    if (!user) {
      console.log('❌ User not found!');
      return;
    }
    
    console.log('✅ User found:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Email Verified: ${user.emailVerified}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Accounts: ${user.accounts.length}`);
    
    if (user.accounts.length > 0) {
      console.log('\n✅ Account details:');
      user.accounts.forEach((acc, i) => {
        console.log(`   Account ${i + 1}:`);
        console.log(`     Provider ID: ${acc.providerId}`);
        console.log(`     Account ID: ${acc.accountId}`);
        console.log(`     Has password: ${acc.password ? 'Yes' : 'No'}`);
        if (acc.password) {
          console.log(`     Password format: ${acc.password.split(':').length === 2 ? 'salt:hash ✅' : 'Invalid ❌'}`);
        }
      });
    } else {
      console.log('\n❌ No accounts found for user!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyAdmin();
