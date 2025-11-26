import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function resetDatabase() {
  console.log("🗑️  Dropping all records...");
  
  try {
    // Delete in correct order due to foreign keys
    await prisma.session.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.todo.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.verification.deleteMany({});

    console.log("✅ Database reset complete! All data cleared.");
    console.log("\nNext steps:");
    console.log("1. Run 'npm run seed' to create admin account");
    console.log("2. Run 'npm run dev' to start the server");
    console.log("3. Login with admin@todo.app / admin123");
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
