const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...\n');

    // Test 1: Simple connection test
    console.log('Test 1: Connecting to database...');
    await prisma.$connect();
    console.log('✅ Connected successfully!\n');

    // Test 2: Query existing tables
    console.log('Test 2: Querying database tables...');
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    console.log('✅ Tables found:', tables.map(t => t.table_name).join(', '));
    console.log();

    // Test 3: Count users
    console.log('Test 3: Counting users...');
    const userCount = await prisma.user.count();
    console.log(`✅ Found ${userCount} users in database\n`);

    // Test 4: Count establishments
    console.log('Test 4: Counting establishments...');
    const establishmentCount = await prisma.establishment.count();
    console.log(`✅ Found ${establishmentCount} establishments in database\n`);

    // Test 5: Check database version
    console.log('Test 5: Checking PostgreSQL version...');
    const version = await prisma.$queryRaw`SELECT version();`;
    console.log('✅ PostgreSQL version:', version[0].version.split(' ')[0] + ' ' + version[0].version.split(' ')[1]);
    console.log();

    console.log('🎉 All tests passed! Database connection is working correctly.\n');

  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Error:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('👋 Disconnected from database.');
  }
}

testConnection();
