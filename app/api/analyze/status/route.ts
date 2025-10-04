import { NextRequest, NextResponse } from 'next/server'

// Импортируем хранилище из основного файла
// В реальном приложении это должно быть в отдельном модуле
const activeAnalyses = new Map<string, any>()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const requestId = searchParams.get('requestId')
    
    if (!requestId) {
      return NextResponse.json({ error: 'requestId is required' }, { status: 400 })
    }
    
    const analysis = activeAnalyses.get(requestId)
    
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
