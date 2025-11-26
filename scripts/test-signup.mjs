import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testSignup() {
  console.log('\n=== Testing Signup Flow ===\n');
  
  const email = 'test@example.com';
  
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
    include: { accounts: true }
  });
  
  if (existingUser) {
    console.log('User already exists:');
    console.log(`Email: ${existingUser.email}`);
    console.log(`Accounts: ${existingUser.accounts.length}`);
    console.log('\nDeleting existing test user...\n');
    
    await prisma.account.deleteMany({
      where: { userId: existingUser.id }
    });
    await prisma.user.delete({
      where: { id: existingUser.id }
    });
  }
  
  console.log('Now try signing up at http://localhost:3000/signup');
  console.log(`Email: ${email}`);
  console.log('Password: testpass123');
  console.log('\nAfter signup, run this script again to verify...\n');
  
  await prisma.$disconnect();
}

testSignup().catch((e) => {
  console.error(e);
  process.exit(1);
});
