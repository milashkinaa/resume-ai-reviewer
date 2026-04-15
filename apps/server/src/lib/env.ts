import 'dotenv/config'

/** API-ключ OpenRouter. Читается из переменной окружения. */
export function getOpenRouterApiKey(): string {
  const key = process.env.OPENROUTER_API_KEY
  if (!key) {
    throw new Error('OPENROUTER_API_KEY не задан в .env')
  }
  return key
}

/** API-ключ PDFBolt. Читается из переменной окружения. */
export function getPdfBoltApiKey(): string {
  const key = process.env.PDFBOLT_API_KEY
  if (!key) {
    throw new Error('PDFBOLT_API_KEY не задан в .env')
  }
  return key
}
