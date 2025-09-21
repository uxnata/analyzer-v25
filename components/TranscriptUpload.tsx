'use client'

import { useState, useEffect } from 'react'
import { Upload, FileText, ArrowRight, ArrowLeft, Plus, X } from 'lucide-react'
import mammoth from 'mammoth'

interface TranscriptUploadProps {
  onComplete: (transcripts: string[]) => void
  onBack: () => void
  initialValue?: string[]
}

export function TranscriptUpload({ onComplete, onBack, initialValue = [] }: TranscriptUploadProps) {
  const [transcripts, setTranscripts] = useState<string[]>(initialValue)
  const [currentTranscript, setCurrentTranscript] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  // Обновляем состояние при изменении initialValue
  useEffect(() => {
    setTranscripts(initialValue)
  }, [initialValue])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    setIsUploading(true)
    try {
      const newTranscripts = await Promise.all(
        files.map(async (file) => {
          try {
            let text = ''
            
            if (file.name.endsWith('.docx')) {
              // Обработка .docx файлов
              const arrayBuffer = await file.arrayBuffer()
              const result = await mammoth.extractRawText({ arrayBuffer })
              text = result.value
            } else {
              // Обработка текстовых файлов
              text = await file.text()
            }
            
            return text
          } catch (error) {
            console.error(`Error reading file ${file.name}:`, error)
            return null
          }
        })
      )

      const validTranscripts = newTranscripts.filter(t => t !== null) as string[]
      setTranscripts(prev => [...prev, ...validTranscripts])
    } finally {
      setIsUploading(false)
    }
  }

  const addTranscript = () => {
    if (currentTranscript.trim()) {
      setTranscripts(prev => [...prev, currentTranscript.trim()])
      setCurrentTranscript('')
    }
  }

  const removeTranscript = (index: number) => {
    setTranscripts(prev => prev.filter((_, i) => i !== index))
  }


  const handleSubmit = () => {
    if (transcripts.length > 0) {
      onComplete(transcripts)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Upload className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-foreground">Загрузка транскриптов</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Загрузите транскрипты интервью или введите их вручную. Поддерживаются форматы: .txt, .md, .docx
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* File Upload */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Загрузка файлов</h3>
          <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Выберите один или несколько файлов с транскриптами
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Поддерживаемые форматы: .txt, .md, .docx
            </p>
            <input
              type="file"
              accept=".txt,.md,.docx"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              name="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 cursor-pointer transition-colors"
            >
              Выбрать файлы
            </label>
            {isUploading && (
              <p className="text-sm text-muted-foreground mt-2">Обработка файлов...</p>
            )}
          </div>
          
        </div>

        {/* Manual Input */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Ручной ввод</h3>
          <textarea
            value={currentTranscript}
            onChange={(e) => setCurrentTranscript(e.target.value)}
            placeholder="Введите текст транскрипта здесь..."
            className="w-full h-48 p-4 border border-muted rounded-lg resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            id="transcript-input"
            name="transcript-input"
          />
          <button
            onClick={addTranscript}
            disabled={!currentTranscript.trim()}
            className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Добавить транскрипт
          </button>
        </div>
      </div>

      {/* Transcripts List */}
      {transcripts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">
            Загруженные транскрипты ({transcripts.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transcripts.map((transcript, index) => (
              <div key={index} className="border border-muted rounded-lg p-4 relative">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    Транскрипт #{index + 1}
                  </span>
                  <button
                    onClick={() => removeTranscript(index)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {transcript.substring(0, 200)}...
                </p>
                <div className="mt-2 text-xs text-muted-foreground">
                  {transcript.length} символов
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-8">
        <button
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-muted text-muted-foreground rounded-lg hover:bg-muted/50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </button>
        <button
          onClick={handleSubmit}
          disabled={transcripts.length === 0}
          className="inline-flex items-center px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Продолжить
          <ArrowRight className="h-4 w-4 ml-2" />
        </button>
      </div>

      {/* Tips */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-3">💡 Советы по транскриптам</h3>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Убедитесь, что транскрипты содержат полный текст интервью</li>
          <li>• Рекомендуется минимум 3-5 интервью для качественного анализа</li>
          <li>• Транскрипты должны быть на том же языке, что и бриф</li>
          <li>• Удалите личную информацию перед загрузкой</li>
          <li>• Каждый файл должен содержать одно интервью</li>
          <li>• Поддерживаются Word документы (.docx) - текст будет автоматически извлечен</li>
        </ul>
      </div>
    </div>
  )
}
