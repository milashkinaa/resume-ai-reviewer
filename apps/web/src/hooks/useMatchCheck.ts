import { useState, useCallback } from 'react'
import { checkMatch } from '../services/match.service'
import type { MatchResponse } from '../../../../shared/types/match.types'

export interface UseMatchCheckReturn {
  isLoading: boolean
  result: MatchResponse | null
  error: Error | null
  checkMatch: (resumeBase64: string, vacancyBase64: string) => Promise<void>
  reset: () => void
}

export function useMatchCheck(): UseMatchCheckReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<MatchResponse | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const performCheck = useCallback(
    async (resumeBase64: string, vacancyBase64: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await checkMatch(resumeBase64, vacancyBase64)
        setResult(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Ошибка проверки'))
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return {
    isLoading,
    result,
    error,
    checkMatch: performCheck,
    reset,
  }
}
