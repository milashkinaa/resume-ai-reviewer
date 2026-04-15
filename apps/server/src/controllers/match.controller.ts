import type { Request, Response } from 'express'
import { matchService } from '../services/match.service.js'

/** POST /api/match: проверка соответствия резюме и вакансии через OpenRouter */
export async function matchController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { resumeBase64, vacancyBase64 } = req.body as {
      resumeBase64?: string
      vacancyBase64?: string
    }
    if (!resumeBase64 || !vacancyBase64) {
      res.status(400).json({
        error: 'Требуются поля resumeBase64 и vacancyBase64',
      })
      return
    }
    const result = await matchService(resumeBase64, vacancyBase64)
    res.json(result)
  } catch (err) {
    console.error('match error:', err)
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Ошибка проверки соответствия',
    })
  }
}
