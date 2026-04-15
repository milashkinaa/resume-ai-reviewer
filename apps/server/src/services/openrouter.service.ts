import { getOpenRouterApiKey } from '../lib/env.js'
import type { MatchResponse } from '../types/match.types.js'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

/** Запрос 1: конвертация вакансии (PDF) в markdown */
export async function vacancyToMarkdown(base64: string): Promise<string> {
  const apiKey = getOpenRouterApiKey()
  const fileData = `data:application/pdf;base64,${base64}`

  const body = {
    model: 'openai/gpt-5',
    messages: [
      {
        role: 'system',
        content:
          'Ты извлекаешь текст вакансии из PDF, сохраненного с веб-страницы. Твоя задача — оставить только саму вакансию и удалить элементы сайта, которые не относятся к вакансии: меню, навигацию, кнопки, футер, хедер, рекламу, служебные блоки и другие элементы интерфейса. Сохраняй структуру и форматирование вакансии насколько это возможно в markdown: заголовки, списки, абзацы, переносы строк, секции и логические блоки. Не переписывай, не сокращай, не исправляй и не переформулируй текст вакансии. Не меняй ни одного слова внутри вакансии. Верни только markdown-текст вакансии без пояснений, без вводного текста, без комментариев и без markdown-кодового блока.',
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Вычлени вакансию с этого сохраненного в PDF сайта. Удали только элементы сайта, не относящиеся к вакансии. Сохрани форматирование вакансии насколько возможно: заголовки, списки, отступы, блоки, переносы строк и структуру секций. Текст вакансии не меняй. Верни только результат в markdown.',
          },
          {
            type: 'file',
            file: {
              filename: 'vacancy.pdf',
              file_data: fileData,
            },
          },
        ],
      },
    ],
    plugins: [
      {
        id: 'file-parser',
        pdf: { engine: 'mistral-ocr' },
      },
    ],
    temperature: 0,
    stream: false,
  }

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`OpenRouter vacancy: ${res.status} ${text}`)
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = data.choices?.[0]?.message?.content?.trim()
  if (!content) {
    throw new Error('Пустой ответ OpenRouter для вакансии')
  }
  return content
}

/** Запрос 2: конвертация резюме (PDF) в markdown */
export async function resumeToMarkdown(base64: string): Promise<string> {
  const apiKey = getOpenRouterApiKey()
  const fileData = `data:application/pdf;base64,${base64}`

  const body = {
    model: 'openai/gpt-5',
    messages: [
      {
        role: 'system',
        content:
          'Ты извлекаешь текст резюме из PDF. Твоя задача — оставить только сам текст резюме и удалить элементы, которые к нему не относятся: навигацию, кнопки, футер, хедер, рекламу, служебные блоки и другие элементы интерфейса. Сохраняй структуру и форматирование резюме насколько это возможно в markdown: заголовки, списки, абзацы, переносы строк, секции и логические блоки. Не переписывай, не сокращай, не исправляй и не переформулируй текст резюме. Не меняй ни одного слова внутри резюме. Верни только markdown-текст резюме без пояснений, без вводного текста, без комментариев и без markdown-кодового блока.',
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Вычлени текст резюме из этого PDF. Удали только элементы, не относящиеся к резюме. Сохрани форматирование резюме насколько возможно: заголовки, списки, отступы, блоки, переносы строк и структуру секций. Текст резюме не меняй. Верни только результат в markdown.',
          },
          {
            type: 'file',
            file: {
              filename: 'resume.pdf',
              file_data: fileData,
            },
          },
        ],
      },
    ],
    plugins: [
      {
        id: 'file-parser',
        pdf: { engine: 'mistral-ocr' },
      },
    ],
    temperature: 0,
    stream: false,
  }

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`OpenRouter resume: ${res.status} ${text}`)
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = data.choices?.[0]?.message?.content?.trim()
  if (!content) {
    throw new Error('Пустой ответ OpenRouter для резюме')
  }
  return content
}

/** Запрос 3: сравнение resume.md и vacancy.md, возврат JSON */
export async function compareResumeAndVacancy(
  resumeMd: string,
  vacancyMd: string
): Promise<MatchResponse> {
  const apiKey = getOpenRouterApiKey()

  const body = {
    model: 'openai/gpt-5.4',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Ты профессиональный карьерный консультант на рынке РФ.\n\nЯ прикрепляю тебе свое резюме и вакансию, на которую я планирую подаваться.\nОцени, насколько мое резюме подходит под эту вакансию по заданным критериям.\n\nУсловия:\n- Не упоминать ФИО кандидата в советах.\n- Разделить советы на resumeImprovements и knowledgeImprovements.\n- В knowledgeImprovements писать вежливо.\n- Никакого текста в ответе не присылай, только JSON-объект.',
          },
          {
            type: 'text',
            text: `Файл 1: resume.md\n\n\`\`\`md\n${resumeMd}\n\`\`\``,
          },
          {
            type: 'text',
            text: `Файл 2: vacancy.md\n\n\`\`\`md\n${vacancyMd}\n\`\`\``,
          },
        ],
      },
    ],
    plugins: [{ id: 'response-healing' }],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'resume_vacancy_review',
        strict: true,
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            resumeImprovements: {
              type: 'array',
              maxItems: 10,
              items: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  title: { type: 'string', maxLength: 35 },
                  value: { type: 'string' },
                },
                required: ['title', 'value'],
              },
            },
            knowledgeImprovements: {
              type: 'array',
              maxItems: 10,
              items: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  title: { type: 'string', maxLength: 35 },
                  value: { type: 'string' },
                },
                required: ['title', 'value'],
              },
            },
          },
          required: ['resumeImprovements', 'knowledgeImprovements'],
        },
      },
    },
    temperature: 0.2,
    stream: false,
  }

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`OpenRouter compare: ${res.status} ${text}`)
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = data.choices?.[0]?.message?.content?.trim()
  if (!content) {
    throw new Error('Пустой ответ OpenRouter для сравнения')
  }

  const parsed = JSON.parse(content) as MatchResponse
  if (
    !Array.isArray(parsed.resumeImprovements) ||
    !Array.isArray(parsed.knowledgeImprovements)
  ) {
    throw new Error('Некорректная структура ответа OpenRouter')
  }
  return parsed
}
