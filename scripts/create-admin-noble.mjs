import { PrismaClient } from '@prisma/client';
import { scrypt as scryptAsync } from '@noble/hashes/scrypt.js';

const prisma = new PrismaClient();

// Better Auth uses @noble/hashes/scrypt with these exact config values
const config = {
  N: 16384,
  r: 16,
  p: 1,
  dkLen: 64,
};

async function hashPassword(password) {
  const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  const key = await scryptAsync(password.normalize('NFKC'), salt, {
    N: config.N,
    p: config.p,
    r: config.r,
    dkLen: config.dkLen,
    maxmem: 128 * config.N * config.r * 2,
  });
  
  const keyHex = Array.from(key)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return `${salt}:${keyHex}`;
}

async function createAdmin() {
  console.log('🌱 Creating admin user with Better Auth password format...\n');

  const adminEmail = 'admin@todo.app';
  const adminPassword = 'admin123';

  try {
    // Delete existing admin if exists
    const existing = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existing) {
      console.log('⚠️  Deleting existing admin user...');
      await prisma.account.deleteMany({ where: { userId: existing.id } });
      await prisma.session.deleteMany({ where: { userId: existing.id } });
      await prisma.user.delete({ where: { id: existing.id } });
    }

    // Hash password using Better Auth's exact method
    const hashedPassword = await hashPassword(adminPassword);

    // Create user and account in transaction
    const admin = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: adminEmail,
          emailVerified: true,
          name: 'Admin User',
          role: 'ADMIN',
        },
      });

      await tx.account.create({
        data: {
          userId: user.id,
          accountId: user.id,
          providerId: 'credential',
          password: hashedPassword,
        },
      });

      return user;
    });

    console.log('✅ Admin user created successfully!');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   User ID: ${admin.id}`);
    console.log('\n⚠️  Please change the password after first login!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
