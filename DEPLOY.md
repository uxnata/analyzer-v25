# 🚀 Деплой на Railway

## Быстрый деплой (10 минут)

### 1. Подготовка GitHub
```bash
# Создать новый репозиторий на GitHub
# Загрузить весь код проекта
```

### 2. Railway деплой
1. Зайти на [railway.app](https://railway.app)
2. Войти через GitHub
3. Нажать "New Project" → "Deploy from GitHub repo"
4. Выбрать ваш репозиторий
5. Railway автоматически определит Next.js проект

### 3. Настройка переменных окружения
В настройках проекта добавить:
- `OPENROUTER_API_KEY` = ваш API ключ
- `NEXT_PUBLIC_APP_NAME` = "Analyzer V25.0"

### 4. Деплой
Railway автоматически:
- Установит зависимости
- Соберет проект
- Запустит на порту 3000

### 5. Получить ссылку
Railway даст ссылку типа: `your-app.railway.app`

## Структура проекта
- Frontend: Next.js (порт 3000)
- API: Next.js API routes
- Python: для анализа (через API)

## Требования
- Node.js 18+
- Python 3.8+
- OpenRouter API ключ
