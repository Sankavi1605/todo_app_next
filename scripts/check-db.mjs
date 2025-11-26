import { MongoClient } from 'mongodb';
import { config } from 'dotenv';

config();

async function checkDB() {
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    const db = client.db('todo');
    
    console.log('\n📊 Checking database contents...\n');
    
    const user = await db.collection('User').findOne({ email: 'admin@todo.app' });
    console.log('User record:', JSON.stringify(user, null, 2));
    
    if (user) {
      const account = await db.collection('Account').findOne({ userId: user._id });
      console.log('\nAccount record:', JSON.stringify(account, null, 2));
    }
    
    const userCount = await db.collection('User').countDocuments();
    const accountCount = await db.collection('Account').countDocuments();
    
    console.log(`\n📈 Total users: ${userCount}`);
    console.log(`📈 Total accounts: ${accountCount}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkDB();
