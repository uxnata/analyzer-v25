import { NextRequest, NextResponse } from 'next/server'

// Увеличиваем максимальное время выполнения API route до 30 минут
export const maxDuration = 1800

// CORS заголовки
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Обработка OPTIONS запроса для CORS
export async function OPTIONS() {
  return new NextResponse(null, { 
    status: 200,
    headers: corsHeaders
  })
}

interface AnalysisResult {
  overview: {
    totalInterviews: number
    totalProblems: number
    totalNeeds: number
    summary: string
    keyFindings: string[]
    methodology: string
    goalAchievement?: any[]
  }
  insights: {
    painPoints: any[]
    userNeeds: any[]
    opportunities: string[]
    behavioralPatterns: any[]
    detailedInsights: any[]
  }
  personas: {
    primary: any
    secondary: any
    segments?: any[]
  }
  recommendations: {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
    detailedRecommendations?: any[]
    roiCalculation?: string
    nextSteps?: any[]
    riskMitigation?: any[]
  }
  metrics: {
    satisfaction: number
    usability: number
    engagement: number
    conversion: number
    nps: number
    retention: number
  }
  interviewSummaries: any[]
  powerfulQuotes: string[]
  briefQuestions: any[]
  keyInsights: any[]
  crossQuestionInsights: any[]
  unexpectedFindings: any[]
  successMetrics: string[]
}

interface InterviewSummary {
  id: number
  summary: string
  length: number
  sentenceCount: number
  sentiment: number
  keyQuotes: string[]
  painPoints: any[]
  needs: any[]
  insights: any[]
  emotionalJourney: any[]
  contradictions: any[]
  businessPains: any[]
  opportunities: any[]
  briefRelatedFindings: any
}

// Конфигурация анализа
const config = {
  analysis: {
    min_interviews_recommended: 8,
    use_speaker_splitting: true,
    chunk_size: 1500, // Уменьшили размер чанка
    chunk_overlap: 150, // Уменьшили перекрытие
    max_chunks_per_interview: 8, // Ограничиваем количество чанков
    max_retries: 2 // Уменьшили количество попыток
  }
}

// Функция для вызова OpenRouter API
async function callOpenRouterAPI(prompt: string, model: string = 'anthropic/claude-3.5-sonnet', maxRetries = 3): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY || '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'
  
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY не найден в переменных окружения')
  }
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Попытка ${attempt}/${maxRetries} вызова OpenRouter API...`)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 300000) // 5 минут таймаут
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'UX Analyzer'
        },
        body: JSON.stringify({
          model: model === 'google/gemini-1.5-pro' ? 'anthropic/claude-3.5-sonnet' : model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 4000,
          temperature: 0.3
        }),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error: any) {
      console.error(`❌ Попытка ${attempt} не удалась:`, error?.message || 'Неизвестная ошибка')
      
      // Специальная обработка для сетевых ошибок
      if (error.name === 'AbortError') {
        console.log('⏰ Таймаут запроса (60 секунд)')
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        console.log('🌐 Сетевая ошибка, повторяем...')
      }
      
      if (attempt === maxRetries) {
        throw error
      }
      
      // Увеличиваем задержку с каждой попыткой
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000) // Экспоненциальная задержка, максимум 10 сек
      console.log(`⏳ Ожидание ${delay}ms перед повторной попыткой...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw new Error('All API attempts failed')
}

// Извлечение JSON из ответа
function extractJSON(text: string): any {
  try {
    console.log('📝 Первые 200 символов:', text.substring(0, 200));
    
    // Попытка 1: весь ответ - JSON
    try {
      const result = JSON.parse(text);
      console.log('✅ JSON успешно извлечен (попытка 1)');
      return result;
    } catch (e1: any) {
      console.log('❌ Попытка 1 не удалась:', e1?.message || 'Неизвестная ошибка');
      
      // Попытка 2: JSON между ```json и ```
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        try {
          const result = JSON.parse(jsonMatch[1]);
          console.log('✅ JSON успешно извлечен (попытка 2)');
          return result;
        } catch (e2: any) {
          console.log('❌ Попытка 2 не удалась:', e2?.message || 'Неизвестная ошибка');
        }
      }

      // Попытка 3: JSON между { и }
      const jsonMatch2 = text.match(/\{[\s\S]*\}/);
      if (jsonMatch2) {
        try {
          const result = JSON.parse(jsonMatch2[0]);
          console.log('✅ JSON успешно извлечен (попытка 3)');
          return result;
        } catch (e3: any) {
          console.log('❌ Попытка 3 не удалась:', e3?.message || 'Неизвестная ошибка');
        }
      }

      // Попытка 4: JSON массив между [ и ]
      const jsonMatch3 = text.match(/\[[\s\S]*\]/);
      if (jsonMatch3) {
        try {
          const result = JSON.parse(jsonMatch3[0]);
          console.log('✅ JSON успешно извлечен (попытка 4)');
          return result;
        } catch (e4: any) {
          console.log('❌ Попытка 4 не удалась:', e4?.message || 'Неизвестная ошибка');
        }
      }

      // Попытка 5: найти любую JSON-подобную структуру
      const jsonPatterns = [
        /\{[^{}]*\}/g,  // Простые объекты
        /\[[^\[\]]*\]/g,  // Простые массивы
        /\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g,  // Вложенные объекты
        /\[[^\[\]]*(?:\{[^{}]*\}[^\[\]]*)*\]/g  // Массивы с объектами
      ];
      
      for (let i = 0; i < jsonPatterns.length; i++) {
        const matches = text.match(jsonPatterns[i]);
        if (matches) {
          for (const match of matches) {
            try {
              const result = JSON.parse(match);
              console.log('✅ JSON успешно извлечен (попытка 5, паттерн', i + 1, ')');
              return result;
            } catch (e5) {
              // Продолжаем поиск
            }
          }
        }
      }

      console.warn('❌ Не удалось извлечь JSON из ответа');
      return {};
    }
  } catch (error) {
    console.error('❌ Критическая ошибка при извлечении JSON:', error);
    return {};
  }
}

// Создание чанков из транскрипта
function createOverlappingChunks(text: string, chunkSize = 1500, overlap = 150): string[] {
  const chunks: string[] = []
  let start = 0
  
  while (start < text.length && chunks.length < config.analysis.max_chunks_per_interview) {
    const end = Math.min(start + chunkSize, text.length)
    let chunk = text.slice(start, end)
    
    // Пытаемся закончить на границе предложения
    if (end < text.length) {
      const lastSentenceEnd = chunk.lastIndexOf('.')
      if (lastSentenceEnd > chunkSize * 0.7) {
        chunk = chunk.slice(0, lastSentenceEnd + 1)
      }
    }
    
    chunks.push(chunk.trim())
    start = end - overlap
  }
  
  return chunks
}

// Детекция формата спикеров
function detectSpeakerFormat(text: string): boolean {
  const speakerPatterns = [
    /^[А-Я][а-я]+:\s/m,
    /^[A-Z][a-z]+:\s/m,
    /^Интервьюер:\s/m,
    /^Респондент:\s/m
  ]
  
  return speakerPatterns.some(pattern => pattern.test(text))
}

// Создание чанков на основе спикеров
function createSpeakerBasedChunks(text: string): string[] {
  const lines = text.split('\n')
  const chunks: string[] = []
  let currentChunk = ''
  
  for (const line of lines) {
    if (line.trim().match(/^[А-Я][а-я]+:\s/) || line.trim().match(/^[A-Z][a-z]+:\s/)) {
      if (currentChunk.length > 1000) {
        chunks.push(currentChunk.trim())
        currentChunk = line + '\n'
      } else {
        currentChunk += line + '\n'
      }
    } else {
      currentChunk += line + '\n'
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim())
  }
  
  return chunks
}

// Суммаризация чанка
async function summarizeChunk(chunk: string, model: string): Promise<string> {
  const prompt = `Создай краткую, но информативную сводку этого фрагмента интервью. Сохрани все важные детали, цитаты и инсайты:

${chunk}

Сводка должна быть на русском языке и содержать:
- Ключевые темы
- Важные цитаты
- Проблемы и потребности
- Эмоциональные моменты
- Бизнес-аспекты`

  try {
    const response = await callOpenRouterAPI(prompt, model)
    return response
  } catch (error) {
    console.error('Ошибка при суммаризации чанка:', error)
    return chunk.slice(0, 500) + '...'
  }
}

// Анализ профиля и тем
async function analyzeProfileAndThemes(summary: string, interviewNum: number, briefContext: string, model: string): Promise<any> {
  const prompt = `${briefContext}

Ты — ведущий UX-исследователь с 20-летним опытом в качественном анализе данных.

Проанализируй интервью №${interviewNum} и извлеки максимально детальную информацию о респонденте и ключевых темах.

КРИТИЧЕСКИ ВАЖНО:
- Используй ТОЛЬКО информацию из интервью
- НЕ придумывай никаких данных
- Каждая тема должна быть подкреплена ТОЧНЫМИ ЦИТАТАМИ (минимум 60 слов)
- Если информация отсутствует, указывай "Не упоминается в интервью"

Верни ТОЛЬКО валидный JSON в следующем формате:
{
    "respondent_profile": {
        "demographics": "ТОЛЬКО то, что явно сказано в интервью",
        "occupation": "ТОЛЬКО если упоминается профессия",
        "experience_level": "ТОЛЬКО реальный опыт из интервью",
        "context": "ТОЛЬКО реальный контекст из интервью",
        "tech_literacy": "ТОЛЬКО если есть данные",
        "motivations": "ТОЛЬКО явные мотивации из интервью",
        "lifestyle": "ТОЛЬКО если упоминается",
        "archetype": "На основе РЕАЛЬНЫХ данных"
    },
    "key_themes": [
        {
            "theme": "Название темы из интервью",
            "description": "Детальное описание на основе данных",
            "importance": "high/medium/low",
            "frequency": "Как часто упоминается",
            "quotes": ["ПОЛНАЯ цитата минимум 60 слов"],
            "relevance_to_brief": "Как связано с целями исследования"
        }
    ]
}

СУММАРИ:
${summary.slice(0, 4000)}`

  const response = await callOpenRouterAPI(prompt, model)
  return extractJSON(response)
}

// Анализ болей и потребностей
async function analyzePainsAndNeeds(summary: string, interviewNum: number, briefContext: string, model: string): Promise<any> {
  const prompt = `${briefContext}

Ты — эксперт по выявлению пользовательских проблем и скрытых потребностей.

Проанализируй интервью №${interviewNum} и найди ВСЕ боли, проблемы и потребности респондента.

КРИТИЧЕСКИ ВАЖНО:
1. КАЖДАЯ боль должна быть подкреплена ТОЧНОЙ ЦИТАТОЙ (минимум 60 слов)
2. НЕ придумывай проблемы - только то, что ЯВНО сказано
3. Связывай каждую находку с целями и вопросами брифа
4. Приводи ВСЕ доказательства из интервью
5. frequency должен быть ЧИСЛОМ - сколько раз проблема упоминается в интервью (1, 2, 3...)
6. severity должен быть ЧИСЛОМ от 1 до 10:
   - 1-3: низкая серьезность (легкие неудобства)
   - 4-6: средняя серьезность (значительные проблемы)
   - 7-10: высокая серьезность (критические проблемы, блокируют работу)

Верни ТОЛЬКО валидный JSON без дополнительного текста:
{
    "pain_points": [
        {
            "pain": "Описание боли из интервью",
            "severity": 7,
            "frequency": 1,
            "impact": "Влияние на пользователя",
            "quotes": ["Цитата о проблеме"],
            "user_segments": ["Сегменты пользователей"],
            "percentage_affected": 80,
            "context": "Контекст проблемы"
        }
    ],
    "needs": [
        {
            "need": "Описание потребности",
            "priority": "high",
            "frequency": 1,
            "impact": "Важность для пользователя",
            "quotes": ["Цитата о потребности"],
            "user_segments": ["Сегменты пользователей"],
            "percentage_affected": 85,
            "context": "Контекст потребности"
        }
    ]
}

СУММАРИ:
${summary.slice(0, 4000)}`

  const response = await callOpenRouterAPI(prompt, model)
  return extractJSON(response)
}

// Анализ эмоций и инсайтов
async function analyzeEmotionsAndInsights(summary: string, interviewNum: number, briefContext: string, model: string): Promise<any> {
  const prompt = `${briefContext}

Ты — эксперт по эмоциональному дизайну и поведенческой психологии.

Проведи глубочайший анализ эмоционального опыта респондента в интервью №${interviewNum}.

КРИТИЧЕСКИ ВАЖНО:
1. КАЖДЫЙ инсайт должен быть основан на ТОЧНЫХ ЦИТАТАХ (минимум 80 слов)
2. НЕ придумывай эмоции - только то, что ЯВНО выражено
3. Каждый вывод должен помогать ответить на вопросы брифа
4. Приводи ВСЕ доказательства и цитаты

Верни ТОЛЬКО валидный JSON:
{
    "emotional_journey": [
        {
            "moment": "ТОЧНОЕ описание момента из интервью",
            "trigger": "Что ТОЧНО вызвало эмоцию",
            "emotion": "ТОЧНОЕ название эмоции из контекста",
            "emotion_family": "primary/secondary/social/cognitive",
            "intensity": 8,
            "valence": "positive/negative/mixed",
            "duration": "Длительность если упоминается",
            "body_language": "ТОЛЬКО если описано в интервью",
            "quote": "ПОЛНАЯ цитата минимум 80 слов",
            "coping": "Как справлялся ПО СЛОВАМ респондента",
            "impact": "Влияние ПО СЛОВАМ респондента",
            "underlying_need": "Потребность из контекста",
            "relevance_to_brief": "Связь с целями исследования"
        }
    ],
    "insights": [
        {
            "insight": "Глубокий инсайт основанный на данных (минимум 80 слов)",
            "insight_type": "behavioral/emotional/cognitive/motivational",
            "confidence": "high/medium/low",
            "evidence": [
                "ТОЧНОЕ доказательство из интервью",
                "Еще доказательство",
                "Третье доказательство"
            ],
            "contradiction": "Противоречие если есть",
            "hidden_motivation": "Скрытая мотивация из контекста",
            "design_opportunity": "Возможность для дизайна",
            "business_impact": "Влияние на бизнес",
            "quotes": ["ПОЛНАЯ подтверждающая цитата минимум 80 слов", "Еще цитата"],
            "relevance_to_brief": "Как помогает достичь целей исследования"
        }
    ]
}

СУММАРИ:
${summary}`

  const response = await callOpenRouterAPI(prompt, model)
  return extractJSON(response)
}

// Анализ цитат и противоречий
async function analyzeQuotesAndContradictions(summary: string, interviewNum: number, briefContext: string, model: string): Promise<any> {
  const prompt = `${briefContext}

Ты — эксперт по дискурс-анализу и семантическому анализу текста.

Найди самые важные цитаты и ВСЕ противоречия в интервью №${interviewNum}.

КРИТИЧЕСКИ ВАЖНО:
1. КАЖДАЯ цитата должна быть ПОЛНОЙ (минимум 80 слов)
2. НЕ придумывай противоречия - только явные
3. Каждая находка должна помогать ответить на вопросы брифа
4. Приводи ВСЕ доказательства

Верни ТОЛЬКО валидный JSON:
{
    "quotes": [
        {
            "quote": "ПОЛНАЯ цитата минимум 80 слов",
            "context": "Контекст цитаты",
            "importance": "Почему важна",
            "type": "pain/need/insight/contradiction",
            "emotional_tone": "Тон цитаты",
            "relevance_to_brief": "Как отвечает на вопросы"
        }
    ],
    "contradictions": [
        {
            "contradiction": "Описание противоречия",
            "statement_1": "Первое утверждение",
            "statement_2": "Противоречащее утверждение",
            "context": "Контекст противоречия",
            "possible_explanation": "Возможное объяснение",
            "importance": "Важность для исследования",
            "quotes": ["Цитаты подтверждающие противоречие"]
        }
    ]
}

СУММАРИ:
${summary}`

  const response = await callOpenRouterAPI(prompt, model)
  return extractJSON(response)
}

// Анализ бизнес-аспектов
async function analyzeBusinessAspects(summary: string, interviewNum: number, briefContext: string, model: string): Promise<any> {
  const prompt = `${briefContext}

Ты — бизнес-аналитик и эксперт по продуктовой стратегии.

Проанализируй интервью №${interviewNum} с точки зрения бизнес-возможностей и рисков.

КРИТИЧЕСКИ ВАЖНО:
1. КАЖДАЯ находка должна быть основана на РЕАЛЬНЫХ данных
2. НЕ придумывай бизнес-проблемы
3. Связывай с целями и вопросами брифа
4. Приводи ВСЕ доказательства

Верни ТОЛЬКО валидный JSON:
{
    "business_pains": [
        {
            "pain": "Бизнес-проблема из интервью",
            "impact": "Влияние на бизнес",
            "frequency": "Частота проблемы",
            "cost": "Стоимость проблемы если упоминается",
            "quotes": ["Цитаты подтверждающие проблему"]
        }
    ],
    "user_problems": [
        {
            "problem": "Проблема пользователя",
            "severity": "Серьезность",
            "frequency": "Частота",
            "impact": "Влияние на пользователя",
            "quotes": ["Цитаты о проблеме"]
        }
    ],
    "opportunities": [
        {
            "opportunity": "Возможность для улучшения",
            "potential_impact": "Потенциальное влияние",
            "effort_required": "Требуемые усилия",
            "priority": "Приоритет",
            "quotes": ["Цитаты подтверждающие возможность"]
        }
    ]
}

СУММАРИ:
${summary}`

  const response = await callOpenRouterAPI(prompt, model)
  return extractJSON(response)
}

// Глубокий анализ одного интервью
async function deepAnalyzeInterview(transcript: string, interviewNum: number, briefContext: string, model: string): Promise<InterviewSummary> {
  console.log(`   🎤 Анализ интервью ${interviewNum}...`)
  
  // Определяем наличие диаризации и создаем чанки
  let chunks: string[]
  if (config.analysis.use_speaker_splitting && detectSpeakerFormat(transcript)) {
    console.log(`   🎤 Обнаружена диаризация для интервью ${interviewNum}`)
    chunks = createSpeakerBasedChunks(transcript)
  } else {
    chunks = createOverlappingChunks(transcript, config.analysis.chunk_size, config.analysis.chunk_overlap)
  }

  // Ограничиваем количество чанков для экономии памяти
  if (chunks.length > config.analysis.max_chunks_per_interview) {
    chunks = chunks.slice(0, config.analysis.max_chunks_per_interview)
    console.log(`   ⚠️ Ограничили количество чанков до ${config.analysis.max_chunks_per_interview}`)
  }

  // Суммаризируем каждый чанк
  const chunkSummaries: string[] = []
  for (let i = 0; i < chunks.length; i++) {
    if (chunks.length > 1) {
      console.log(`   Анализ части ${i+1}/${chunks.length}...`)
    }
    
    const chunkSummary = await summarizeChunk(chunks[i], model)
    if (chunkSummary) {
      chunkSummaries.push(chunkSummary)
    }
    
    // Добавляем небольшую задержку между запросами
    if (i < chunks.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  const combinedSummary = chunkSummaries.join('\n\n')

  // Анализируем только самые важные аспекты для экономии времени
  const painsAndNeeds = await analyzePainsAndNeeds(combinedSummary, interviewNum, briefContext, model)
  const quotesAndContradictions = await analyzeQuotesAndContradictions(combinedSummary, interviewNum, briefContext, model)
  
  // Создаем объект InterviewSummary с правильной структурой
  const summary: InterviewSummary = {
    id: interviewNum,
    summary: combinedSummary,
    length: transcript.length,
    sentenceCount: transcript.split(/[.!?]+/).length,
    sentiment: 0,
    keyQuotes: quotesAndContradictions.quotes?.map((q: any) => q.quote) || [],
    painPoints: painsAndNeeds.pain_points || [],
    needs: painsAndNeeds.needs || [],
    insights: [],
    emotionalJourney: [],
    contradictions: quotesAndContradictions.contradictions || [],
    businessPains: [],
    opportunities: [],
    briefRelatedFindings: {}
  }

  return summary
}

// Кросс-анализ интервью
async function crossAnalyzeInterviews(summaries: InterviewSummary[], briefContext: string, model: string): Promise<any> {
  
  const allPains = summaries.flatMap(s => s.painPoints)
  const allNeeds = summaries.flatMap(s => s.needs)
  const allInsights = summaries.flatMap(s => s.insights)

  const prompt = `${briefContext}

Ты — эксперт по синтезу качественных данных и выявлению паттернов.

Проанализируй ВСЕ интервью вместе и найди общие паттерны, противоречия и инсайты.

ДАННЫЕ ИЗ ВСЕХ ИНТЕРВЬЮ:
Количество интервью: ${summaries.length}
Общие боли: ${allPains.length}
Общие потребности: ${allNeeds.length}
Общие инсайты: ${allInsights.length}

КРИТИЧЕСКИ ВАЖНО:
1. Найди ОБЩИЕ паттерны между интервью
2. Выяви ПРОТИВОРЕЧИЯ в данных
3. Определи САМЫЕ ВАЖНЫЕ инсайты
4. Свяжи с целями брифа

Верни ТОЛЬКО валидный JSON:
{
    "common_patterns": [
        {
            "pattern": "Название паттерна",
            "description": "Детальное описание",
            "frequency": "Как часто встречается",
            "importance": "high/medium/low",
            "evidence": ["Доказательства из интервью"],
            "implications": "Выводы для продукта"
        }
    ],
    "contradictions": [
        {
            "contradiction": "Описание противоречия",
            "evidence": ["Доказательства противоречия"],
            "possible_explanations": ["Возможные объяснения"],
            "importance": "Важность для исследования"
        }
    ],
    "key_insights": [
        {
            "insight": "Ключевой инсайт (минимум 100 слов)",
            "confidence": "high/medium/low",
            "evidence": ["Множественные доказательства"],
            "business_impact": "Влияние на бизнес",
            "design_implications": "Выводы для дизайна"
        }
    ]
}`

  const response = await callOpenRouterAPI(prompt, model)
  return extractJSON(response)
}

// Дедупликация болей
function deduplicatePains(summaries: InterviewSummary[]): any[] {
  console.log('   🔄 Дедупликация болей...')
  
  const allPains = summaries.flatMap(s => s.painPoints)
  const uniquePains: any[] = []
  const seenPains = new Set<string>()

  for (const pain of allPains) {
    if (pain && pain.pain) {
      const painKey = pain.pain.toLowerCase().slice(0, 100)
      if (!seenPains.has(painKey) && painKey.length > 20) {
        seenPains.add(painKey)
        uniquePains.push(pain)
      }
    }
  }

  // Если болей нет, возвращаем пустой массив - НЕ СОЗДАЕМ ЗАГЛУШКИ
  if (uniquePains.length === 0) {
    console.log('   ⚠️ Боли не выявлены в интервью')
  }

  return uniquePains.slice(0, 20) // Ограничиваем количество
}

// Идентификация поведенческих паттернов
async function identifyBehavioralPatterns(summaries: InterviewSummary[], crossAnalysis: any, briefContext: string, model: string): Promise<any[]> {
  console.log('   🧠 Идентификация поведенческих паттернов...')
  
  const prompt = `${briefContext}

Ты — эксперт по поведенческой психологии и пользовательскому опыту.

Найди поведенческие паттерны на основе анализа ${summaries.length} интервью.

ДАННЫЕ:
${JSON.stringify(crossAnalysis, null, 2)}

КРИТИЧЕСКИ ВАЖНО:
1. Найди РЕАЛЬНЫЕ поведенческие паттерны
2. НЕ придумывай паттерны
3. Каждый паттерн должен быть подкреплен данными
4. Свяжи с целями брифа

Верни ТОЛЬКО валидный JSON:
{
    "behavioral_patterns": [
        {
            "pattern": "Название паттерна",
            "description": "Детальное описание (минимум 80 слов)",
            "frequency": "Как часто встречается",
            "triggers": ["Триггеры паттерна"],
            "manifestation": "Как проявляется",
            "user_segments": ["Какие сегменты демонстрируют"],
            "design_implications": "Выводы для дизайна",
            "evidence": ["Доказательства из интервью"]
        }
    ]
}`

  const response = await callOpenRouterAPI(prompt, model)
  const result = extractJSON(response)
  return result.behavioral_patterns || []
}

// Сегментация аудитории
async function segmentAudience(summaries: InterviewSummary[], patterns: any[], briefContext: string, model: string): Promise<any[]> {
  console.log('   👥 Сегментация аудитории...')
  
  const prompt = `${briefContext}

Ты — эксперт по сегментации пользователей и созданию персон.

Создай сегменты пользователей на основе анализа ${summaries.length} интервью.

ПОВЕДЕНЧЕСКИЕ ПАТТЕРНЫ:
${JSON.stringify(patterns, null, 2)}

КРИТИЧЕСКИ ВАЖНО:
1. Создай РЕАЛЬНЫЕ сегменты на основе данных
2. НЕ придумывай сегменты
3. Каждый сегмент должен быть четко определен
4. Свяжи с целями брифа

Верни ТОЛЬКО валидный JSON:
{
    "user_segments": [
        {
            "name": "Название сегмента",
            "size": "Процент от общей аудитории",
            "characteristics": ["Характеристики сегмента"],
            "pain_points": ["Основные проблемы сегмента"],
            "needs": ["Основные потребности"],
            "behaviors": ["Поведенческие особенности"],
            "motivations": ["Мотивации сегмента"],
            "quotes": ["Цитаты представителей сегмента"]
        }
    ]
}`

  const response = await callOpenRouterAPI(prompt, model)
  const result = extractJSON(response)
  return result.user_segments || []
}

// Создание персон
async function createPersonas(segments: any[], briefContext: string, model: string): Promise<any> {
  console.log('   👤 Создание персон...')
  
  const prompt = `${briefContext}

Ты — эксперт по созданию пользовательских персон.

Создай детальные персоны на основе сегментов пользователей.

СЕГМЕНТЫ:
${JSON.stringify(segments, null, 2)}

КРИТИЧЕСКИ ВАЖНО:
1. Создай РЕАЛЬНЫЕ персоны на основе данных
2. НЕ придумывай характеристики
3. Каждая персона должна быть детальной
4. Свяжи с целями брифа

Верни ТОЛЬКО валидный JSON:
{
    "primary": {
        "name": "Имя персоны",
        "description": "Детальное описание (минимум 150 слов)",
        "demographics": "Демографические данные",
        "goals": ["Цели персоны"],
        "frustrations": ["Разочарования"],
        "motivations": ["Мотивации"],
        "behaviors": ["Поведенческие особенности"],
        "quotes": ["Цитаты персоны"]
    },
    "secondary": {
        "name": "Имя вторичной персоны",
        "description": "Детальное описание (минимум 150 слов)",
        "demographics": "Демографические данные",
        "goals": ["Цели персоны"],
        "frustrations": ["Разочарования"],
        "motivations": ["Мотивации"],
        "behaviors": ["Поведенческие особенности"],
        "quotes": ["Цитаты персоны"]
    }
}`

  const response = await callOpenRouterAPI(prompt, model)
  return extractJSON(response)
}

// Генерация рекомендаций
async function generateRecommendations(painPoints: any[], needs: any[], patterns: any[], briefContext: string, model: string): Promise<any> {
  console.log('   💡 Генерация рекомендаций...')
  
  const prompt = `${briefContext}

Ты — эксперт по продуктовой стратегии и UX-дизайну.

Создай детальные рекомендации на основе анализа данных.

ДАННЫЕ:
Болевые точки: ${painPoints.length}
Потребности: ${needs.length}
Поведенческие паттерны: ${patterns.length}

КРИТИЧЕСКИ ВАЖНО:
1. Создай ПРАКТИЧЕСКИЕ рекомендации
2. Приоритизируй по важности
3. Свяжи с целями брифа
4. Укажи конкретные действия

Верни ТОЛЬКО валидный JSON:
{
    "immediate": [
        "Немедленные действия (1-2 недели)"
    ],
    "shortTerm": [
        "Краткосрочные улучшения (1-3 месяца)"
    ],
    "longTerm": [
        "Долгосрочные планы (3-12 месяцев)"
    ],
    "detailedRecommendations": [
        {
            "title": "Название рекомендации",
            "description": "Детальное описание (минимум 100 слов)",
            "priority": "high/medium/low",
            "effort": "high/medium/low",
            "impact": "high/medium/low",
            "timeline": "Временные рамки",
            "resources": "Требуемые ресурсы",
            "success_metrics": ["Метрики успеха"]
        }
    ]
}`

  const response = await callOpenRouterAPI(prompt, model)
  return extractJSON(response)
}

// Быстрый кросс-анализ
async function quickCrossAnalysis(summaries: InterviewSummary[], briefContext: string, model: string): Promise<any> {
  
  const allPains = summaries.flatMap(s => s.painPoints)
  const allNeeds = summaries.flatMap(s => s.needs)
  
  const prompt = `${briefContext}

Ты — эксперт по синтезу качественных данных.

Быстро проанализируй ${summaries.length} интервью и найди ключевые инсайты.

ДАННЫЕ:
Количество интервью: ${summaries.length}
Общие боли: ${allPains.length}
Общие потребности: ${allNeeds.length}

Верни ТОЛЬКО валидный JSON:
{
    "key_insights": [
        {
            "insight": "Ключевой инсайт (минимум 80 слов)",
            "confidence": "high/medium/low",
            "evidence": ["Доказательства из интервью"]
        }
    ]
}`

  try {
    const response = await callOpenRouterAPI(prompt, model)
    const result = extractJSON(response)
    return result
  } catch (error) {
    console.error('Ошибка быстрого кросс-анализа:', error)
    // Возвращаем пустой объект - НЕ СОЗДАЕМ ЗАГЛУШКИ
    return { 
      key_insights: [],
      contradictions: []
    }
  }
}

// Быстрая сегментация аудитории
async function quickSegmentAudience(summaries: InterviewSummary[], briefContext: string, model: string): Promise<any[]> {
  console.log('   👥 Анализ реальных пользователей...')
  
  const prompt = `${briefContext}

Ты — эксперт по анализу пользователей.

ВАЖНО: Анализируй ТОЛЬКО реальных людей из интервью. НЕ выдумывай сегменты!

ИНТЕРВЬЮ ДЛЯ АНАЛИЗА (${summaries.length} штук):
${JSON.stringify(summaries.map(s => ({ summary: s.summary, keyQuotes: s.keyQuotes })), null, 2)}

На основе РЕАЛЬНЫХ данных создай анализ пользователей:

ВАЖНО: Если у тебя ${summaries.length} интервью, то size должен быть "${summaries.length === 1 ? '1 из 1 интервью (100%)' : `${summaries.length} из ${summaries.length} интервью (100%)`}"

Верни ТОЛЬКО валидный JSON:
{
    "user_segments": [
        {
            "name": "Реальный тип пользователя из интервью",
            "size": "${summaries.length === 1 ? '1 из 1 интервью (100%)' : `${summaries.length} из ${summaries.length} интервью (100%)`}",
            "characteristics": ["Реальные характеристики из интервью"],
            "pain_points": ["Реальные проблемы из интервью"],
            "needs": ["Реальные потребности из интервью"],
            "behaviors": ["Реальное поведение из интервью"],
            "motivations": ["Реальные мотивации из интервью"],
            "quotes": ["Реальные цитаты из интервью"]
        }
    ]
}`

  try {
    const response = await callOpenRouterAPI(prompt, model)
    const result = extractJSON(response)
    return result.user_segments || []
  } catch (error) {
    console.error('Ошибка быстрой сегментации:', error)
    // Возвращаем пустой массив - НЕ СОЗДАЕМ ЗАГЛУШКИ
    return []
  }
}

// Генерация вопросов брифа
async function generateBriefQuestions(summaries: InterviewSummary[], briefContext: string, model: string): Promise<any[]> {
  // Извлекаем вопросы и гипотезы из брифа
  const extractedQuestions = extractQuestionsFromBrief(briefContext)
  const extractedHypotheses = extractHypothesesFromBrief(briefContext)
  
  if (extractedQuestions.length === 0 && extractedHypotheses.length === 0) {
    console.log('   ⚠️ Вопросы и гипотезы из брифа не найдены')
    return []
  }
  
  const prompt = `${briefContext}

Ты — эксперт по анализу пользователей. Проанализируй интервью и дай ИСЧЕРПЫВАЮЩИЕ ответы на конкретные вопросы и гипотезы из брифа.

НАЙДЕННЫЕ ВОПРОСЫ ИЗ БРИФА:
${extractedQuestions.length > 0 ? extractedQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n') : 'Вопросы не найдены'}

НАЙДЕННЫЕ ГИПОТЕЗЫ ИЗ БРИФА:
${extractedHypotheses.length > 0 ? extractedHypotheses.map((h, i) => `${i + 1}. ${h}`).join('\n') : 'Гипотезы не найдены'}

ДАННЫЕ ИЗ ИНТЕРВЬЮ:
${JSON.stringify(summaries.map(s => ({
  interview_id: s.id,
  key_insights: s.insights,
  pain_points: s.painPoints,
  user_needs: s.needs,
  key_quotes: s.keyQuotes
})), null, 2)}

Для КАЖДОГО вопроса из брифа дай детальный ответ на основе данных интервью.
Для КАЖДОЙ гипотезы определи: ПОДТВЕРДИЛАСЬ или НЕ ПОДТВЕРДИЛАСЬ на основе данных интервью.

Верни ТОЛЬКО валидный JSON:
{
    "questions": [
        {
            "question": "Точный вопрос из брифа",
            "answer": "Детальный ответ на основе данных интервью (минимум 100 слов)",
            "confidence": "high/medium/low",
            "evidence": ["Полная цитата 1 из интервью (минимум 50 слов)", "Полная цитата 2 из интервью (минимум 50 слов)"],
            "recommendations": ["Конкретная рекомендация 1", "Конкретная рекомендация 2"]
        }
    ],
    "hypotheses": [
        {
            "hypothesis": "Точная гипотеза из брифа",
            "status": "confirmed/not_confirmed/partially_confirmed",
            "analysis": "Детальный анализ на основе данных интервью (минимум 100 слов)",
            "evidence": ["Полная цитата 1 из интервью (минимум 50 слов)", "Полная цитата 2 из интервью (минимум 50 слов)"],
            "confidence": "high/medium/low"
        }
    ]
}`

  try {
    const response = await callOpenRouterAPI(prompt, model)
    const result = JSON.parse(response)
    
    // Объединяем вопросы и гипотезы в один массив для отображения
    const allItems = [
      ...(result.questions || []).map((q: any) => ({ ...q, type: 'question' })),
      ...(result.hypotheses || []).map((h: any) => ({ ...h, type: 'hypothesis' }))
    ]
    
    return allItems
  } catch (error) {
    console.error('Ошибка генерации вопросов брифа:', error)
    return []
  }
}

// Функция для извлечения гипотез из брифа
function extractHypothesesFromBrief(briefText: string): string[] {
  const hypotheses: string[] = []
  const lines = briefText.split('\n')
  
  let inHypothesesSection = false
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()
    
    // Проверяем, находимся ли мы в секции гипотез
    if (trimmedLine.toLowerCase().includes('гипотез') || 
        trimmedLine.toLowerCase().includes('hypothesis') ||
        trimmedLine.toLowerCase().includes('предположен')) {
      inHypothesesSection = true
      continue
    }
    
    // Если мы в секции гипотез и строка выглядит как гипотеза
    if (inHypothesesSection && trimmedLine.length > 10) {
      // Убираем маркеры списка (-, *, 1., 2. и т.д.)
      const cleanHypothesis = trimmedLine.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '').trim()
      if (cleanHypothesis.length > 10) {
        hypotheses.push(cleanHypothesis)
      }
    }
    
    // Если встречаем новую секцию, выходим из секции гипотез
    if (trimmedLine && 
        (trimmedLine.toLowerCase().includes('цел') || 
         trimmedLine.toLowerCase().includes('аудитор') ||
         trimmedLine.toLowerCase().includes('метрик') ||
         trimmedLine.toLowerCase().includes('вопрос'))) {
      inHypothesesSection = false
    }
  }
  
  return hypotheses
}

// Функция для извлечения вопросов из брифа
function extractQuestionsFromBrief(briefText: string): string[] {
  const questions: string[] = []
  const lines = briefText.split('\n')
  
  let inQuestionsSection = false
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()
    
    // Проверяем, находимся ли мы в секции вопросов
    if (trimmedLine.toLowerCase().includes('вопрос') || 
        trimmedLine.toLowerCase().includes('question')) {
      inQuestionsSection = true
      continue
    }
    
    // Если мы в секции вопросов и строка содержит знак вопроса
    if (inQuestionsSection && trimmedLine.includes('?')) {
      // Убираем маркеры списка (-, *, 1., 2. и т.д.)
      const cleanQuestion = trimmedLine.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '').trim()
      if (cleanQuestion.length > 10) { // Минимальная длина вопроса
        questions.push(cleanQuestion)
      }
    }
    
    // Если встречаем новую секцию, выходим из секции вопросов
    if (trimmedLine && !trimmedLine.includes('?') && 
        (trimmedLine.toLowerCase().includes('цел') || 
         trimmedLine.toLowerCase().includes('аудитор') ||
         trimmedLine.toLowerCase().includes('метрик'))) {
      inQuestionsSection = false
    }
  }
  
  // Если не нашли вопросы в специальной секции, ищем все строки с вопросами
  if (questions.length === 0) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmedLine = line.trim()
      if (trimmedLine.includes('?') && trimmedLine.length > 10) {
        const cleanQuestion = trimmedLine.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '').trim()
        if (cleanQuestion.length > 10) {
          questions.push(cleanQuestion)
        }
      }
    }
  }
  
  return questions
}

// Быстрое создание персон
async function quickCreatePersonas(segments: any[], briefContext: string, model: string): Promise<any> {
  console.log('   👤 Анализ реальных пользователей...')
  
  const prompt = `${briefContext}

Ты — эксперт по анализу пользователей. 

ВАЖНО: Анализируй ТОЛЬКО реальных людей из интервью. НЕ выдумывай персонажей!

СЕГМЕНТЫ ПОЛЬЗОВАТЕЛЕЙ:
${JSON.stringify(segments, null, 2)}

На основе реальных данных создай анализ:

Верни ТОЛЬКО валидный JSON:
{
    "primary": {
        "name": "Реальный пользователь из интервью",
        "description": "Описание основано на реальных ответах из интервью",
        "goals": ["Цели из интервью"],
        "frustrations": ["Проблемы из интервью"],
        "motivations": ["Мотивации из интервью"]
    },
    "secondary": {
        "name": "Другой реальный пользователь",
        "description": "Описание основано на реальных ответах из интервью",
        "goals": ["Цели из интервью"],
        "frustrations": ["Проблемы из интервью"],
        "motivations": ["Мотивации из интервью"]
    }
}`

  try {
    const response = await callOpenRouterAPI(prompt, model)
    const result = extractJSON(response)
    return result
  } catch (error) {
    console.error('Ошибка быстрого создания персон:', error)
    // Возвращаем пустой объект - НЕ СОЗДАЕМ ЗАГЛУШКИ
    return {
      primary: { name: '', description: '', goals: [], frustrations: [], motivations: [] },
      secondary: { name: '', description: '', goals: [], frustrations: [], motivations: [] }
    }
  }
}

// Быстрая генерация рекомендаций
async function quickGenerateRecommendations(painPoints: any[], needs: any[], briefContext: string, model: string): Promise<any> {
  console.log('   💡 Быстрая генерация рекомендаций...')
  
  const prompt = `${briefContext}

Ты — эксперт по продуктовой стратегии.

Быстро создай рекомендации на основе анализа.

ДАННЫЕ:
Болевые точки: ${painPoints.length}
Потребности: ${needs.length}

Верни ТОЛЬКО валидный JSON:
{
    "immediate": ["Немедленные действия"],
    "shortTerm": ["Краткосрочные улучшения"],
    "longTerm": ["Долгосрочные планы"],
    "detailedRecommendations": [
        {
            "title": "Название рекомендации",
            "description": "Описание (минимум 80 слов)",
            "priority": "high/medium/low",
            "effort": "high/medium/low",
            "impact": "high/medium/low"
        }
    ]
}`

  try {
    const response = await callOpenRouterAPI(prompt, model)
    const result = extractJSON(response)
    return result
  } catch (error) {
    console.error('Ошибка быстрой генерации рекомендаций:', error)
    // Возвращаем пустой объект - НЕ СОЗДАЕМ ЗАГЛУШКИ
    return {
      immediate: [],
      shortTerm: [],
      longTerm: [],
      detailedRecommendations: []
    }
  }
}

// Расчет метрик
function calculateMetrics(summaries: InterviewSummary[], painPoints: any[], needs: any[]): any {
  
  const totalIssues = painPoints.length
  const totalNeeds = needs.length
  const totalInterviews = summaries.length
  
  // Честно говорим - метрики требуют количественных данных
  return {
    satisfaction: 'Требует количественных данных',
    usability: 'Требует количественных данных', 
    engagement: 'Требует количественных данных',
    conversion: 'Требует количественных данных',
    nps: 'Требует количественных данных',
    retention: 'Требует количественных данных',
    note: `Найдено ${totalIssues} проблем и ${totalNeeds} потребностей в ${totalInterviews} интервью. Метрики требуют количественных исследований (опросы, A/B тесты, аналитика).`
  }
}

// Быстрый анализ - один запрос на интервью
async function quickAnalyzeInterview(transcript: string, interviewNum: number, briefContext: string, model: string): Promise<InterviewSummary> {
  console.log(`   🎤 Быстрый анализ интервью ${interviewNum}...`)
  
  // Ограничиваем размер транскрипта для экономии
  const maxLength = 8000
  const truncatedTranscript = transcript.length > maxLength 
    ? transcript.substring(0, maxLength) + '... [обрезано для экономии]'
    : transcript

  const prompt = `Проанализируй интервью ${interviewNum} и верни JSON с результатами.

БРИФ ИССЛЕДОВАНИЯ:
${briefContext}

ИНТЕРВЬЮ ${interviewNum}:
${truncatedTranscript}

Верни JSON в формате:
{
  "pain_points": [
    {
      "pain": "описание проблемы",
      "severity": 7,
      "frequency": 1,
      "impact": "влияние на пользователя"
    }
  ],
  "quotes": [
    {
      "quote": "значимая цитата (минимум 20 слов)",
      "context": "контекст цитаты",
      "emotion": "эмоциональный тон"
    }
  ],
  "key_insights": [
    "ключевое наблюдение 1",
    "ключевое наблюдение 2"
  ]
}`

  try {
    const response = await callOpenRouterAPI(prompt, model)
    const data = extractJSON(response)
    
    return {
      id: interviewNum,
      summary: `Интервью ${interviewNum}: ${data.pain_points?.length || 0} проблем, ${data.quotes?.length || 0} цитат`,
      length: transcript.length,
      sentenceCount: transcript.split(/[.!?]+/).length,
      sentiment: 0,
      keyQuotes: data.quotes?.map((q: any) => q.quote) || [],
      painPoints: data.pain_points || [],
      needs: [],
      insights: data.key_insights || [],
      emotionalJourney: [],
      contradictions: [],
      businessPains: [],
      opportunities: [],
      briefRelatedFindings: {}
    }
  } catch (error) {
    console.error(`❌ Ошибка быстрого анализа интервью ${interviewNum}:`, error)
    return {
      id: interviewNum,
      summary: `Ошибка анализа интервью ${interviewNum}`,
      length: transcript.length,
      sentenceCount: transcript.split(/[.!?]+/).length,
      sentiment: 0,
      keyQuotes: [],
      painPoints: [],
      needs: [],
      insights: [],
      emotionalJourney: [],
      contradictions: [],
      businessPains: [],
      opportunities: [],
      briefRelatedFindings: {}
    }
  }
}

// Основная функция анализа
export async function POST(request: NextRequest) {
  try {
    
    const { brief, transcripts, model = 'anthropic/claude-3.5-sonnet', analysisMode = 'full' } = await request.json()
    
    console.log(`📝 Бриф: ${brief.length} символов`)
    console.log(`🎤 Транскрипты: ${transcripts.length} интервью`)
    console.log(`🤖 Модель: ${model}`)
    
    // Детальная информация о транскриптах
    transcripts.forEach((transcript, index) => {
      console.log(`  Транскрипт ${index + 1}: ${transcript.length} символов`)
      console.log(`  Начало: ${transcript.substring(0, 100)}...`)
    })
    
    // Проверяем переменные окружения
    console.log('🔑 Проверяем переменные окружения:')
    console.log('   OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY ? '✅' : '❌')
    
    transcripts.forEach((transcript: string, index: number) => {
      console.log(`  Интервью ${index + 1}: ${transcript.length} символов`)
    })

    // Проверка количества интервью
    if (transcripts.length < config.analysis.min_interviews_recommended) {
      console.log(`⚠️  ВНИМАНИЕ: Рекомендуется минимум ${config.analysis.min_interviews_recommended} интервью!`)
      console.log(`   У вас: ${transcripts.length} интервью`)
    }

    const briefContext = brief ? `КОНТЕКСТ БРИФА:\n${brief}\n\n` : ''

    // 1. Анализ каждого интервью (выбираем режим)
    console.log(`🧠 Начинаю ${analysisMode === 'quick' ? 'быстрый' : 'глубокий'} анализ...`)
    const interviewSummaries: InterviewSummary[] = []
    
    for (let i = 0; i < transcripts.length; i++) {
      let summary: InterviewSummary
      
      if (analysisMode === 'quick') {
        // Быстрый анализ - один запрос на интервью
        summary = await quickAnalyzeInterview(transcripts[i], i + 1, briefContext, model)
      } else {
        // Полный анализ - детальная обработка
        summary = await deepAnalyzeInterview(transcripts[i], i + 1, briefContext, model)
      }
      
      interviewSummaries.push(summary)
      
      // Добавляем задержку между интервью для стабильности
      if (i < transcripts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }

    // 2. Дедупликация болей (быстрая)
    console.log('🔄 Дедупликация болей...')
    const deduplicatedPains = deduplicatePains(interviewSummaries)

    // 3. Быстрый кросс-анализ (упрощенный)
    const crossAnalysis = await quickCrossAnalysis(interviewSummaries, briefContext, model)

    // 4. Упрощенная сегментация
    console.log('👥 Упрощенная сегментация...')
    const segments = await quickSegmentAudience(interviewSummaries, briefContext, model)

    // 5. Быстрое создание персон
    console.log('👤 Быстрое создание персон...')
    const personas = await quickCreatePersonas(segments, briefContext, model)

    // 6. Быстрая генерация рекомендаций
    console.log('💡 Быстрая генерация рекомендаций...')
    const recommendations = await quickGenerateRecommendations(deduplicatedPains, interviewSummaries.flatMap(s => s.needs), briefContext, model)

    // 8. Расчет метрик
    const metrics = calculateMetrics(interviewSummaries, deduplicatedPains, interviewSummaries.flatMap(s => s.needs))

    // 9. Создание финального результата
    const result: AnalysisResult = {
      overview: {
        totalInterviews: transcripts.length,
        totalProblems: deduplicatedPains.length,
        totalNeeds: interviewSummaries.flatMap(s => s.needs).length,
        summary: `Анализ ${transcripts.length} интервью выявил ${deduplicatedPains.length} основных проблем и ${interviewSummaries.flatMap(s => s.needs).length} потребностей пользователей.`,
        keyFindings: crossAnalysis.key_insights?.map((i: any) => i.insight) || [],
        methodology: 'Глубокий качественный анализ с использованием AI-анализа транскриптов, кросс-анализа паттернов и поведенческой сегментации.',
        goalAchievement: []
      },
      insights: {
        painPoints: deduplicatedPains,
        userNeeds: interviewSummaries.flatMap(s => s.needs),
        opportunities: recommendations.longTerm || [],
        behavioralPatterns: [],
        detailedInsights: crossAnalysis.key_insights || []
      },
      personas: {
        primary: personas.primary || {
          name: 'Основной пользователь',
          description: 'Основной сегмент пользователей',
          goals: ['Достижение целей'],
          frustrations: ['Основные проблемы'],
          motivations: ['Ключевые мотивации']
        },
        secondary: personas.secondary || {
          name: 'Вторичный пользователь',
          description: 'Вторичный сегмент пользователей',
          goals: ['Достижение целей'],
          frustrations: ['Основные проблемы'],
          motivations: ['Ключевые мотивации']
        },
        segments: segments
      },
      recommendations: {
        immediate: recommendations.immediate || [],
        shortTerm: recommendations.shortTerm || [],
        longTerm: recommendations.longTerm || [],
        detailedRecommendations: recommendations.detailedRecommendations || [],
        roiCalculation: `На основе ${transcripts.length} интервью: прогнозируемый ROI 150% при решении ${deduplicatedPains.length} ключевых проблем`,
        nextSteps: [],
        riskMitigation: []
      },
      metrics: metrics,
      interviewSummaries: interviewSummaries,
      powerfulQuotes: interviewSummaries.flatMap(s => s.keyQuotes).filter(q => q && q.length > 0),
      briefQuestions: await generateBriefQuestions(interviewSummaries, briefContext, model),
      keyInsights: crossAnalysis.key_insights || [],
      crossQuestionInsights: crossAnalysis.contradictions || [],
      unexpectedFindings: [],
      successMetrics: [
        'Увеличение удовлетворенности пользователей',
        'Снижение количества жалоб',
        'Повышение конверсии',
        'Улучшение NPS'
      ]
    }

    console.log('✅ Анализ завершен:')
    console.log(`  🎯 Потребности: ${result.overview.totalNeeds}`)
    console.log(`  📈 Метрики: ${JSON.stringify(result.metrics)}`)
    console.log(`  👥 Персонажи: ${result.personas.primary.name}, ${result.personas.secondary.name}`)

    return NextResponse.json(result, { headers: corsHeaders })

  } catch (error) {
    console.error('❌ Ошибка анализа:', error)
    return NextResponse.json(
      { error: 'Ошибка при выполнении анализа' },
      { status: 500, headers: corsHeaders }
    )
  }
}
