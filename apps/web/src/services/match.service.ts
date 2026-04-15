import type { MatchResponse } from '../../../../shared/types/match.types'
import { API_BASE } from '../utils/api.utils'

/**
 * Запрос проверки соответствия резюме и вакансии через OpenRouter API.
 */
export async function checkMatch(
  resumeBase64: string,
  vacancyBase64: string
): Promise<MatchResponse> {
  const res = await fetch(`${API_BASE}/api/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeBase64, vacancyBase64 }),
  })

  const resBody = await res.text()
  if (!res.ok) {
    const data = (()=>{try{return JSON.parse(resBody)}catch{return{}}})()
    throw new Error(data.error || `Ошибка: ${res.status}`)
  }

  return JSON.parse(resBody) as MatchResponse
}
