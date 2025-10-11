// Test de connexion direct sans Prisma
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function testDirectConnection() {
  try {
    console.log('🔍 Testing direct PostgreSQL connection...');
    await client.connect();
    console.log('✅ Connected to PostgreSQL successfully!');

    const result = await client.query('SELECT version()');
    console.log('📊 PostgreSQL version:', result.rows[0].version);

    // Test si les tables existent
    const tablesResult = await client.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public'
    `);
    console.log('📋 Tables in database:', tablesResult.rows.map(r => r.tablename));

    await client.end();
    console.log('✅ Disconnected successfully!');

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Full error:', error);
  }
}

testDirectConnection();
