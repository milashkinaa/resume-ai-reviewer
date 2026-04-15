# Resume AI Reviewer

Приложение для проверки соответствия резюме и вакансии через OpenRouter API.

## Требования

- Node.js 18+

## Установка

```bash
npm install
```

### Переменные окружения

Скопируйте `.env.example` в `.env` в папке `apps/server`:

```bash
cp apps/server/.env.example apps/server/.env
```

Заполните в `apps/server/.env`:
- `OPENROUTER_API_KEY` — для конвертации в Markdown и сравнения
- `PDFBOLT_API_KEY` — для конвертации URL в PDF

## Запуск

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3004

## Использование

1. Вставьте резюме и вакансию — PDF-файл или ссылку на страницу.
2. Нажмите «Проверить наш мэтч».
3. Через 30–60 секунд получите рекомендации по улучшению резюме и навыкам.
