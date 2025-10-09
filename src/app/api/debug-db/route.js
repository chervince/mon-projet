import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      message: 'Debug endpoint working!',
      timestamp: new Date().toISOString(),
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasPrismaUrl: !!process.env.POSTGRES_PRISMA_URL,
        nodeEnv: process.env.NODE_ENV
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Something went wrong',
      message: error.message
    }, { status: 500 });
  }
}
