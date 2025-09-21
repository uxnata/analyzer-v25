'use client'

import { useState } from 'react'
import { 
  BarChart3, 
  Users, 
  Lightbulb, 
  Target, 
  TrendingUp, 
  FileText,
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  DollarSign,
  BookOpen
} from 'lucide-react'
import { AnalysisStats } from './AnalysisStats'

interface ResultsViewerProps {
  result: any
  onBack: () => void
  onGenerateReport: () => void
}

export function ResultsViewer({ result, onBack, onGenerateReport }: ResultsViewerProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    overview: true,
    insights: false,
    personas: false,
    recommendations: false,
    metrics: false,
    details: false
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const tabs = [
    { id: 'overview', label: 'Обзор', icon: Eye },
    { id: 'insights', label: 'Инсайты', icon: Lightbulb },
    { id: 'personas', label: 'Персонажи', icon: Users },
    { id: 'recommendations', label: 'Рекомендации', icon: Target },
    { id: 'brief', label: 'Бриф', icon: BookOpen },
    { id: 'details', label: 'Детали', icon: FileText },
    { id: 'segments', label: 'Сегменты', icon: BarChart3 },
  ]

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-purple-200 rounded-lg p-6 text-center bg-purple-50/30">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {result.overview.totalInterviews || 0}
          </div>
          <p className="text-muted-foreground">Интервью проанализировано</p>
        </div>
        
        <div className="bg-card border border-red-200 rounded-lg p-6 text-center bg-red-50/30">
          <div className="text-3xl font-bold text-red-600 mb-2">
            {result.overview.totalProblems || 0}
          </div>
          <p className="text-muted-foreground">Проблем выявлено</p>
        </div>
        
        <div className="bg-card border border-green-200 rounded-lg p-6 text-center bg-green-50/30">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {result.overview.totalNeeds || 0}
          </div>
          <p className="text-muted-foreground">Потребностей определено</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Резюме анализа</h3>
        <p className="text-muted-foreground leading-relaxed">{result.overview.summary}</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Ключевые находки</h3>
        <ul className="space-y-2">
          {result.overview.keyFindings.map((finding: string, index: number) => (
            <li key={index} className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-muted-foreground">{finding}</span>
            </li>
          ))}
        </ul>
      </div>

      {result.overview.goalAchievement && result.overview.goalAchievement.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-4">Достижение целей</h3>
          <div className="space-y-4">
            {result.overview.goalAchievement.map((goal: any, index: number) => (
              <div key={index} className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium text-foreground">{goal.goal}</h4>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${goal.achievementPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground">{goal.achievementPercentage}%</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Уровень: {goal.achievementLevel === 'fully_achieved' ? 'Полностью достигнуто' :
                           goal.achievementLevel === 'mostly_achieved' ? 'В основном достигнуто' :
                           goal.achievementLevel === 'partially_achieved' ? 'Частично достигнуто' : 'Не достигнуто'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Методология анализа</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-foreground mb-2">Как проводился анализ:</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span>Анализ {result.overview.totalInterviews || 0} интервью с помощью AI-модели Claude 3.5 Sonnet</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span>Извлечение и дедупликация {result.overview.totalProblems || 0} болевых точек</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span>Выявление {result.overview.totalNeeds || 0} потребностей пользователей</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span>Кросс-анализ паттернов между интервью</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span>Создание персон на основе поведенческих данных</span>
              </li>
            </ul>
          </div>
          
          <div className="border-t border-border pt-4">
            <h4 className="font-medium text-foreground mb-2">Как интерпретировать метрики:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-foreground mb-2">Частота (1 из 2, 50%):</h5>
                <p className="text-sm text-muted-foreground mb-2">
                  Показывает, <strong>насколько распространена</strong> проблема среди респондентов.
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>1 из 2 (50%)</strong> = проблема встречается у половины пользователей
                </p>
              </div>
              <div>
                <h5 className="font-medium text-foreground mb-2">Серьезность (1-10 баллов):</h5>
                <p className="text-sm text-muted-foreground mb-2">
                  Показывает, <strong>насколько критична</strong> проблема для тех, кто с ней столкнулся.
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-red-100 rounded-full"></span>
                    <span className="text-muted-foreground">7-10: Критично (блокирует работу)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-orange-100 rounded-full"></span>
                    <span className="text-muted-foreground">4-6: Высоко (значительно мешает)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-yellow-100 rounded-full"></span>
                    <span className="text-muted-foreground">1-3: Низко (легкие неудобства)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Важно:</strong> Проблема может быть критичной (8/10) даже если встречается только у 1 человека из 2, 
                если она серьезно влияет на его работу. Частота и серьезность - независимые метрики.
              </p>
            </div>
          </div>
          
          <div className="border-t border-border pt-4">
            <h4 className="font-medium text-foreground mb-2">Источники данных:</h4>
            <p className="text-muted-foreground">
              Все выводы основаны исключительно на данных из {result.overview.totalInterviews || 0} интервью. 
              Каждая болевая точка и потребность подкреплена конкретными цитатами респондентов.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderInsights = () => (
    <div className="space-y-6">
      {/* Болевые точки */}
      <div className="bg-card border border-border rounded-lg p-6 min-h-[400px]">
        <h3 className="text-xl font-semibold text-foreground mb-4">Болевые точки</h3>
        {result.insights.painPoints && result.insights.painPoints.length > 0 ? (
          <div className="space-y-4">
            {result.insights.painPoints.map((pain: any, index: number) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium text-foreground text-lg">{pain.pain || 'Проблема не определена'}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      typeof pain.severity === 'number' && pain.severity >= 7 ? 'bg-red-100 text-red-700' :
                      typeof pain.severity === 'number' && pain.severity >= 4 ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {typeof pain.severity === 'number' 
                        ? pain.severity >= 7 ? `Критично (${pain.severity}/10)` :
                          pain.severity >= 4 ? `Высоко (${pain.severity}/10)` :
                          `Низко (${pain.severity}/10)`
                        : pain.severity === 'critical' ? 'Критично' : 
                          pain.severity === 'high' ? 'Высоко' : 'Средне'}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {typeof pain.frequency === 'number' 
                        ? `${pain.frequency} из ${result.overview.totalInterviews || 0} (${Math.round((pain.frequency / (result.overview.totalInterviews || 1)) * 100)}%)`
                        : `1 из ${result.overview.totalInterviews || 0} (${Math.round((1 / (result.overview.totalInterviews || 1)) * 100)}%)`}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Затронутые сегменты:</p>
                    <div className="flex flex-wrap gap-1">
                      {pain.user_segments && pain.user_segments.length > 0 ? (
                        pain.user_segments.map((segment: string, segIndex: number) => (
                          <span key={segIndex} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                            {segment}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">Не определены</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Количество интервью:</p>
                    <p className="text-sm text-muted-foreground">
                      {typeof pain.frequency === 'number' 
                        ? `${pain.frequency} из ${result.overview.totalInterviews || 0} (${Math.round((pain.frequency / (result.overview.totalInterviews || 1)) * 100)}%)`
                        : `1 из ${result.overview.totalInterviews || 0} (${Math.round((1 / (result.overview.totalInterviews || 1)) * 100)}%)`}
                    </p>
                  </div>
                </div>
                
                {pain.business_impact && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-foreground mb-1">Влияние на бизнес:</p>
                    <p className="text-sm text-muted-foreground">{pain.business_impact}</p>
                  </div>
                )}
                
                {pain.root_cause && (
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="text-sm font-medium text-foreground mb-1">Корневая причина:</p>
                    <p className="text-sm text-muted-foreground">{pain.root_cause}</p>
                  </div>
                )}
                
                {pain.source && (
                  <p className="text-xs text-muted-foreground mt-2">Источник: {pain.source}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Болевые точки не выявлены</p>
          </div>
        )}
      </div>

      {/* Потребности пользователей */}
      <div className="bg-card border border-border rounded-lg p-6 min-h-[400px]">
        <h3 className="text-xl font-semibold text-foreground mb-4">Потребности пользователей</h3>
        {result.insights.userNeeds && result.insights.userNeeds.length > 0 ? (
          <div className="space-y-4">
            {result.insights.userNeeds.map((need: any, index: number) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium text-foreground">{need.need || 'Потребность не определена'}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    need.priority === 3 ? 'bg-red-100 text-red-700' :
                    need.priority === 2 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    Приоритет: {need.priority === 3 ? 'Высокий' : need.priority === 2 ? 'Средний' : 'Низкий'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Сегменты:</p>
                    <div className="flex flex-wrap gap-1">
                      {need.user_segments && need.user_segments.length > 0 ? (
                        need.user_segments.map((segment: string, segIndex: number) => (
                          <span key={segIndex} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                            {segment}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">Не определены</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Количество интервью:</p>
                    <p className="text-sm text-muted-foreground">
                      {typeof need.frequency === 'number' 
                        ? `${need.frequency} из ${result.overview.totalInterviews || 0} интервью (${Math.round((need.frequency / (result.overview.totalInterviews || 1)) * 100)}%)`
                        : `1 из ${result.overview.totalInterviews || 0} интервью (${Math.round((1 / (result.overview.totalInterviews || 1)) * 100)}%)`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Потребности пользователей не выявлены</p>
          </div>
        )}
      </div>

      {/* Возможности */}
      <div className="bg-card border border-border rounded-lg p-6 min-h-[400px]">
        <h3 className="text-xl font-semibold text-foreground mb-4">Возможности для улучшения</h3>
        {result.insights.opportunities && result.insights.opportunities.length > 0 ? (
          <ul className="space-y-2">
            {result.insights.opportunities.map((opportunity: string, index: number) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-muted-foreground">{opportunity}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Возможности для улучшения не выявлены</p>
          </div>
        )}
      </div>

      {/* Поведенческие паттерны */}
      <div className="bg-card border border-border rounded-lg p-6 min-h-[400px]">
        <h3 className="text-xl font-semibold text-foreground mb-4">Поведенческие паттерны</h3>
        {result.insights.behavioralPatterns && result.insights.behavioralPatterns.length > 0 ? (
          <div className="space-y-3">
            {result.insights.behavioralPatterns.map((pattern: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-muted-foreground">{pattern.pattern || 'Паттерн не определен'}</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {typeof pattern.frequency === 'number' 
                    ? `${pattern.frequency} из ${result.overview.totalInterviews || 0} (${Math.round((pattern.frequency / (result.overview.totalInterviews || 1)) * 100)}%)`
                    : pattern.frequency || 'Не указано'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Поведенческие паттерны не выявлены</p>
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-lg p-6 min-h-[400px]">
        <h3 className="text-xl font-semibold text-foreground mb-4">Детальные инсайты</h3>
        {result.insights.detailedInsights && result.insights.detailedInsights.length > 0 ? (
          <div className="space-y-4">
            {result.insights.detailedInsights.map((insight: any, index: number) => (
              <div key={index} className="border-l-4 border-primary pl-4">
                <h4 className="font-medium text-foreground">{insight.title || 'Инсайт не определен'}</h4>
                <p className="text-muted-foreground mt-1">{insight.description || 'Описание отсутствует'}</p>
                {insight.evidence && insight.evidence.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-foreground">Доказательства:</p>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                      {insight.evidence.map((evidence: string, evIndex: number) => (
                        <li key={evIndex}>• {evidence}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Детальные инсайты не выявлены</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderPersonas = () => (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Основной персонаж</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-medium text-foreground">{result.personas.primary.name}</h4>
            <p className="text-muted-foreground mt-1">{result.personas.primary.description}</p>
          </div>
          
          <div>
            <h5 className="font-medium text-foreground mb-2">Цели:</h5>
            <ul className="space-y-1">
              {result.personas.primary.goals.map((goal: string, index: number) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">{goal}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-medium text-foreground mb-2">Разочарования:</h5>
            <ul className="space-y-1">
              {result.personas.primary.frustrations.map((frustration: string, index: number) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">{frustration}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-medium text-foreground mb-2">Мотивации:</h5>
            <ul className="space-y-1">
              {result.personas.primary.motivations.map((motivation: string, index: number) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">{motivation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Вторичный персонаж</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-medium text-foreground">{result.personas.secondary.name}</h4>
            <p className="text-muted-foreground mt-1">{result.personas.secondary.description}</p>
          </div>
          
          <div>
            <h5 className="font-medium text-foreground mb-2">Цели:</h5>
            <ul className="space-y-1">
              {result.personas.secondary.goals.map((goal: string, index: number) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">{goal}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-medium text-foreground mb-2">Разочарования:</h5>
            <ul className="space-y-1">
              {result.personas.secondary.frustrations.map((frustration: string, index: number) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">{frustration}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-medium text-foreground mb-2">Мотивации:</h5>
            <ul className="space-y-1">
              {result.personas.secondary.motivations.map((motivation: string, index: number) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">{motivation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )

    const renderBrief = () => (
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-4">Анализ брифа исследования</h3>
          
          {result.briefQuestions && result.briefQuestions.length > 0 ? (
            <div className="space-y-6">
              {result.briefQuestions.map((item: any, index: number) => (
                <div key={index} className="border border-border rounded-lg p-6">
                  {item.type === 'question' ? (
                    <>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Вопрос</span>
                        <h4 className="text-lg font-medium text-foreground">{item.question}</h4>
                      </div>
                      <p className="text-muted-foreground mb-4 leading-relaxed">{item.answer}</p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Гипотеза</span>
                        <h4 className="text-lg font-medium text-foreground">{item.hypothesis}</h4>
                      </div>
                      <div className="flex items-center space-x-2 mb-4">
                        <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                          item.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          item.status === 'not_confirmed' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {item.status === 'confirmed' ? '✅ Подтвердилась' :
                           item.status === 'not_confirmed' ? '❌ Не подтвердилась' :
                           '⚠️ Частично подтвердилась'}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-4 leading-relaxed">{item.analysis}</p>
                    </>
                  )}

                  <div className="flex items-center space-x-4 mb-4">
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      item.confidence === 'high' ? 'bg-green-100 text-green-700' :
                      item.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      Уверенность: {item.confidence === 'high' ? 'Высокая' :
                                   item.confidence === 'medium' ? 'Средняя' : 'Низкая'}
                    </span>
                  </div>

                  {item.evidence && item.evidence.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-foreground mb-2">Доказательства из интервью:</p>
                      <div className="space-y-2">
                        {item.evidence.map((evidence: string, evIndex: number) => (
                          <div key={evIndex} className="bg-muted/30 p-3 rounded-lg">
                            <p className="text-sm text-muted-foreground italic">"{evidence}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.recommendations && item.recommendations.length > 0 && (
                    <div className="border-t border-border pt-4">
                      <p className="text-sm font-medium text-foreground mb-2">Рекомендации:</p>
                      <ul className="space-y-1">
                        {item.recommendations.map((rec: string, recIndex: number) => (
                          <li key={recIndex} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-muted-foreground">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">В бриф не найдено вопросов или гипотез для анализа</p>
              <p className="text-sm text-muted-foreground mt-2">
                Убедитесь, что в бриф включены разделы "Вопросы" или "Гипотезы"
              </p>
            </div>
          )}
        </div>
      </div>
    )

  const renderRecommendations = () => (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Немедленные действия</h3>
        <ul className="space-y-2">
          {result.recommendations.immediate.map((rec: string, index: number) => (
            <li key={index} className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-muted-foreground">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Краткосрочные улучшения</h3>
        <ul className="space-y-2">
          {result.recommendations.shortTerm.map((rec: string, index: number) => (
            <li key={index} className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-muted-foreground">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Долгосрочные планы</h3>
        <ul className="space-y-2">
          {result.recommendations.longTerm.map((rec: string, index: number) => (
            <li key={index} className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-muted-foreground">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {result.recommendations.detailedRecommendations && result.recommendations.detailedRecommendations.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-4">Детальные рекомендации</h3>
          <div className="space-y-4">
            {result.recommendations.detailedRecommendations.map((rec: any, index: number) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <h4 className="font-medium text-foreground">{rec.title}</h4>
                <p className="text-muted-foreground mt-1">{rec.description}</p>
                <div className="flex space-x-2 mt-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                    rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    Приоритет: {rec.priority === 'high' ? 'Высокий' : rec.priority === 'medium' ? 'Средний' : 'Низкий'}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    rec.effort === 'high' ? 'bg-red-100 text-red-700' :
                    rec.effort === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    Усилия: {rec.effort === 'high' ? 'Высокие' : rec.effort === 'medium' ? 'Средние' : 'Низкие'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )


  const renderDetails = () => (
    <div className="space-y-6">
      {/* Мощные цитаты */}
      {result.powerfulQuotes && result.powerfulQuotes.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-4">Мощные цитаты</h3>
          <div className="space-y-4">
            {result.powerfulQuotes.map((quote: string, index: number) => (
              <div key={index} className="border-l-4 border-primary pl-4 py-3 bg-primary/5 rounded-r-lg">
                <blockquote className="text-muted-foreground italic">
                  "{quote}"
                </blockquote>
                <p className="text-sm text-muted-foreground mt-2">Цитата {index + 1}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Вопросы брифа */}
      {result.briefQuestions && result.briefQuestions.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-4">Ответы на вопросы брифа</h3>
          <div className="space-y-4">
            {result.briefQuestions.map((question: any, index: number) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">{question.question}</h4>
                <p className="text-muted-foreground mb-3">{question.answer}</p>
                
                <div className="flex items-center space-x-4 mb-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    question.confidence === 'high' ? 'bg-green-100 text-green-700' :
                    question.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    Уверенность: {question.confidence === 'high' ? 'Высокая' : 
                                 question.confidence === 'medium' ? 'Средняя' : 'Низкая'}
                  </span>
                </div>
                
                {question.evidence && question.evidence.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-foreground mb-2">Доказательства:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {question.evidence.map((evidence: string, evIndex: number) => (
                        <li key={evIndex}>• {evidence}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {question.recommendations && question.recommendations.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Рекомендации:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {question.recommendations.map((rec: string, recIndex: number) => (
                        <li key={recIndex}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ключевые инсайты */}
      {result.insights.keyInsights && result.insights.keyInsights.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-4">Ключевые инсайты</h3>
          <div className="space-y-4">
            {result.insights.keyInsights.map((insight: any, index: number) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">{insight.problem_title}</h4>
                <p className="text-muted-foreground mb-3">{insight.problem_description}</p>
                
                <div className="flex items-center space-x-4 mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    Частота: {insight.frequency}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    insight.impact_score === 'high' ? 'bg-red-100 text-red-700' :
                    insight.impact_score === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    Влияние: {insight.impact_score === 'high' ? 'Высокое' : 
                             insight.impact_score === 'medium' ? 'Среднее' : 'Низкое'}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground">{insight.relevance_to_brief}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {result.interviewSummaries && result.interviewSummaries.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-4">Сводки интервью</h3>
          <div className="space-y-4">
            {result.interviewSummaries.map((summary: any, index: number) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <h4 className="font-medium text-foreground">Интервью {summary.id}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Длина:</span>
                    <p className="font-medium">{summary.length} символов</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Предложения:</span>
                    <p className="font-medium">{summary.sentenceCount}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Тон:</span>
                    <p className="font-medium">
                      {summary.sentiment > 0.3 ? 'Позитивный' : 
                       summary.sentiment < -0.3 ? 'Негативный' : 'Нейтральный'}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Цитаты:</span>
                    <p className="font-medium">{summary.keyQuotes.length}</p>
                  </div>
                </div>
                <p className="text-muted-foreground mt-3">{summary.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {result.crossQuestionInsights && result.crossQuestionInsights.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-4">Кросс-вопросные инсайты</h3>
          <div className="space-y-4">
            {result.crossQuestionInsights.map((insight: any, index: number) => (
              <div key={index} className="border-l-4 border-primary pl-4">
                <h4 className="font-medium text-foreground">{insight.insight}</h4>
                <p className="text-muted-foreground mt-1">{insight.implication}</p>
                <div className="mt-2">
                  <p className="text-sm font-medium text-foreground">Связанные вопросы:</p>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    {insight.relatedQuestions.map((question: string, qIndex: number) => (
                      <li key={qIndex}>• {question}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {result.unexpectedFindings && result.unexpectedFindings.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-4">Неожиданные находки</h3>
          <div className="space-y-4">
            {result.unexpectedFindings.map((finding: any, index: number) => (
              <div key={index} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <h4 className="font-medium text-orange-800">{finding.finding}</h4>
                <p className="text-orange-700 mt-1">{finding.importance}</p>
                <p className="text-orange-600 mt-2 font-medium">Рекомендация: {finding.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderSegments = () => (
    <div className="space-y-6">
      {result.personas.segments && result.personas.segments.length > 0 ? (
        result.personas.segments.map((segment: any, index: number) => (
          <div key={index} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-foreground">{segment.name}</h3>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {segment.size} пользователей
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-foreground mb-3">Характеристики</h4>
                <ul className="space-y-2">
                  {segment.characteristics.map((char: string, charIndex: number) => (
                    <li key={charIndex} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">{char}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-3">Основные проблемы</h4>
                <ul className="space-y-2">
                  {segment.pain_points && segment.pain_points.length > 0 ? (
                    segment.pain_points.map((pain: string, painIndex: number) => (
                      <li key={painIndex} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground text-sm">{pain}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted-foreground text-sm">Проблемы не выявлены</li>
                  )}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-3">Поведение</h4>
                <ul className="space-y-2">
                  {segment.behaviors && segment.behaviors.length > 0 ? (
                    segment.behaviors.map((behavior: string, behaviorIndex: number) => (
                      <li key={behaviorIndex} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground text-sm">{behavior}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted-foreground text-sm">Поведение не определено</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <p className="text-muted-foreground">Сегменты пользователей не определены</p>
        </div>
      )}
    </div>
  )


  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview()
      case 'insights':
        return renderInsights()
      case 'personas':
        return renderPersonas()
      case 'recommendations':
        return renderRecommendations()
      case 'brief':
        return renderBrief()
      case 'details':
        return renderDetails()
      case 'segments':
        return renderSegments()
      default:
        return renderOverview()
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Результаты анализа</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Детальный анализ ваших данных с выявлением ключевых инсайтов, проблем и рекомендаций
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-card border border-border rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 border-b border-border">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center space-y-2 px-4 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[600px]">
        {renderContent()}
      </div>

      {/* Actions */}
      <div className="flex justify-center space-x-4 pt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-muted text-muted-foreground rounded-lg hover:bg-muted/50 transition-colors"
        >
          Назад к анализу
        </button>
        <button
          onClick={onGenerateReport}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Сгенерировать отчет
        </button>
      </div>
    </div>
  )
}
