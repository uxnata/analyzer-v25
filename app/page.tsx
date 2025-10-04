'use client'

import { useState, useEffect } from 'react'
import { BriefUpload } from '../components/BriefUpload'
import { TranscriptUpload } from '../components/TranscriptUpload'
import { AnalysisRunner } from '../components/AnalysisRunner'
import { ResultsViewer } from '../components/ResultsViewer'
import { ReportGenerator } from '../components/ReportGenerator'

type Step = 'brief' | 'transcripts' | 'analysis' | 'results' | 'reports'

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>('brief')
  const [brief, setBrief] = useState('')
  const [transcripts, setTranscripts] = useState<string[]>([])
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const selectedModel = 'anthropic/claude-3.5-sonnet' // Фиксированная модель
  


  // Загружаем сохраненные данные при инициализации
  useEffect(() => {
    const savedBrief = localStorage.getItem('ux-analyzer-brief')
    const savedTranscripts = localStorage.getItem('ux-analyzer-transcripts')
    const savedAnalysisResult = localStorage.getItem('ux-analyzer-analysis-result')
    const savedStep = localStorage.getItem('ux-analyzer-current-step') as Step
    if (savedBrief) {
      setBrief(savedBrief)
    }
    
    if (savedTranscripts) {
      try {
        setTranscripts(JSON.parse(savedTranscripts))
      } catch (e) {
        console.error('Error parsing saved transcripts:', e)
      }
    }
    
    if (savedAnalysisResult) {
      try {
        setAnalysisResult(JSON.parse(savedAnalysisResult))
      } catch (e) {
        console.error('Error parsing saved analysis result:', e)
      }
    }
    
    if (savedStep && ['brief', 'transcripts', 'analysis', 'results', 'reports'].includes(savedStep)) {
      setCurrentStep(savedStep)
    }
  }, [])

  // Сохраняем данные при изменении
  useEffect(() => {
    localStorage.setItem('ux-analyzer-brief', brief)
  }, [brief])

  useEffect(() => {
    localStorage.setItem('ux-analyzer-transcripts', JSON.stringify(transcripts))
  }, [transcripts])

  useEffect(() => {
    if (analysisResult) {
      localStorage.setItem('ux-analyzer-analysis-result', JSON.stringify(analysisResult))
    }
  }, [analysisResult])

  useEffect(() => {
    localStorage.setItem('ux-analyzer-current-step', currentStep)
  }, [currentStep])


  const handleBriefComplete = (briefText: string) => {
    setBrief(briefText)
    setCurrentStep('transcripts')
  }

  const handleTranscriptsComplete = (transcriptTexts: string[]) => {
    setTranscripts(transcriptTexts)
    setCurrentStep('analysis')
  }

  const handleAnalysisComplete = async (result: any) => {
    console.log('🎯 handleAnalysisComplete вызван с результатом:', result)
    console.log('📊 Размер результата:', JSON.stringify(result).length, 'символов')
    setAnalysisResult(result)
    console.log('📝 Анализ результат установлен, переходим к результатам...')
    setCurrentStep('results')
    console.log('✅ Переход к результатам завершен')
  }

  const handleBackToAnalysis = () => {
    setCurrentStep('analysis')
  }

  const handleGenerateReport = () => {
    setCurrentStep('reports')
  }

  const handleBackToResults = () => {
    setCurrentStep('results')
  }

  // Функция для очистки всех данных
  const clearAllData = () => {
    setBrief('')
    setTranscripts([])
    setAnalysisResult(null)
    setCurrentStep('brief')
    
    // Очищаем все данные из localStorage
    const keysToRemove = [
      'ux-analyzer-brief',
      'ux-analyzer-transcripts', 
      'ux-analyzer-analysis-result',
      'ux-analyzer-current-step',
      'ux-analyzer-selected-model'
    ]
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
    })
    
    // Принудительно очищаем все ключи, которые могут содержать данные
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('ux-analyzer-')) {
        localStorage.removeItem(key)
      }
    })
    
    console.log('🧹 Все данные очищены')
  }

  const steps = [
    { id: 'brief', label: 'Бриф', description: 'Загрузка брифа исследования' },
    { id: 'transcripts', label: 'Транскрипты', description: 'Загрузка интервью' },
    { id: 'analysis', label: 'Анализ', description: 'AI-анализ данных' },
    { id: 'results', label: 'Результаты', description: 'Просмотр результатов' },
    { id: 'reports', label: 'Отчеты', description: 'Генерация отчетов' }
  ]

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'brief':
        return <BriefUpload onComplete={handleBriefComplete} initialValue={brief} />
      case 'transcripts':
        return <TranscriptUpload onComplete={handleTranscriptsComplete} onBack={() => setCurrentStep('brief')} initialValue={transcripts} />
      case 'analysis':
        return (
          <AnalysisRunner
            brief={brief}
            transcripts={transcripts}
            selectedModel={selectedModel}
            onComplete={handleAnalysisComplete}
            onNext={() => setCurrentStep('results')}
            onBack={() => setCurrentStep('transcripts')}
          />
        )
      case 'results':
        return (
          <ResultsViewer
            result={analysisResult}
            onBack={handleBackToAnalysis}
            onGenerateReport={handleGenerateReport}
          />
        )
      case 'reports':
        return (
          <ReportGenerator
            result={analysisResult}
            onBack={handleBackToResults}
          />
        )
      default:
        return <BriefUpload onComplete={handleBriefComplete} initialValue={brief} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black">
                <span className="text-sm font-bold text-white">🔍</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">Analyzer V25.0</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Анализ пользовательского опыта с ИИ
              </div>
              <button
                onClick={clearAllData}
                className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                title="Очистить все данные"
              >
                Очистить
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {steps.map((step, index) => {
              const isActive = step.id === currentStep
              const isCompleted = index < getCurrentStepIndex()
              const isClickable = index <= getCurrentStepIndex() + 1
              
              // Проверяем, есть ли данные для каждого шага
              const hasData = step.id === 'brief' ? brief.length > 0 :
                             step.id === 'transcripts' ? transcripts.length > 0 :
                             step.id === 'analysis' ? brief.length > 0 && transcripts.length > 0 :
                             step.id === 'results' ? analysisResult :
                             step.id === 'reports' ? analysisResult : false

              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => {
                      if (isClickable) {
                        setCurrentStep(step.id as Step)
                      }
                    }}
                    disabled={!isClickable}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : isCompleted
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : isClickable
                        ? 'bg-muted text-muted-foreground hover:bg-muted/80'
                        : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                      isActive
                        ? 'bg-primary-foreground text-primary'
                        : isCompleted
                        ? 'bg-green-600 text-white'
                        : 'bg-muted-foreground text-muted'
                    }`}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{step.label}</div>
                      <div className="text-xs opacity-75">{step.description}</div>
                      {hasData && !isActive && (
                        <div className="text-xs text-green-600 font-medium mt-1">
                          {step.id === 'brief' ? `${brief.length} символов` :
                           step.id === 'transcripts' ? `${transcripts.length} интервью` :
                           step.id === 'analysis' ? 'Готов к анализу' :
                           step.id === 'results' ? 'Результаты готовы' :
                           step.id === 'reports' ? 'Отчеты доступны' : ''}
                        </div>
                      )}
                    </div>
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      isCompleted ? 'bg-green-300' : 'bg-muted'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderStepContent()}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>Analyzer V25.0 - Анализ пользовательского опыта с использованием AI</p>
            <p className="mt-2">Поддерживаемые форматы: .txt, .docx</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
