import type { Request, Response } from 'express'
import { urlToPdfService } from '../services/url-to-pdf.service.js'

/** POST /api/url-to-pdf: конвертирует URL страницы в PDF base64 */
export async function urlToPdfController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { url } = req.body as { url?: string }
    if (!url || typeof url !== 'string') {
      res.status(400).json({ error: 'Требуется поле url' })
      return
    }
    const base64 = await urlToPdfService(url)
    res.json({ base64 })
  } catch (err) {
    console.error('url-to-pdf error:', err)
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Ошибка конвертации URL в PDF',
    })
  }
}
