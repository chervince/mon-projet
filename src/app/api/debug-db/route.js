import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('🔍 Testing Prisma connection...');
    await prisma.$connect();
    console.log('✅ Prisma connected successfully!');

    // Test simple query
    const userCount = await prisma.user.count();
    console.log(`📊 Users in database: ${userCount}`);

    // Test establishments
    const establishmentCount = await prisma.establishment.count();
    console.log(`🏪 Establishments in database: ${establishmentCount}`);

    await prisma.$disconnect();
    console.log('✅ Prisma disconnected successfully!');

    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      data: {
        userCount,
        establishmentCount,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Database error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
