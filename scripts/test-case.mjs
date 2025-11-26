import { MongoClient } from 'mongodb';
import { config } from 'dotenv';

config();

async function testCaseSensitivity() {
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    const db = client.db('todo');
    
    console.log('\n🔍 Testing case sensitivity...\n');
    
    // Test exact case
    const exact = await db.collection('User').findOne({ email: 'admin@todo.app' });
    console.log('Exact case (admin@todo.app):', exact ? '✅ Found' : '❌ Not found');
    
    // Test uppercase
    const upper = await db.collection('User').findOne({ email: 'ADMIN@TODO.APP' });
    console.log('Uppercase (ADMIN@TODO.APP):', upper ? '✅ Found' : '❌ Not found');
    
    // Test mixed
    const mixed = await db.collection('User').findOne({ email: 'Admin@Todo.App' });
    console.log('Mixed case (Admin@Todo.App):', mixed ? '✅ Found' : '❌ Not found');
    
    // What Better Auth actually queries
    const lowerCased = await db.collection('User').findOne({ email: 'admin@todo.app'.toLowerCase() });
    console.log('Lowercased (admin@todo.app):', lowerCased ? '✅ Found' : '❌ Not found');
    
    console.log('\n📝 Stored email value:', exact?.email);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

testCaseSensitivity();
