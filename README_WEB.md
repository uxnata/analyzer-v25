# UX Analyzer V25.0 - Web Interface

Современный веб-интерфейс для UX Analyzer в стиле Reporter Dashboard, готовый к деплою на Vercel.

## 🚀 Особенности

- **Next.js 14** с App Router
- **TypeScript** для типобезопасности
- **Tailwind CSS** для стилизации
- **Lucide React** для иконок
- **Responsive дизайн** для всех устройств
- **Прогресс-индикатор** пошагового процесса
- **Drag & Drop** загрузка файлов
- **Демо данные** для тестирования

## 🛠️ Технологии

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, CSS Variables
- **Icons**: Lucide React
- **Deployment**: Vercel (готово к деплою)

## 📦 Установка

1. **Клонируйте репозиторий:**
```bash
git clone <your-repo>
cd analyzer
```

2. **Установите зависимости:**
```bash
npm install
# или
yarn install
# или
pnpm install
```

3. **Запустите в режиме разработки:**
```bash
npm run dev
# или
yarn dev
# или
pnpm dev
```

4. **Откройте [http://localhost:3000](http://localhost:3000)**

## 🚀 Деплой на Vercel

1. **Подключите репозиторий к Vercel**
2. **Настройте переменные окружения:**
   - `OPENROUTER_API_KEY` - ваш API ключ OpenRouter
   - `NEXT_PUBLIC_APP_NAME` - название приложения

3. **Деплой автоматически запустится при push в main ветку**

## 🎨 Структура проекта

```
analyzer/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Главная страница
│   ├── layout.tsx         # Корневой layout
│   └── globals.css        # Глобальные стили
├── components/             # React компоненты
│   ├── BriefUpload.tsx    # Загрузка брифа
│   ├── TranscriptUpload.tsx # Загрузка транскриптов
│   ├── AnalysisRunner.tsx # Запуск анализа
│   ├── ResultsViewer.tsx  # Просмотр результатов
│   └── ReportGenerator.tsx # Генерация отчетов
├── lib/                    # Утилиты и хелперы
├── public/                 # Статические файлы
├── tailwind.config.js      # Конфигурация Tailwind
├── tsconfig.json           # Конфигурация TypeScript
└── package.json            # Зависимости
```

## 🔧 Настройка

### Переменные окружения

Создайте `.env.local` файл:

```env
OPENROUTER_API_KEY=sk-or-v1-your-api-key
NEXT_PUBLIC_APP_NAME=UX Analyzer
```

### API Endpoints

Приложение использует следующие API endpoints:

- `POST /api/analyze` - Запуск анализа
- `GET /api/status` - Статус анализа
- `POST /api/reports` - Генерация отчетов

## 🎯 Использование

### 1. Загрузка брифа
- Введите бриф вручную или загрузите файл
- Используйте пример для быстрого старта

### 2. Загрузка транскриптов
- Загрузите файлы или введите вручную
- Поддерживаются форматы: .txt, .md, .doc, .docx
- Рекомендуется минимум 3 интервью

### 3. Запуск анализа
- Выберите тип анализа (обычный/параллельный)
- Отслеживайте прогресс в реальном времени
- Получите уведомление о завершении

### 4. Просмотр результатов
- Анализируйте ключевые инсайты
- Изучайте точки боли и потребности
- Просматривайте поведенческие паттерны

### 5. Генерация отчетов
- Создавайте HTML, PDF, DOCX отчеты
- Экспортируйте данные в JSON
- Скачивайте готовые материалы

## 🎨 Дизайн

### Цветовая схема
- **Primary**: #030213 (темно-синий)
- **Secondary**: oklch(0.95 0.0058 264.53)
- **Accent**: #e9ebef (светло-серый)
- **Muted**: #ececf0 (нейтральный серый)

### Компоненты
- **Cards**: Современные карточки с тенями
- **Buttons**: Интерактивные кнопки с hover эффектами
- **Progress**: Визуальные индикаторы прогресса
- **Forms**: Стилизованные формы с валидацией

## 📱 Responsive Design

- **Mobile First** подход
- **Breakpoints**: sm, md, lg, xl, 2xl
- **Grid система** для адаптивных layouts
- **Touch-friendly** интерфейс

## 🚀 Производительность

- **Next.js Image Optimization**
- **Code Splitting** автоматически
- **Lazy Loading** для компонентов
- **Bundle Analysis** встроен

## 🔒 Безопасность

- **API Rate Limiting**
- **Input Validation**
- **XSS Protection**
- **CSRF Protection**

## 📊 Аналитика

- **Vercel Analytics** (опционально)
- **Performance Monitoring**
- **Error Tracking**
- **User Behavior Analytics**

## 🧪 Тестирование

```bash
# Запуск тестов
npm run test

# E2E тесты
npm run test:e2e

# Coverage отчет
npm run test:coverage
```

## 📝 Скрипты

```bash
# Разработка
npm run dev

# Сборка
npm run build

# Продакшн
npm run start

# Линтинг
npm run lint

# Type checking
npm run type-check
```

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature ветку
3. Внесите изменения
4. Создайте Pull Request

## 📄 Лицензия

MIT License - см. [LICENSE](LICENSE) файл

## 🆘 Поддержка

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: support@uxanalyzer.com

## 🔄 Обновления

Следите за обновлениями:

```bash
# Обновление зависимостей
npm update

# Проверка устаревших пакетов
npm outdated

# Обновление до последних версий
npm audit fix
```

---

**Создано с ❤️ для UX исследователей**

Версия: 25.0.0 | Последнее обновление: 2024
