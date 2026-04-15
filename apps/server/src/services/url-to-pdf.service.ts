import { getPdfBoltApiKey } from '../lib/env.js'

const PDFBOLT_URL = 'https://api.pdfbolt.com/v1/direct'
const REQUEST_TIMEOUT_MS = 60000

/** Валидация URL */
function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/** Конвертирует веб-страницу по URL в PDF через PDFBolt API и возвращает base64 */
export async function urlToPdfService(url: string): Promise<string> {
  if (!isValidUrl(url)) {
    throw new Error('Некорректный URL')
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const res = await fetch(PDFBOLT_URL, {
      method: 'POST',
      headers: {
        'API-KEY': getPdfBoltApiKey(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        format: 'A4',
        printBackground: true,
        isEncoded: true,
      }),
      signal: controller.signal,
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`PDFBolt: ${res.status} ${text}`)
    }

    const base64 = await res.text()
    if (!base64) {
      throw new Error('PDFBolt вернул пустой ответ')
    }
    return base64
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        throw new Error('Таймаут конвертации URL в PDF')
      }
      throw err
    }
    throw new Error('Ошибка конвертации URL в PDF')
  } finally {
    clearTimeout(timeoutId)
  }
}
