import { MongoClient } from 'mongodb';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { config } from 'dotenv';

config(); // Load .env file

const scryptAsync = promisify(scrypt);

// Better Auth uses this exact format for password hashing
async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scryptAsync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

function generateCuid() {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `c${timestamp}${randomPart}`;
}

async function createAdmin() {
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    console.log('🌱 Connected to MongoDB');
    
    const db = client.db('todo');
    const usersCollection = db.collection('User');
    const accountsCollection = db.collection('Account');
    
    const adminEmail = 'admin@todo.app';
    const adminPassword = 'admin123';
    
    // Delete existing admin if exists
    const existing = await usersCollection.findOne({ email: adminEmail });
    if (existing) {
      console.log('⚠️  Deleting existing admin user...');
      await accountsCollection.deleteMany({ userId: existing._id });
      await usersCollection.deleteOne({ _id: existing._id });
    }
    
    // Create user
    const userId = generateCuid();
    const hashedPassword = await hashPassword(adminPassword);
    
    await usersCollection.insertOne({
      _id: userId,
      email: adminEmail,
      emailVerified: true,
      name: 'Admin User',
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('✅ User created');
    
    // Create account (this is where Better Auth stores passwords!)
    await accountsCollection.insertOne({
      _id: generateCuid(),
      userId: userId,
      accountId: userId,
      providerId: 'credential',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('✅ Account created with credential provider');
    console.log('\n🎉 Admin user created successfully!');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('\n⚠️  Please change the password after first login!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

createAdmin();
