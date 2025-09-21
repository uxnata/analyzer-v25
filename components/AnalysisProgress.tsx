'use client'

import { CheckCircle, Loader2, Clock } from 'lucide-react'

interface AnalysisProgressProps {
  currentStep: number
  totalSteps: number
  isRunning: boolean
}

export function AnalysisProgress({ currentStep, totalSteps, isRunning }: AnalysisProgressProps) {
  const steps = [
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

  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-foreground">Прогресс анализа</h3>
        <div className="flex items-center space-x-2">
          {isRunning ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
          <span className="text-sm text-muted-foreground">
            {isRunning ? 'Выполняется...' : 'Завершено'}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Шаг {currentStep} из {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div 
            className="bg-primary h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const status = index < currentStep ? 'completed' : index === currentStep ? 'current' : 'pending'
          
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
                  <Clock className="h-4 w-4" />
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

      {/* Time Estimate */}
      {isRunning && (
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              Примерное время до завершения: {Math.max(1, totalSteps - currentStep)} мин
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
