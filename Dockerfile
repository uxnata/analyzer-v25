FROM node:18-alpine

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем все зависимости (включая dev для сборки)
RUN npm ci

# Копируем исходный код
COPY . .

# Устанавливаем переменную окружения для отключения SWC
ENV NEXT_DISABLE_SWC=1
ENV NEXT_TELEMETRY_DISABLED=1

# Собираем приложение
RUN npm run build

# Удаляем dev зависимости для оптимизации образа
RUN npm prune --production

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"]
