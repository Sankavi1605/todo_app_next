import { PrismaClient } from '@prisma/client';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

const prisma = new PrismaClient();

const auth = betterAuth({
  adapter: prismaAdapter(prisma, { provider: 'mongodb' }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  database: prisma,
  secret: process.env.BETTER_AUTH_SECRET || 'secret-key-min-32-chars-long-for-better-auth',
  baseURL: 'http://localhost:3000',
});

async function createAdminUser() {
  console.log('🌱 Creating admin user via Better Auth API...\n');

  const adminEmail = 'admin@todo.app';
  const adminPassword = 'admin123';

  try {
    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: adminEmail },
      include: { accounts: true }
    });

    if (existing) {
      console.log('⚠️  Admin user already exists. Deleting...');
      await prisma.account.deleteMany({ where: { userId: existing.id } });
      await prisma.session.deleteMany({ where: { userId: existing.id } });
      await prisma.user.delete({ where: { id: existing.id } });
    }

    // Use Better Auth API to create user
    const result = await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: 'Admin User',
      },
    });

    if (result?.user) {
      // Update the user to ADMIN role
      await prisma.user.update({
        where: { id: result.user.id },
        data: { 
          role: 'ADMIN',
          emailVerified: true 
        },
      });

      console.log('✅ Admin user created successfully via Better Auth!');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
      console.log(`   Role: ADMIN`);
      console.log(`   User ID: ${result.user.id}`);
      console.log('\n⚠️  Please change the password after first login!');
    } else {
      console.error('❌ Failed to create user - no user returned');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.body) {
      console.error('Details:', error.body);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
