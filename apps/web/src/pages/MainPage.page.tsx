import { useState, useCallback, useEffect } from 'react'
import { Box, IconButton, Snackbar, Alert } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

import { ResumeMatchFeature } from '../features/resume-match/ResumeMatchFeature.component'
import { useMatchCheck } from '../hooks/useMatchCheck'
import { usePdfCache } from '../hooks/usePdfCache'
import type { FileInputValue } from '../components/FileInput.component'

export function MainPage() {
  const [resumeValue, setResumeValue] = useState<FileInputValue>(null)
  const [vacancyValue, setVacancyValue] = useState<FileInputValue>(null)
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null)

  const resumeCache = usePdfCache(resumeValue)
  const vacancyCache = usePdfCache(vacancyValue)
  const { isLoading, result, checkMatch, reset, error } = useMatchCheck()

  useEffect(() => {
    const err = resumeCache.error || vacancyCache.error || error
    setSnackbarMessage(err?.message ?? null)
  }, [resumeCache.error, vacancyCache.error, error])

  const handleCheckMatch = useCallback(() => {
    if (resumeCache.base64 && vacancyCache.base64) {
      checkMatch(resumeCache.base64, vacancyCache.base64)
    }
  }, [checkMatch, resumeCache.base64, vacancyCache.base64])

  const handleReset = useCallback(() => {
    reset()
    setResumeValue(null)
    setVacancyValue(null)
  }, [reset])

  const isCheckDisabled =
    !resumeCache.base64 ||
    !vacancyCache.base64 ||
    resumeCache.isLoading ||
    vacancyCache.isLoading ||
    isLoading ||
    result !== null

  /** Инпуты disabled только после получения результата (чтобы можно было вставлять ссылки и прикреплять файлы) */
  const isInputDisabled = result !== null

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box component="span" sx={{ fontWeight: 600, fontSize: '1.125rem' }}>
          Resume AI Reviewer
        </Box>
        <IconButton aria-label="Меню" size="small">
          <MenuIcon />
        </IconButton>
      </Box>

      <ResumeMatchFeature
        resumeValue={resumeValue}
        vacancyValue={vacancyValue}
        onResumeChange={setResumeValue}
        onVacancyChange={setVacancyValue}
        onCheckMatch={handleCheckMatch}
        onReset={handleReset}
        isLoading={isLoading}
        result={result}
        isCheckDisabled={isCheckDisabled}
        isInputDisabled={isInputDisabled}
        resumeInputLoading={resumeCache.isLoading}
        vacancyInputLoading={vacancyCache.isLoading}
      />

      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={6000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarMessage(null)}
          severity="error"
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}
