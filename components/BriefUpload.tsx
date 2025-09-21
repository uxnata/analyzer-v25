'use client'

import { useState, useEffect } from 'react'
import { FileText, Upload, ArrowRight } from 'lucide-react'
import mammoth from 'mammoth'

interface BriefUploadProps {
  onComplete: (brief: string) => void
  initialValue?: string
}

export function BriefUpload({ onComplete, initialValue = '' }: BriefUploadProps) {
  const [brief, setBrief] = useState(initialValue)
  const [isUploading, setIsUploading] = useState(false)

  // Обновляем состояние при изменении initialValue
  useEffect(() => {
    setBrief(initialValue)
  }, [initialValue])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
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
      
      setBrief(text)
    } catch (error) {
      console.error('Error reading file:', error)
      alert('Ошибка при чтении файла. Убедитесь, что файл не поврежден.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = () => {
    if (brief.trim()) {
      onComplete(brief.trim())
    }
  }


  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <FileText className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-foreground">Загрузка брифа исследования</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Загрузите бриф исследования или введите его вручную. Поддерживаются форматы: .txt, .md, .docx
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* File Upload */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Загрузка файла</h3>
          <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Перетащите файл сюда или нажмите для выбора
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Поддерживаемые форматы: .txt, .md, .docx
            </p>
            <input
              type="file"
              accept=".txt,.md,.docx"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              name="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 cursor-pointer transition-colors"
            >
              Выбрать файл
            </label>
            {isUploading && (
              <p className="text-sm text-muted-foreground mt-2">Обработка файла...</p>
            )}
          </div>
        </div>

        {/* Manual Input */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Ручной ввод</h3>
          <textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder="Введите бриф исследования здесь..."
            className="w-full h-64 p-4 border border-muted rounded-lg resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            id="brief-input"
            name="brief-input"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!brief.trim()}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Продолжить
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-3">💡 Советы по составлению брифа</h3>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Четко сформулируйте цели исследования</li>
          <li>• Укажите конкретные вопросы, на которые нужно найти ответы</li>
          <li>• Опишите целевую аудиторию и контекст использования</li>
          <li>• Определите ключевые метрики для оценки успеха</li>
          <li>• Добавьте информацию о конкурентах и рынке</li>
          <li>• Поддерживаются Word документы (.docx) - текст будет автоматически извлечен</li>
        </ul>
      </div>
    </div>
  )
}
