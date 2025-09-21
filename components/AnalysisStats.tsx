'use client'

import { TrendingUp, Users, Lightbulb, AlertTriangle, Target, Clock, FileText } from 'lucide-react'

interface AnalysisStatsProps {
  result: any
}

export function AnalysisStats({ result }: AnalysisStatsProps) {
  if (!result) return null

  const stats = [
    {
      label: 'Транскриптов проанализировано',
      value: result.inputData?.transcriptCount || 0,
      icon: FileText,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      label: 'Проблем выявлено',
      value: result.insights?.painPoints?.length || 0,
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-600'
    },
    {
      label: 'Потребностей найдено',
      value: result.insights?.userNeeds?.length || 0,
      icon: Lightbulb,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      label: 'Возможностей определено',
      value: result.insights?.opportunities?.length || 0,
      icon: Target,
      color: 'bg-green-100 text-green-600'
    },
    {
      label: 'Паттернов поведения',
      value: result.insights?.behavioralPatterns?.length || 0,
      icon: Users,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      label: 'Рекомендаций',
      value: (result.recommendations?.immediate?.length || 0) + 
             (result.recommendations?.shortTerm?.length || 0) + 
             (result.recommendations?.longTerm?.length || 0),
      icon: TrendingUp,
      color: 'bg-indigo-100 text-indigo-600'
    }
  ]

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-xl font-semibold text-foreground mb-4">Статистика анализа</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="text-center">
              <div className={`flex justify-center mb-2`}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
