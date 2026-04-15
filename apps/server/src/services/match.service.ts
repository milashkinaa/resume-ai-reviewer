import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'
import {
  vacancyToMarkdown,
  resumeToMarkdown,
  compareResumeAndVacancy,
} from './openrouter.service.js'
import type { MatchResponse } from '../types/match.types.js'

/** Папка для сохранения последних resume.md и vacancy.md при отладке */
const DEBUG_OUTPUT_DIR = 'docs/debug'

/**
 * Сохраняет последние resume.md и vacancy.md в docs/debug для отладки.
 * Выполняется асинхронно, ошибки не прерывают основной поток.
 */
async function saveDebugMarkdown(resumeMd: string, vacancyMd: string): Promise<void> {
  try {
    const dir = join(process.cwd(), DEBUG_OUTPUT_DIR)
    await mkdir(dir, { recursive: true })
    await Promise.all([
      writeFile(join(dir, 'resume.md'), resumeMd, 'utf-8'),
      writeFile(join(dir, 'vacancy.md'), vacancyMd, 'utf-8'),
    ])
  } catch {
    // Игнорируем ошибки записи — это только для отладки
  }
}

/**
 * Оркестрация: конвертация vacancy и resume в markdown,
 * затем сравнение через OpenRouter.
 */
export async function matchService(
  resumeBase64: string,
  vacancyBase64: string
): Promise<MatchResponse> {
  const [vacancyMd, resumeMd] = await Promise.all([
    vacancyToMarkdown(vacancyBase64),
    resumeToMarkdown(resumeBase64),
  ])

  // Сохраняем последние markdown-файлы для отладки
  void saveDebugMarkdown(resumeMd, vacancyMd)

  return compareResumeAndVacancy(resumeMd, vacancyMd)
}
