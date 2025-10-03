'use client'

import { useState } from 'react'
import { 
  FileText, 
  Download, 
  CheckCircle, 
  Loader2, 
  ArrowLeft,
  FileText as FileTextIcon
} from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'
import { saveAs } from 'file-saver'

interface ReportGeneratorProps {
  result: any
  onBack: () => void
}

export function ReportGenerator({ result, onBack }: ReportGeneratorProps) {
  const [selectedFormats, setSelectedFormats] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedReports, setGeneratedReports] = useState<{ [key: string]: string }>({})
  const [error, setError] = useState<string | null>(null)
  
  

  const reportFormats = [
    { id: 'html', label: 'HTML', icon: FileTextIcon, description: 'Веб-страница с красивым оформлением' },
    { id: 'docx', label: 'DOCX', icon: FileText, description: 'Word документ для редактирования' }
  ]

  const toggleFormat = (format: string) => {
    setSelectedFormats(prev => 
      prev.includes(format) 
        ? prev.filter(f => f !== format)
        : [...prev, format]
    )
  }

  const generateReports = async () => {
    if (selectedFormats.length === 0) {
      setError('Выберите хотя бы один формат отчета')
      return
    }

    setIsGenerating(true)
    setError(null)
    const newReports: { [key: string]: string } = {}

    try {
      for (const format of selectedFormats) {
        const report = await generateReport(format, result)
        newReports[format] = report
      }
      
      setGeneratedReports(newReports)
    } catch (err) {
      setError('Ошибка при генерации отчетов')
      console.error('Report generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateReport = async (format: string, data: any): Promise<string> => {
    // Имитируем задержку генерации
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    switch (format) {
      case 'html':
        return generateHTMLReport(data)
      case 'docx':
        return await generateDOCXReport(data)
      default:
        throw new Error(`Неизвестный формат: ${format}`)
    }
  }

  const generateHTMLReport = (data: any): string => {
    
    const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UX Анализ - Детальный отчет</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
            margin: 0; 
            padding: 0; 
            background: #ffffff;
            color: #030213;
            line-height: 1.6;
        }
        
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 16px; 
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            overflow: hidden;
            margin: 40px auto;
        }
        
        .header { 
            background: #030213; 
            color: white; 
            padding: 60px 40px; 
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
        }
        
        .header h1 { 
            margin: 0; 
            font-size: 3.5em; 
            font-weight: 800; 
            letter-spacing: -0.02em;
            position: relative;
            z-index: 1;
        }
        
        .header p { 
            margin: 20px 0 0 0; 
            opacity: 0.95; 
            font-size: 1.3em;
            font-weight: 400;
            position: relative;
            z-index: 1;
        }
        
        .content { 
            padding: 60px 40px; 
        }
        
        .section { 
            margin-bottom: 50px; 
        }
        
        .section h2 { 
            font-size: 2.2em; 
            font-weight: 700; 
            color: #030213; 
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 3px solid #030213;
            position: relative;
        }
        
        .section h2::after {
            content: '';
            position: absolute;
            bottom: -3px;
            left: 0;
            width: 60px;
            height: 3px;
            background: #030213;
            border-radius: 2px;
        }
        
        .section h3 { 
            font-size: 1.6em; 
            font-weight: 600; 
            color: #030213; 
            margin: 30px 0 20px 0;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 24px;
            margin: 30px 0;
        }
        
        .stat-card {
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
            border: 2px solid #e5e7eb;
            border-radius: 16px;
            padding: 24px;
            text-align: center;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .stat-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px -5px rgba(139, 92, 246, 0.1);
            border-color: #030213;
        }
        
        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: #030213;
        }
        
        .stat-number {
            font-size: 3em;
            font-weight: 800;
            color: #030213;
            margin-bottom: 8px;
        }
        
        .stat-label {
            font-size: 1.1em;
            color: #6b7280;
            font-weight: 500;
        }
        
        .pain-points {
            display: grid;
            gap: 24px;
        }
        
        .pain-point-card {
            background: linear-gradient(135deg, #fef3f2 0%, #fef2f2 100%);
            border: 2px solid #fecaca;
            border-radius: 16px;
            padding: 24px;
            position: relative;
            overflow: hidden;
        }
        
        .pain-point-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 6px;
            height: 100%;
            background: linear-gradient(180deg, #ef4444, #dc2626);
        }
        
        .pain-point-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
        }
        
        .pain-point-title {
            font-size: 1.4em;
            font-weight: 600;
            color: #dc2626;
            margin: 0;
        }
        
        .severity-badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .severity-critical {
            background: #fef2f2;
            color: #dc2626;
            border: 1px solid #fecaca;
        }
        
        .severity-high {
            background: #fef3f2;
            color: #ea580c;
            border: 1px solid #fed7aa;
        }
        
        .severity-medium {
            background: #fefce8;
            color: #ca8a04;
            border: 1px solid #fef08a;
        }
        
        .pain-point-content {
            margin-bottom: 20px;
            color: #030213;
            line-height: 1.7;
        }
        
        .pain-point-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .detail-item {
            background: white;
            padding: 16px;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
        }
        
        .detail-label {
            font-weight: 600;
            color: #6b7280;
            margin-bottom: 8px;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .detail-value {
            color: #030213;
            font-weight: 500;
        }
        
        .root-cause {
            background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
            border: 2px solid #bbf7d0;
            border-radius: 12px;
            padding: 20px;
            margin-top: 20px;
        }
        
        .root-cause-label {
            font-weight: 600;
            color: #059669;
            margin-bottom: 8px;
        }
        
        .root-cause-text {
            color: #065f46;
            line-height: 1.6;
        }
        
        .user-needs {
            display: grid;
            gap: 20px;
        }
        
        .need-card {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border: 2px solid #bae6fd;
            border-radius: 16px;
            padding: 24px;
            position: relative;
            overflow: hidden;
        }
        
        .need-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 6px;
            height: 100%;
            background: linear-gradient(180deg, #0ea5e9, #0284c7);
        }
        
        .need-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 16px;
        }
        
        .need-title {
            font-size: 1.3em;
            font-weight: 600;
            color: #0c4a6e;
            margin: 0;
        }
        
        .priority-badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: 600;
        }
        
        .priority-high {
            background: #fef3f2;
            color: #dc2626;
            border: 1px solid #fecaca;
        }
        
        .priority-medium {
            background: #fefce8;
            color: #ca8a04;
            border: 1px solid #fef08a;
        }
        
        .priority-low {
            background: #f0fdf4;
            color: #059669;
            border: 1px solid #bbf7d0;
        }
        
        .recommendations {
            background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
            border: 2px solid #e9d5ff;
            border-radius: 16px;
            padding: 30px;
            margin: 30px 0;
        }
        
        .recommendations h3 {
            color: #7c3aed;
            margin-bottom: 20px;
        }
        
        .recommendation-list {
            list-style: none;
            padding: 0;
        }
        
        .recommendation-item {
            background: white;
            margin-bottom: 16px;
            padding: 20px;
            border-radius: 12px;
            border-left: 4px solid #030213;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .recommendation-text {
            color: #030213;
            font-weight: 500;
            margin-bottom: 8px;
        }
        
        .recommendation-priority {
            display: inline-block;
            padding: 4px 8px;
            background: #030213;
            color: white;
            border-radius: 6px;
            font-size: 0.8em;
            font-weight: 600;
        }
        
        .metrics-section {
            background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
            border: 2px solid #bbf7d0;
            border-radius: 16px;
            padding: 30px;
            margin: 30px 0;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .metric-card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            border: 1px solid #d1fae5;
        }
        
        .metric-value {
            font-size: 2.5em;
            font-weight: 800;
            color: #717182;
            margin-bottom: 8px;
        }
        
        .metric-label {
            color: #065f46;
            font-weight: 500;
        }
        
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e5e7eb;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 12px;
        }
        
        .progress-fill {
            height: 100%;
            background: #030213;
            border-radius: 4px;
            transition: width 0.3s ease;
        }
        
        .footer {
            background: #030213;
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .footer h3 {
            color: #030213;
            margin-bottom: 20px;
        }
        
        .footer p {
            opacity: 0.8;
            margin-bottom: 16px;
        }
        
        .footer-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        
        .footer-stat {
            text-align: center;
        }
        
        .footer-stat-number {
            font-size: 2em;
            font-weight: 700;
            color: #717182;
            margin-bottom: 8px;
        }
        
        .footer-stat-label {
            opacity: 0.8;
            font-size: 0.9em;
        }
        
        .behavioral-patterns {
            display: grid;
            gap: 20px;
        }
        
        .pattern-card {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border: 2px solid #bae6fd;
            border-radius: 16px;
            padding: 24px;
            position: relative;
            overflow: hidden;
        }
        
        .pattern-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 6px;
            height: 100%;
            background: linear-gradient(180deg, #0ea5e9, #0284c7);
        }
        
        .pattern-title {
            font-size: 1.3em;
            font-weight: 600;
            color: #0c4a6e;
            margin: 0 0 12px 0;
        }
        
        .pattern-description {
            color: #030213;
            line-height: 1.6;
            margin-bottom: 16px;
        }
        
        .pattern-details {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .frequency-badge {
            padding: 4px 8px;
            background: #0ea5e9;
            color: white;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: 600;
        }
        
        .opportunities {
            display: grid;
            gap: 16px;
        }
        
        .opportunity-item {
            display: flex;
            align-items: flex-start;
            gap: 16px;
            padding: 20px;
            background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
            border: 2px solid #bbf7d0;
            border-radius: 12px;
        }
        
        .opportunity-number {
            flex-shrink: 0;
            width: 32px;
            height: 32px;
            background: #059669;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 0.9em;
        }
        
        .opportunity-text {
            color: #030213;
            line-height: 1.6;
            font-weight: 500;
        }
        
        .quotes-section {
            display: grid;
            gap: 20px;
        }
        
        .quote-item {
            background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
            border: 2px solid #e9d5ff;
            border-radius: 16px;
            padding: 24px;
            position: relative;
        }
        
        .quote-item::before {
            content: '"';
            position: absolute;
            top: 16px;
            left: 20px;
            font-size: 3em;
            color: #7c3aed;
            opacity: 0.3;
            font-family: serif;
        }
        
        .quote-text {
            margin: 0;
            padding-left: 40px;
            font-style: italic;
            color: #030213;
            line-height: 1.7;
            font-size: 1.1em;
        }
        
        .roi-calculation {
            background: linear-gradient(135deg, #fef3f2 0%, #fef2f2 100%);
            border: 2px solid #fecaca;
            border-radius: 12px;
            padding: 20px;
            margin-top: 20px;
        }
        
        .roi-calculation h3 {
            color: #dc2626;
            margin-bottom: 12px;
        }
        
        .roi-text {
            color: #030213;
            line-height: 1.6;
            margin: 0;
        }
        
        .key-findings {
            display: grid;
            gap: 16px;
        }
        
        .finding-item {
            display: flex;
            align-items: flex-start;
            gap: 16px;
            padding: 20px;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border: 2px solid #bae6fd;
            border-radius: 12px;
        }
        
        .finding-number {
            flex-shrink: 0;
            width: 32px;
            height: 32px;
            background: #0ea5e9;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 0.9em;
        }
        
        .finding-text {
            color: #030213;
            line-height: 1.6;
            font-weight: 500;
        }
        
        @media (max-width: 768px) {
            .container {
                margin: 20px;
                border-radius: 12px;
            }
            
            .header {
                padding: 40px 20px;
            }
            
            .header h1 {
                font-size: 2.5em;
            }
            
            .content {
                padding: 40px 20px;
            }
            
            .stats-grid {
                grid-template-columns: 1fr;
            }
            
            .pain-point-details {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>UX Анализ</h1>
            <p>Детальный отчет по исследованию пользовательского опыта</p>
        </div>
        
        <div class="content">
            <div class="section">
                <h2>Обзор исследования</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">${data.overview?.totalInterviews || 0}</div>
                        <div class="stat-label">Интервью проанализировано</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${data.overview?.totalProblems || 0}</div>
                        <div class="stat-label">Проблем выявлено</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${data.overview?.totalNeeds || 0}</div>
                        <div class="stat-label">Потребностей определено</div>
                    </div>
                </div>
                
                <p style="font-size: 1.1em; line-height: 1.8; color: #030213;">
                    ${data.overview?.summary || 'Анализ пользовательского опыта на основе проведенных интервью.'}
                </p>
            </div>
            
            ${data.overview?.keyFindings?.length > 0 ? `
            <div class="section">
                <h2>Ключевые находки</h2>
                <div class="key-findings">
                    ${data.overview.keyFindings.map((finding: string, index: number) => `
                        <div class="finding-item">
                            <div class="finding-number">${index + 1}</div>
                            <div class="finding-text">${finding}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            
            ${data.insights?.painPoints && data.insights.painPoints.length > 0 ? `
            <div class="section">
                <h2>Ключевые проблемы пользователей</h2>
                <div class="pain-points">
                    ${data.insights.painPoints.map((pain: any, index: number) => `
                        <div class="pain-point-card">
                            <div class="pain-point-header">
                                <h3 class="pain-point-title">${pain.pain || 'Проблема не определена'}</h3>
                                <span class="severity-badge severity-${typeof pain.severity === 'number' && pain.severity >= 7 ? 'critical' : typeof pain.severity === 'number' && pain.severity >= 4 ? 'high' : 'medium'}">
                                    ${typeof pain.severity === 'number' 
                                        ? `${pain.severity}/10 (${pain.severity >= 7 ? 'Критично' : pain.severity >= 4 ? 'Высоко' : 'Низко'})`
                                        : pain.severity === 'critical' ? 'Критично' : 
                                          pain.severity === 'high' ? 'Высоко' : 'Средне'}
                                </span>
                            </div>
                            
                            <div class="pain-point-details">
                                <div class="detail-item">
                                    <div class="detail-label">Частота</div>
                                    <div class="detail-value">${typeof pain.frequency === 'number' 
                                        ? `${pain.frequency} из ${data.overview?.totalInterviews || 0} (${Math.round((pain.frequency / (data.overview?.totalInterviews || 1)) * 100)}%)`
                                        : pain.frequency || 'Не указано'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Влияние</div>
                                    <div class="detail-value">${pain.impact || 'Не определено'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Сегменты</div>
                                    <div class="detail-value">${pain.user_segments?.join(', ') || 'Все'}</div>
                                </div>
                            </div>
                            
                            ${pain.quotes && pain.quotes.length > 0 ? `
                                <div class="root-cause">
                                    <div class="root-cause-label">Цитаты пользователей</div>
                                    <div class="root-cause-text">
                                        ${pain.quotes.map((quote: string) => `"${quote}"`).join('<br>')}
                                    </div>
                                </div>
                            ` : ''}
                            
                            ${pain.context ? `
                                <div class="root-cause">
                                    <div class="root-cause-label">Контекст</div>
                                    <div class="root-cause-text">${pain.context}</div>
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            ${data.insights?.userNeeds && data.insights.userNeeds.length > 0 ? `
            <div class="section">
                <h2>Потребности пользователей</h2>
                <div class="user-needs">
                    ${data.insights.userNeeds.map((need: any, index: number) => `
                        <div class="need-card">
                            <div class="need-header">
                                <h3 class="need-title">${need.need || 'Потребность не определена'}</h3>
                                <span class="priority-badge priority-${typeof need.priority === 'number' && need.priority === 3 ? 'high' : typeof need.priority === 'number' && need.priority === 2 ? 'medium' : 'low'}">
                                    Приоритет: ${typeof need.priority === 'number' 
                                        ? `${need.priority}/3 (${need.priority === 3 ? 'Высокий' : need.priority === 2 ? 'Средний' : 'Низкий'})`
                                        : need.priority || 'Средний'}
                                </span>
                            </div>
                            
                            <div class="pain-point-details">
                                <div class="detail-item">
                                    <div class="detail-label">Частота</div>
                                    <div class="detail-value">${typeof need.frequency === 'number' 
                                        ? `${need.frequency} из ${data.overview?.totalInterviews || 0} (${Math.round((need.frequency / (data.overview?.totalInterviews || 1)) * 100)}%)`
                                        : need.frequency || 'Не указано'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Влияние</div>
                                    <div class="detail-value">${need.impact || 'Не определено'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Сегменты</div>
                                    <div class="detail-value">${need.user_segments?.join(', ') || 'Все'}</div>
                                </div>
                            </div>
                            
                            ${need.quotes && need.quotes.length > 0 ? `
                                <div class="root-cause">
                                    <div class="root-cause-label">Цитаты пользователей</div>
                                    <div class="root-cause-text">
                                        ${need.quotes.map((quote: string) => `"${quote}"`).join('<br>')}
                                    </div>
                                </div>
                            ` : ''}
                            
                            ${need.context ? `
                                <div class="root-cause">
                                    <div class="root-cause-label">Контекст</div>
                                    <div class="root-cause-text">${need.context}</div>
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            
            ${data.recommendations ? `
            <div class="section">
                <h2>Рекомендации по улучшению</h2>
                <div class="recommendations">
                    ${data.recommendations.detailedRecommendations?.length > 0 ? `
                        <h3>Приоритетные действия</h3>
                        <ul class="recommendation-list">
                            ${data.recommendations.detailedRecommendations.map((rec: any, index: number) => `
                                <li class="recommendation-item">
                                    <div class="recommendation-text">${typeof rec === 'string' ? rec : rec.text || rec.description || rec.title || JSON.stringify(rec)}</div>
                                    <span class="recommendation-priority">Приоритет ${index + 1}</span>
                                </li>
                            `).join('')}
                        </ul>
                    ` : ''}
                    
                    ${data.recommendations.immediate?.length > 0 ? `
                        <h3>Немедленные действия</h3>
                        <ul class="recommendation-list">
                            ${data.recommendations.immediate.map((rec: any, index: number) => `
                                <li class="recommendation-item">
                                    <div class="recommendation-text">${typeof rec === 'string' ? rec : rec.text || rec.description || rec.title || JSON.stringify(rec)}</div>
                                    <span class="recommendation-priority">Немедленно</span>
                                </li>
                            `).join('')}
                        </ul>
                    ` : ''}
                    
                    ${data.recommendations.shortTerm?.length > 0 ? `
                        <h3>Краткосрочные (1-3 месяца)</h3>
                        <ul class="recommendation-list">
                            ${data.recommendations.shortTerm.map((rec: any, index: number) => `
                                <li class="recommendation-item">
                                    <div class="recommendation-text">${typeof rec === 'string' ? rec : rec.text || rec.description || rec.title || JSON.stringify(rec)}</div>
                                    <span class="recommendation-priority">1-3 месяца</span>
                                </li>
                            `).join('')}
                        </ul>
                    ` : ''}
                    
                    ${data.recommendations.longTerm?.length > 0 ? `
                        <h3>Долгосрочные (3+ месяца)</h3>
                        <ul class="recommendation-list">
                            ${data.recommendations.longTerm.map((rec: any, index: number) => `
                                <li class="recommendation-item">
                                    <div class="recommendation-text">${typeof rec === 'string' ? rec : rec.text || rec.description || rec.title || JSON.stringify(rec)}</div>
                                    <span class="recommendation-priority">3+ месяца</span>
                                </li>
                            `).join('')}
                        </ul>
                    ` : ''}
                    
                    ${data.recommendations.roiCalculation ? `
                        <div class="roi-calculation">
                            <h3>Расчет ROI</h3>
                            <p class="roi-text">${data.recommendations.roiCalculation}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
            ` : ''}
            
            ${data.insights?.behavioralPatterns && data.insights.behavioralPatterns.length > 0 ? `
            <div class="section">
                <h2>Поведенческие паттерны</h2>
                <div class="behavioral-patterns">
                    ${data.insights.behavioralPatterns.map((pattern: any, index: number) => `
                        <div class="pattern-card">
                            <h3 class="pattern-title">${pattern.pattern || 'Паттерн не определен'}</h3>
                            <p class="pattern-description">${pattern.description || 'Описание не предоставлено'}</p>
                            <div class="pattern-details">
                                <span class="frequency-badge">Частота: ${typeof pattern.frequency === 'number' 
                                    ? `${pattern.frequency} из ${data.overview?.totalInterviews || 0} (${Math.round((pattern.frequency / (data.overview?.totalInterviews || 1)) * 100)}%)`
                                    : pattern.frequency || 'Не указано'}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            ${data.insights?.opportunities && data.insights.opportunities.length > 0 ? `
            <div class="section">
                <h2>Возможности для улучшения</h2>
                <div class="opportunities">
                    ${data.insights.opportunities.map((opportunity: string, index: number) => `
                        <div class="opportunity-item">
                            <div class="opportunity-number">${index + 1}</div>
                            <div class="opportunity-text">${opportunity}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            ${data.powerfulQuotes && data.powerfulQuotes.length > 0 ? `
            <div class="section">
                <h2>Ключевые цитаты</h2>
                <div class="quotes-section">
                    ${data.powerfulQuotes.map((quote: string, index: number) => `
                        <div class="quote-item">
                            <blockquote class="quote-text">"${quote}"</blockquote>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
        </div>
        
        <div class="footer">
            <h3>Итоги исследования</h3>
            <p>На основе анализа ${data.overview?.totalInterviews || 0} интервью были выявлены ключевые проблемы и возможности для улучшения пользовательского опыта.</p>
            
            <div class="footer-stats">
                <div class="footer-stat">
                    <div class="footer-stat-number">${data.overview?.totalProblems || 0}</div>
                    <div class="footer-stat-label">Проблем</div>
                </div>
                <div class="footer-stat">
                    <div class="footer-stat-number">${data.overview?.totalNeeds || 0}</div>
                    <div class="footer-stat-label">Потребностей</div>
                </div>
                <div class="footer-stat">
                    <div class="footer-stat-number">${data.metrics?.satisfaction || 0}%</div>
                    <div class="footer-stat-label">Удовлетворенность</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`
    
    return html
  }

  const generatePDFReport = async (data: any): Promise<string> => {
    // Создаем PDF с помощью jsPDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    let yPosition = 20

    // Функция для добавления текста с переносом строк и поддержкой кириллицы
    const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
      pdf.setFontSize(fontSize)
      // Используем стандартный шрифт, который поддерживает кириллицу
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal')
      
      // Конвертируем текст в UTF-8 для правильного отображения кириллицы
      const utf8Text = unescape(encodeURIComponent(text))
      const lines = pdf.splitTextToSize(utf8Text, pageWidth - 40)
      lines.forEach((line: string) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage()
          yPosition = 20
        }
        pdf.text(line, 20, yPosition)
        yPosition += fontSize * 0.4
      })
      yPosition += 5
    }

    // Заголовок
    addText('UX Анализ - Детальный отчет', 20, true)
    addText(`Дата генерации: ${new Date().toLocaleString('ru-RU')}`, 10)
    yPosition += 10

    // Обзор
    addText('ОБЗОР АНАЛИЗА', 16, true)
    addText(data.overview?.summary || 'Анализ завершен успешно', 12)
    yPosition += 10

    // Ключевые находки
    if (data.overview?.keyFindings?.length > 0) {
      addText('КЛЮЧЕВЫЕ НАХОДКИ', 16, true)
      data.overview.keyFindings.forEach((finding: string, index: number) => {
        addText(`${index + 1}. ${finding}`, 12)
      })
      yPosition += 10
    }

    // Метрики
    if (data.metrics) {
      addText('МЕТРИКИ', 16, true)
      addText(`Удовлетворенность: ${data.metrics.satisfaction || 0}%`, 12)
      addText(`Удобство использования: ${data.metrics.usability || 0}%`, 12)
      addText(`Вовлеченность: ${data.metrics.engagement || 0}%`, 12)
      addText(`Конверсия: ${data.metrics.conversion || 0}%`, 12)
      addText(`NPS: ${data.metrics.nps || 0}`, 12)
      addText(`Удержание: ${data.metrics.retention || 0}%`, 12)
      yPosition += 10
    }

    // Проблемы пользователей
    if (data.insights?.painPoints?.length > 0) {
      addText('КЛЮЧЕВЫЕ ПРОБЛЕМЫ', 16, true)
      data.insights.painPoints.forEach((pain: any, index: number) => {
        addText(`${index + 1}. ${pain.pain || 'Проблема не определена'}`, 12, true)
        addText(`   Приоритет: ${pain.severity || 'medium'}`, 10)
        addText(`   Влияние: ${pain.impact || 'Не определено'}`, 10)
        yPosition += 5
      })
      yPosition += 10
    }

    // Потребности пользователей
    if (data.insights?.userNeeds?.length > 0) {
      addText('ПОТРЕБНОСТИ ПОЛЬЗОВАТЕЛЕЙ', 16, true)
      data.insights.userNeeds.forEach((need: any, index: number) => {
        addText(`${index + 1}. ${need.need || 'Потребность не определена'}`, 12, true)
        addText(`   Приоритет: ${need.priority || 'medium'}`, 10)
        addText(`   Влияние: ${need.impact || 'Не определено'}`, 10)
        yPosition += 5
      })
      yPosition += 10
    }

    // Рекомендации
    if (data.recommendations) {
      addText('РЕКОМЕНДАЦИИ', 16, true)
      
      if (data.recommendations.immediate?.length > 0) {
        addText('Немедленные действия:', 14, true)
        data.recommendations.immediate.forEach((rec: string, index: number) => {
          addText(`${index + 1}. ${rec}`, 12)
        })
      }
      
      if (data.recommendations.shortTerm?.length > 0) {
        addText('Краткосрочные (1-3 месяца):', 14, true)
        data.recommendations.shortTerm.forEach((rec: string, index: number) => {
          addText(`${index + 1}. ${rec}`, 12)
        })
      }
      
      if (data.recommendations.longTerm?.length > 0) {
        addText('Долгосрочные (3+ месяца):', 14, true)
        data.recommendations.longTerm.forEach((rec: string, index: number) => {
          addText(`${index + 1}. ${rec}`, 12)
        })
      }
    }

    // Возвращаем PDF как base64 строку
    return pdf.output('datauristring')
  }

  const generateDOCXReport = async (data: any): Promise<string> => {
    
    // Создаем массив параграфов для документа
    const paragraphs: any[] = []
    
    // Заголовок
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "UX Анализ - Детальный отчет",
            bold: true,
            size: 32
          })
        ],
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER
      }),
      
      new Paragraph({
        children: [
          new TextRun({
            text: `Дата генерации: ${new Date().toLocaleString('ru-RU')}`,
            size: 20
          })
        ],
        alignment: AlignmentType.CENTER
      }),
      
      new Paragraph({ children: [new TextRun({ text: "" })] })
    )
    
    // Обзор анализа
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "ОБЗОР ИССЛЕДОВАНИЯ",
            bold: true,
            size: 24
          })
        ],
        heading: HeadingLevel.HEADING_1
      }),
      
      new Paragraph({
        children: [
          new TextRun({
            text: `Проанализировано интервью: ${data.overview?.totalInterviews || 0}`,
            size: 22
          })
        ]
      }),
      
      new Paragraph({
        children: [
          new TextRun({
            text: `Выявлено проблем: ${data.overview?.totalProblems || 0}`,
            size: 22
          })
        ]
      }),
      
      new Paragraph({
        children: [
          new TextRun({
            text: `Определено потребностей: ${data.overview?.totalNeeds || 0}`,
            size: 22
          })
        ]
      }),
      
      new Paragraph({
        children: [
          new TextRun({
            text: data.overview?.summary || 'Анализ завершен успешно',
            size: 22
          })
        ]
      }),
      
      new Paragraph({ children: [new TextRun({ text: "" })] })
    )
    
    // Ключевые находки
    if (data.overview?.keyFindings?.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "КЛЮЧЕВЫЕ НАХОДКИ",
              bold: true,
              size: 24
            })
          ],
          heading: HeadingLevel.HEADING_1
        })
      )
      
      data.overview.keyFindings.forEach((finding: string, index: number) => {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${index + 1}. ${finding}`,
                size: 22
              })
            ]
          })
        )
      })
      
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }))
    }
    
    // Метрики
    
    // Болевые точки с подробностями
    if (data.insights?.painPoints?.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "КЛЮЧЕВЫЕ ПРОБЛЕМЫ ПОЛЬЗОВАТЕЛЕЙ",
              bold: true,
              size: 24
            })
          ],
          heading: HeadingLevel.HEADING_1
        })
      )
      
      data.insights.painPoints.forEach((pain: any, index: number) => {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${index + 1}. ${pain.pain || 'Проблема не определена'}`,
                bold: true,
                size: 22
              })
            ]
          })
        )
        
        // Детали проблемы
        if (pain.impact) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `   Влияние: ${pain.impact}`,
                  size: 20
                })
              ]
            })
          )
        }
        
        if (pain.severity) {
          const severityText = typeof pain.severity === 'number' 
            ? `${pain.severity}/10 (${pain.severity >= 7 ? 'Критично' : pain.severity >= 4 ? 'Высоко' : 'Низко'})`
            : pain.severity
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `   Серьезность: ${severityText}`,
                  size: 20
                })
              ]
            })
          )
        }
        
        if (pain.frequency) {
          const frequencyText = typeof pain.frequency === 'number' 
            ? `${pain.frequency} из ${data.overview?.totalInterviews || 0} интервью (${Math.round((pain.frequency / (data.overview?.totalInterviews || 1)) * 100)}%)`
            : pain.frequency
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `   Частота: ${frequencyText}`,
                  size: 20
                })
              ]
            })
          )
        }
        
        if (pain.user_segments?.length > 0) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `   Затронутые сегменты: ${pain.user_segments.join(', ')}`,
                  size: 20
                })
              ]
            })
          )
        }
        
        if (pain.quotes?.length > 0) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "   Цитаты пользователей:",
                  bold: true,
                  size: 20
                })
              ]
            })
          )
          pain.quotes.forEach((quote: string) => {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `   "${quote}"`,
                    italics: true,
                    size: 20
                  })
                ]
              })
            )
          })
        }
        
        paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }))
      })
    }
    
    // Потребности пользователей
    if (data.insights?.userNeeds?.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "ПОТРЕБНОСТИ ПОЛЬЗОВАТЕЛЕЙ",
              bold: true,
              size: 24
            })
          ],
          heading: HeadingLevel.HEADING_1
        })
      )
      
      data.insights.userNeeds.forEach((need: any, index: number) => {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${index + 1}. ${need.need || 'Потребность не определена'}`,
                bold: true,
                size: 22
              })
            ]
          })
        )
        
        if (need.priority) {
          const priorityText = typeof need.priority === 'number'
            ? `${need.priority}/3 (${need.priority === 3 ? 'Высокий' : need.priority === 2 ? 'Средний' : 'Низкий'})`
            : need.priority
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `   Приоритет: ${priorityText}`,
                  size: 20
                })
              ]
            })
          )
        }
        
        if (need.impact) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `   Влияние: ${need.impact}`,
                  size: 20
                })
              ]
            })
          )
        }
        
        if (need.frequency) {
          const frequencyText = typeof need.frequency === 'number' 
            ? `${need.frequency} из ${data.overview?.totalInterviews || 0} интервью (${Math.round((need.frequency / (data.overview?.totalInterviews || 1)) * 100)}%)`
            : need.frequency
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `   Частота: ${frequencyText}`,
                  size: 20
                })
              ]
            })
          )
        }
        
        paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }))
      })
    }
    
    // Рекомендации
    if (data.recommendations) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "РЕКОМЕНДАЦИИ ПО УЛУЧШЕНИЮ",
              bold: true,
              size: 24
            })
          ],
          heading: HeadingLevel.HEADING_1
        })
      )
      
      if (data.recommendations.detailedRecommendations?.length > 0) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Приоритетные действия:",
                bold: true,
                size: 22
              })
            ]
          })
        )
        
        data.recommendations.detailedRecommendations.forEach((rec: any, index: number) => {
          const recText = typeof rec === 'string' ? rec : rec.text || rec.description || rec.title || JSON.stringify(rec)
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${index + 1}. ${recText}`,
                  size: 22
                })
              ]
            })
          )
        })
        
        paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }))
      }
      
      if (data.recommendations.immediate?.length > 0) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Немедленные действия:",
                bold: true,
                size: 22
              })
            ]
          })
        )
        
        data.recommendations.immediate.forEach((rec: any, index: number) => {
          const recText = typeof rec === 'string' ? rec : rec.text || rec.description || rec.title || JSON.stringify(rec)
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${index + 1}. ${recText}`,
                  size: 22
                })
              ]
            })
          )
        })
        
        paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }))
      }
      
      if (data.recommendations.shortTerm?.length > 0) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Краткосрочные (1-3 месяца):",
                bold: true,
                size: 22
              })
            ]
          })
        )
        
        data.recommendations.shortTerm.forEach((rec: any, index: number) => {
          const recText = typeof rec === 'string' ? rec : rec.text || rec.description || rec.title || JSON.stringify(rec)
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${index + 1}. ${recText}`,
                  size: 22
                })
              ]
            })
          )
        })
        
        paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }))
      }
      
      if (data.recommendations.longTerm?.length > 0) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Долгосрочные (3+ месяца):",
                bold: true,
                size: 22
              })
            ]
          })
        )
        
        data.recommendations.longTerm.forEach((rec: any, index: number) => {
          const recText = typeof rec === 'string' ? rec : rec.text || rec.description || rec.title || JSON.stringify(rec)
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${index + 1}. ${recText}`,
                  size: 22
                })
              ]
            })
          )
        })
      }
      
      if (data.recommendations.roiCalculation) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Расчет ROI:",
                bold: true,
                size: 22
              })
            ]
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: data.recommendations.roiCalculation,
                size: 22
              })
            ]
          })
        )
      }
    }
    
    // Заключение
    paragraphs.push(
      new Paragraph({ children: [new TextRun({ text: "" })] }),
      
      new Paragraph({
        children: [
          new TextRun({
            text: "ЗАКЛЮЧЕНИЕ",
            bold: true,
            size: 24
          })
        ],
        heading: HeadingLevel.HEADING_1
      }),
      
      new Paragraph({
        children: [
          new TextRun({
            text: `На основе анализа ${data.overview?.totalInterviews || 0} интервью было выявлено ${data.overview?.totalProblems || 0} ключевых проблем и ${data.overview?.totalNeeds || 0} потребностей пользователей.`,
            size: 22
          })
        ]
      }),
      
      new Paragraph({
        children: [
          new TextRun({
            text: "Реализация предложенных рекомендаций позволит значительно улучшить пользовательский опыт и повысить удовлетворенность клиентов.",
            size: 22
          })
        ]
      })
    )
    
    // Создаем документ
    const doc = new Document({
      sections: [{
        properties: {},
        children: paragraphs
      }]
    })

    // Генерируем DOCX как blob
    const buffer = await Packer.toBuffer(doc)
    const blob = new Blob([buffer as ArrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
    
    // Возвращаем как data URL
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(blob)
    })
  }

  const generateJSONReport = (data: any): string => {
    return JSON.stringify(data, null, 2)
  }

  const downloadReport = (format: string, content: string) => {
    const element = document.createElement('a')
    let filename = `ux-analysis-report-${new Date().toISOString().split('T')[0]}`
    
    switch (format) {
      case 'html':
        filename += '.html'
        const htmlBlob = new Blob([content], { type: 'text/html' })
        element.href = URL.createObjectURL(htmlBlob)
        break
      case 'pdf':
        filename += '.pdf'
        // content уже является data URL для PDF
        element.href = content
        break
      case 'docx':
        filename += '.docx'
        // content уже является data URL для DOCX
        element.href = content
        break
      case 'json':
        filename += '.json'
        const jsonBlob = new Blob([content], { type: 'application/json' })
        element.href = URL.createObjectURL(jsonBlob)
        break
      default:
        const textBlob = new Blob([content], { type: 'text/plain' })
        element.href = URL.createObjectURL(textBlob)
    }
    
    element.download = filename
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <FileText className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-foreground">Генерация отчетов</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Выберите форматы отчетов и сгенерируйте детальную документацию по результатам анализа
        </p>
      </div>


      {/* Format Selection */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Выберите форматы отчетов</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportFormats.map((format) => (
            <label key={format.id} className="flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <input
                type="checkbox"
                checked={selectedFormats.includes(format.id)}
                onChange={() => toggleFormat(format.id)}
                className="mt-1 text-primary"
              />
              <div className="flex items-center space-x-3">
                <format.icon className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium text-foreground">{format.label}</div>
                  <p className="text-sm text-muted-foreground">{format.description}</p>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>


      {/* Generate Button */}
      <div className="text-center">
        <button
          onClick={generateReports}
          disabled={isGenerating || selectedFormats.length === 0}
          className="inline-flex items-center px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Генерация отчетов...
            </>
          ) : (
            <>
              <FileText className="h-5 w-5 mr-2" />
              Сгенерировать отчеты
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
              !
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Ошибка</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Generated Reports */}
      {Object.keys(generatedReports).length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-4">Сгенерированные отчеты</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(generatedReports).map(([format, content]) => {
              const formatInfo = reportFormats.find(f => f.id === format)
              return (
                <div key={format} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {formatInfo?.icon && <formatInfo.icon className="h-5 w-5 text-primary" />}
                      <span className="font-medium text-foreground">{formatInfo?.label || format}</span>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <button
                    onClick={() => downloadReport(format, content)}
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Скачать
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-center pt-8">
        <button
          onClick={onBack}
          className="inline-flex items-center px-6 py-2 border border-muted text-muted-foreground rounded-lg hover:bg-muted/50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад к результатам
        </button>
      </div>
    </div>
  )
}
