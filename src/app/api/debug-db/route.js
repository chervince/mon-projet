import { NextResponse } from 'next/server';
import pkg from 'pg';
const { Client } = pkg;

export async function GET() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔍 Testing direct PostgreSQL connection from Vercel...');
    console.log('Host:', process.env.DATABASE_URL?.split('@')[1]?.split(':')[0]);
    
    await client.connect();
    console.log('✅ Connected to PostgreSQL successfully!');

    const result = await client.query('SELECT version()');
    console.log('📊 PostgreSQL version:', result.rows[0].version);

    const tablesResult = await client.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public'
    `);
    console.log('📋 Tables in database:', tablesResult.rows.map(r => r.tablename));

    await client.end();
    console.log('✅ Disconnected successfully!');

    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      data: {
        version: result.rows[0].version,
        tables: tablesResult.rows.map(r => r.tablename),
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Database connection error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      host: process.env.DATABASE_URL?.split('@')[1]?.split(':')[0],
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
