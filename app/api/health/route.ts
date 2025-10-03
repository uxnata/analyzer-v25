import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    env: {
      hasApiKey: !!process.env.OPENROUTER_API_KEY,
      nodeEnv: process.env.NODE_ENV,
    },
  });
}

export async function POST() {
  return NextResponse.json({
    status: 'ok',
    message: 'Health check endpoint is working',
    timestamp: new Date().toISOString(),
  });
}
