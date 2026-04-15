import { Box, Button, Typography } from '@mui/material'
import HandshakeIcon from '@mui/icons-material/Handshake'
import DownloadIcon from '@mui/icons-material/Download'
import RefreshIcon from '@mui/icons-material/Refresh'
import InfoIcon from '@mui/icons-material/Info'

import { FileInput, type FileInputValue } from '../../components/FileInput.component'
import { ImprovementAccordion } from '../../components/ImprovementAccordion.component'
import type { MatchResponse } from '../../../../../shared/types/match.types'

export interface ResumeMatchFeatureProps {
  resumeValue: FileInputValue
  vacancyValue: FileInputValue
  onResumeChange: (value: FileInputValue) => void
  onVacancyChange: (value: FileInputValue) => void
  onCheckMatch: () => void
  onReset: () => void
  isLoading: boolean
  result: MatchResponse | null
  isCheckDisabled: boolean
  /** Инпуты disabled только после получения результата */
  isInputDisabled?: boolean
  /** Индикатор загрузки при конвертации резюме (URL → PDF) */
  resumeInputLoading?: boolean
  /** Индикатор загрузки при конвертации вакансии (URL → PDF) */
  vacancyInputLoading?: boolean
}

export function ResumeMatchFeature({
  resumeValue,
  vacancyValue,
  onResumeChange,
  onVacancyChange,
  onCheckMatch,
  onReset,
  isLoading,
  result,
  isCheckDisabled,
  isInputDisabled = false,
  resumeInputLoading = false,
  vacancyInputLoading = false,
}: ResumeMatchFeatureProps) {
  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        px: 2,
        py: 3,
      }}
    >
      <FileInput
        label="Пришли нам свое резюме или ссылку на резюме"
        icon="pin"
        value={resumeValue}
        onChange={onResumeChange}
        placeholder="PDF или ссылка"
        disabled={isInputDisabled}
        isLoading={resumeInputLoading}
        sx={{ mb: 2 }}
      />

      <FileInput
        label="На какую вакансию хочешь подаваться?"
        icon="briefcase"
        value={vacancyValue}
        onChange={onVacancyChange}
        placeholder="PDF или ссылка"
        disabled={isInputDisabled}
        isLoading={vacancyInputLoading}
        sx={{ mb: 3 }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          disabled={isCheckDisabled}
          onClick={onCheckMatch}
          startIcon={
            isLoading ? (
              <Box
                component="span"
                sx={{
                  width: 20,
                  height: 20,
                  border: '2px solid',
                  borderColor: 'primary.contrastText',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  '@keyframes spin': {
                    to: { transform: 'rotate(360deg)' },
                  },
                }}
              />
            ) : (
              <HandshakeIcon />
            )
          }
          sx={{
            py: 1.5,
            px: 4,
            borderRadius: 6,
          }}
        >
          {isLoading ? 'Проверка...' : 'Проверить наш мэтч'}
        </Button>
      </Box>

      {result && (
        <Box sx={{ mt: 4 }}>
          <ImprovementAccordion
            title="Что улучшить в резюме:"
            items={result.resumeImprovements}
            icons={['warning', 'water', 'work']}
          />

          <ImprovementAccordion
            title="Каких навыков вам не хватает:"
            items={result.knowledgeImprovements}
            icons={['computer', 'person', 'build']}
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
              p: 2,
              mb: 2,
              bgcolor: '#ffecd2',
              borderRadius: 2,
              color: '#b45309',
            }}
          >
            <InfoIcon sx={{ mt: 0.25, flexShrink: 0 }} />
            <Typography variant="body2">
              Вы не обязаны соответствовать на 100%, но данному работодателю эти
              навыки могут быть полезны
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<DownloadIcon />}
            onClick={() => {}}
            sx={{ py: 1.5, mb: 1.5, borderRadius: 6 }}
          >
            Скачать рекомендации
          </Button>

          <Button
            variant="outlined"
            color="primary"
            fullWidth
            startIcon={<RefreshIcon />}
            onClick={onReset}
            sx={{ py: 1.5, borderRadius: 6 }}
          >
            Попробовать снова
          </Button>
        </Box>
      )}
    </Box>
  )
}
