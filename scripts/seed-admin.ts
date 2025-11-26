import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Better Auth uses scrypt for password hashing (not bcrypt)
async function hashPassword(password: string): Promise<string> {
  const { scrypt, randomBytes } = await import("crypto");
  const salt = randomBytes(16).toString("hex");
  
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ":" + derivedKey.toString("hex"));
    });
  });
}

async function seedAdmin() {
  console.log("🌱 Seeding admin user...");

  const adminEmail = "admin@todo.app";
  const adminPassword = "admin123"; // Change this to a secure password

  try {
    // Check if admin already exists
    const existing = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existing) {
      console.log(`⚠️  Admin user already exists: ${adminEmail}`);
      console.log(`   Deleting and recreating...`);
      
      // Delete associated account first (foreign key constraint)
      await prisma.account.deleteMany({
        where: { userId: existing.id },
      });
      
      await prisma.user.delete({
        where: { email: adminEmail },
      });
    }

    // Hash password using the same method as Better Auth
    const hashedPassword = await hashPassword(adminPassword);

    // Create admin user and account in a transaction
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        emailVerified: true,
        role: "ADMIN",
        name: "Admin User",
      },
    });

    // Better Auth stores passwords in the Account table with providerId "credential"
    await prisma.account.create({
      data: {
        userId: admin.id,
        accountId: admin.id,
        providerId: "credential",
        password: hashedPassword,
      },
    });

    console.log("✅ Admin user created successfully!");
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   Role: ${admin.role}`);
    console.log("\n⚠️  Please change the password after first login!");
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
