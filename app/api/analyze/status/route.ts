import { NextRequest, NextResponse } from 'next/server'
import { getAnalysisStatus } from '../../../../lib/analysis-store'

// Отключаем статическую генерацию для этого API route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const requestId = searchParams.get('requestId')
    
    if (!requestId) {
      return NextResponse.json({ error: 'requestId is required' }, { status: 400 })
    }
    
    const analysis = getAnalysisStatus(requestId)
    
    if (!analysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 })
    }
    
    return NextResponse.json({
      requestId,
      status: analysis.status,
      progress: analysis.progress,
      currentStep: analysis.currentStep,
      result: analysis.result,
      error: analysis.error,
      startTime: analysis.startTime,
      elapsed: Date.now() - analysis.startTime
    })
    
  } catch (error) {
    console.error('Error checking analysis status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
