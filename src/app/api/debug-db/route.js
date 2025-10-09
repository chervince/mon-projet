// Endpoint temporaire pour tester la DB en production
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('✅ Connected to database successfully!');
    
    // Test simple query
    const userCount = await prisma.user.count();
    console.log(`📊 Users in database: ${userCount}`);
    
    res.status(200).json({
      success: true,
      message: 'Database connection successful',
      userCount: userCount
    });
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  } finally {
    await prisma.$disconnect();
  }
}
