async function testSignup() {
  console.log('\n=== Testing Better Auth Signup ===\n');
  
  const email = 'test' + Date.now() + '@example.com';
  const password = 'testpass123';
  
  console.log(`Testing signup with email: ${email}`);
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/sign-up/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name: email.split('@')[0],
        role: 'USER',
      }),
    });
    
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✓ Signup request successful');
      console.log('\nNow checking if user was created in database...\n');
      
      // Wait a bit for the database write
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check database
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      
      const user = await prisma.user.findUnique({
        where: { email },
        include: { accounts: true }
      });
      
      if (user) {
        console.log('✓ User found in database:');
        console.log(`  Email: ${user.email}`);
        console.log(`  Role: ${user.role}`);
        console.log(`  Accounts: ${user.accounts.length}`);
      } else {
        console.log('✗ User NOT found in database (THIS IS THE PROBLEM)');
      }
      
      await prisma.$disconnect();
    } else {
      console.log('\n✗ Signup request failed');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testSignup();
