import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Railway API работает',
    timestamp: new Date().toISOString(),
    env: {
      hasApiKey: !!process.env.OPENROUTER_API_KEY,
      nodeEnv: process.env.NODE_ENV
    }
  })
}

export async function POST() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Railway API POST работает',
    timestamp: new Date().toISOString()
  })
}
