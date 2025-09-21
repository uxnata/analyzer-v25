# Analyzer V25.0 - OpenRouter Edition

Веб-интерфейс для анализа пользовательского опыта с использованием AI через OpenRouter API.

## 🚀 Деплой на Vercel

### 1. Установка Vercel CLI
```bash
npm i -g vercel
```

### 2. Логин в Vercel
```bash
vercel login
```

### 3. Деплой проекта
```bash
vercel --prod
```

### 4. Настройка переменных окружения
В Vercel Dashboard добавьте:
- `OPENROUTER_API_KEY` - ваш API ключ OpenRouter

## 🛠️ Локальная разработка

```bash
npm install
npm run dev
```

Приложение будет доступно на http://localhost:3001

## ✨ Возможности

- 🔍 Анализ UX с помощью различных AI-моделей
- 📊 Детальные отчеты и инсайты
- 🎯 Выбор модели (Claude, GPT, Llama, Gemini)
- 📱 Адаптивный веб-интерфейс
- 💾 Сохранение состояния в localStorage

## 🎨 Технологии

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- OpenRouter API
