'use client'

import { useState } from 'react'
import { Brain, Play, CheckCircle, Loader2, AlertCircle } from 'lucide-react'

interface AnalysisRunnerProps {
  brief: string
  transcripts: string[]
  selectedModel: string
  onComplete: (result: any) => void
  onNext: () => void
  onBack: () => void
}

export function AnalysisRunner({ brief, transcripts, selectedModel, onComplete, onNext, onBack }: AnalysisRunnerProps) {
  const [analysisType, setAnalysisType] = useState<'normal' | 'parallel' | 'quick'>('normal')
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [currentTranscript, setCurrentTranscript] = useState<number>(0)
  const [currentChunk, setCurrentChunk] = useState<number>(0)
  const [totalChunks, setTotalChunks] = useState<number>(0)
  const [analysisPhase, setAnalysisPhase] = useState<string>('')

  const analysisSteps = [
    'Анализ брифа исследования',
    'Обработка транскриптов',
    'Выявление паттернов поведения',
    'Определение потребностей пользователей',
    'Анализ болевых точек',
    'Создание персонажей',
    'Формирование рекомендаций',
    'Расчет метрик',
    'Подготовка отчета'
  ]

  const runAnalysis = async () => {
    setIsRunning(true)
    setError(null)
    setCurrentStep(0)
    setCurrentTranscript(0)
    setCurrentChunk(0)
    setTotalChunks(0)
    setAnalysisPhase('')

    try {
      // Показываем прогресс пошагово
      for (let i = 0; i < analysisSteps.length; i++) {
        setCurrentStep(i)
        
        // Детальная информация о текущем этапе
        if (i === 1) {
          setAnalysisPhase('Обработка транскриптов')
          for (let t = 0; t < transcripts.length; t++) {
            setCurrentTranscript(t + 1)
            setTotalChunks(Math.ceil(transcripts[t].length / 1500))
            await new Promise(resolve => setTimeout(resolve, 200))
          }
        } else if (i === 2) {
          setAnalysisPhase('Анализ паттернов')
          await new Promise(resolve => setTimeout(resolve, 300))
        } else if (i === 3) {
          setAnalysisPhase('Определение потребностей')
          await new Promise(resolve => setTimeout(resolve, 300))
        } else if (i === 4) {
          setAnalysisPhase('Анализ болей')
          await new Promise(resolve => setTimeout(resolve, 300))
        } else if (i === 5) {
          setAnalysisPhase('Создание персон')
          await new Promise(resolve => setTimeout(resolve, 300))
        } else if (i === 6) {
          setAnalysisPhase('Генерация рекомендаций')
          await new Promise(resolve => setTimeout(resolve, 300))
        } else if (i === 7) {
          setAnalysisPhase('Расчет метрик')
          await new Promise(resolve => setTimeout(resolve, 300))
        } else if (i === 8) {
          setAnalysisPhase('Подготовка отчета')
          await new Promise(resolve => setTimeout(resolve, 300))
        } else {
          await new Promise(resolve => setTimeout(resolve, 300))
        }
      }

      // Вызываем API анализа с retry логикой
      let response: Response | undefined
      let lastError: Error | null = null
      
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`🔄 Попытка ${attempt}/3 вызова API анализа...`)
          
          const controller = new AbortController()
          const startTime = Date.now()
          const timeoutId = setTimeout(() => {
            console.log('⏰ Таймаут 20 минут истек, прерываем запрос')
            controller.abort()
          }, 1200000) // 20 минут таймаут для Railway
          
          // Логируем каждые 30 секунд, что запрос еще идет
          const progressInterval = setInterval(() => {
            const elapsed = Math.round((Date.now() - startTime) / 1000)
            console.log(`⏳ Запрос выполняется уже ${elapsed} секунд...`)
          }, 30000)
          
          const apiUrl = typeof window !== 'undefined' && window.location.hostname.includes('railway') 
            ? 'https://analyzer-v25-production.up.railway.app/api/analyze'
            : '/api/analyze'
          
          response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              brief,
              transcripts,
              model: selectedModel,
              analysisMode: analysisType === 'quick' ? 'quick' : 'full'
            }),
            signal: controller.signal
          })
          
          clearTimeout(timeoutId)
          clearInterval(progressInterval)
          
          console.log(`📊 Получен ответ: ${response.status} ${response.statusText}`)
          console.log(`📋 Заголовки ответа:`, Object.fromEntries(response.headers.entries()))
          
          if (!response.ok) {
            throw new Error(`Ошибка анализа: ${response.status}`)
          }
          
          console.log('✅ Ответ успешен, выходим из цикла попыток')
          // Если успешно, выходим из цикла
          break
          
        } catch (error: any) {
          lastError = error
          clearInterval(progressInterval)
          console.error(`❌ Попытка ${attempt} не удалась:`, error?.message || 'Неизвестная ошибка')
          
          if (error.name === 'AbortError') {
            console.log('⏰ Таймаут запроса (20 минут)')
          } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
            console.log('🌐 Сетевая ошибка, повторяем...')
          }
          
          if (attempt === 3) {
            throw lastError
          }
          
          // Задержка перед повторной попыткой
          const delay = Math.min(2000 * Math.pow(2, attempt - 1), 10000)
          console.log(`⏳ Ожидание ${delay}ms перед повторной попыткой...`)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }

      if (!response) {
        throw new Error('Не удалось получить ответ от API после всех попыток')
      }

      console.log('📦 Начинаем парсинг JSON ответа...')
      const result = await response.json()
      console.log('✅ JSON успешно распарсен, размер:', JSON.stringify(result).length, 'символов')
      
      // Добавляем информацию о входных данных
      result.inputData = {
        briefLength: brief.length,
        transcriptCount: transcripts.length,
        totalTranscriptLength: transcripts.reduce((sum, t) => sum + t.length, 0),
        analysisType
      }

      // Вызываем callback с результатом
      console.log('🎯 Передаем результат в callback...')
      onComplete(result)
      console.log('✅ Анализ полностью завершен!')
      
      // Переходим к следующему шагу
      onNext()
      
    } catch (err) {
      console.error('Analysis error:', err)
      setError(err instanceof Error ? err.message : 'Произошла ошибка при анализе')
    } finally {
      setIsRunning(false)
    }
  }

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed'
    if (stepIndex === currentStep) return 'current'
    return 'pending'
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Brain className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-foreground">Запуск анализа</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Выберите тип анализа и запустите AI-анализ ваших данных
        </p>
      </div>

      {/* Input Summary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Данные для анализа</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Бриф исследования</p>
            <p className="font-medium">{brief.length} символов</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Транскрипты</p>
            <p className="font-medium">{transcripts.length} интервью</p>
            <p className="text-xs text-muted-foreground mt-1">
              Общий объем: {transcripts.reduce((sum, t) => sum + t.length, 0).toLocaleString()} символов
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Options */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Тип анализа</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer">
            <input
              type="radio"
              name="analysisType"
              value="normal"
              checked={analysisType === 'normal'}
              onChange={(e) => setAnalysisType(e.target.value as 'normal' | 'parallel' | 'quick')}
              className="mt-1 text-primary"
            />
            <div>
              <div className="font-medium text-foreground">Полный анализ</div>
              <p className="text-sm text-muted-foreground">
                Детальный анализ всех аспектов
              </p>
            </div>
          </label>
          
          <label className="flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer">
            <input
              type="radio"
              name="analysisType"
              value="parallel"
              checked={analysisType === 'parallel'}
              onChange={(e) => setAnalysisType(e.target.value as 'normal' | 'parallel' | 'quick')}
              className="mt-1 text-primary"
            />
            <div>
              <div className="font-medium text-foreground">Параллельный анализ</div>
              <p className="text-sm text-muted-foreground">
                Ускоренная обработка
              </p>
            </div>
          </label>

          <label className="flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer">
            <input
              type="radio"
              name="analysisType"
              value="quick"
              checked={analysisType === 'quick'}
              onChange={(e) => setAnalysisType(e.target.value as 'normal' | 'parallel' | 'quick')}
              className="mt-1 text-primary"
            />
            <div>
              <div className="font-medium text-foreground">Быстрый анализ</div>
              <p className="text-sm text-muted-foreground">
                Экономичный режим (~$1-2)
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Start Button */}
      <div className="text-center">
        <button
          onClick={runAnalysis}
          disabled={isRunning}
          className="inline-flex items-center px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isRunning ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Анализ выполняется...
            </>
          ) : (
            <>
              <Play className="h-5 w-5 mr-2" />
              Запустить анализ
            </>
          )}
        </button>
      </div>

      {/* Progress */}
      {isRunning && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-4">Прогресс анализа</h3>
          
          {/* Детальная информация о прогрессе */}
          {analysisPhase && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                <span className="text-sm font-medium text-blue-800">{analysisPhase}</span>
              </div>
              {currentTranscript > 0 && (
                <div className="text-sm text-blue-700">
                  Обработка транскрипта {currentTranscript} из {transcripts.length}
                  {totalChunks > 0 && ` • Чанков: ${currentChunk}/${totalChunks}`}
                </div>
              )}
            </div>
          )}
          
          <div className="space-y-4">
            {analysisSteps.map((step, index) => {
              const status = getStepStatus(index)
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    status === 'completed' 
                      ? 'border-green-500 bg-green-500 text-white'
                      : status === 'current'
                      ? 'border-primary bg-primary text-white'
                      : 'border-muted bg-muted text-muted-foreground'
                  }`}>
                    {status === 'completed' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : status === 'current' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </div>
                  <span className={`text-sm ${
                    status === 'completed' 
                      ? 'text-green-600 font-medium'
                      : status === 'current'
                      ? 'text-primary font-medium'
                      : 'text-muted-foreground'
                  }`}>
                    {step}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Ошибка анализа</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-center pt-8 space-x-4">
        <button
          onClick={onBack}
          disabled={isRunning}
          className="px-6 py-2 border border-muted text-muted-foreground rounded-lg hover:bg-muted/50 disabled:opacity-50 transition-colors"
        >
          Назад
        </button>
        
        {/* Кнопка "Перейти к результатам" появляется после завершения анализа */}
        {!isRunning && currentStep === analysisSteps.length - 1 && (
          <button
            onClick={onNext}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Перейти к результатам
          </button>
        )}
      </div>
    </div>
  )
}
