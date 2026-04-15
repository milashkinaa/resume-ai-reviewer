import { useState, useEffect } from 'react'
import type { FileInputValue } from '../components/FileInput.component'
import { API_BASE } from '../utils/api.utils'

/** Проверка, является ли строка URL */
function isUrl(str: string): boolean {
  try {
    const url = new URL(str)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/** Чтение File в base64 (без префикса data:application/pdf;base64,) */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.replace(/^data:application\/pdf;base64,/, '')
      resolve(base64)
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

/** Запрос конвертации URL в PDF base64 */
async function urlToBase64(url: string): Promise<string> {
  const res = await fetch(`${API_BASE}/api/url-to-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })
  const resBody = await res.text()
  if (!res.ok) {
    const data = (() => {
      try {
        return JSON.parse(resBody)
      } catch {
        return {}
      }
    })()
    throw new Error(data.error || `Ошибка: ${res.status}`)
  }
  const data = (() => {
    try {
      return JSON.parse(resBody)
    } catch {
      return {}
    }
  })() as { base64?: string }
  return data.base64 ?? ''
}

export interface UsePdfCacheReturn {
  base64: string | null
  isLoading: boolean
  error: Error | null
}

/**
 * Конвертирует File или URL в base64 и кэширует результат.
 * File — через FileReader, URL — через POST /api/url-to-pdf.
 */
export function usePdfCache(value: FileInputValue): UsePdfCacheReturn {
  const [base64, setBase64] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!value) {
      setBase64(null)
      setIsLoading(false)
      setError(null)
      return
    }

    let cancelled = false

    const run = async () => {
      setIsLoading(true)
      setError(null)
      try {
        if (value instanceof File) {
          const b64 = await fileToBase64(value)
          if (!cancelled) setBase64(b64)
        } else if (typeof value === 'string' && isUrl(value)) {
          const b64 = await urlToBase64(value)
          if (!cancelled) setBase64(b64)
        } else {
          if (!cancelled) setBase64(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Ошибка конвертации'))
          setBase64(null)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [value])

  return { base64, isLoading, error }
}
