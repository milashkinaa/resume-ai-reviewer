import { useRef } from 'react'
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  type SxProps,
} from '@mui/material'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import WorkIcon from '@mui/icons-material/Work'

export type FileInputValue = File | string | null

export type FileInputIcon = 'pin' | 'briefcase'

const ICON_MAP = {
  pin: AttachFileIcon,
  briefcase: WorkIcon,
}

export interface FileInputProps {
  label: string
  icon: FileInputIcon
  value: FileInputValue
  onChange: (value: FileInputValue) => void
  placeholder?: string
  disabled?: boolean
  /** Показывать индикатор загрузки при конвертации URL */
  isLoading?: boolean
  sx?: SxProps
}

export function FileInput({
  label,
  icon,
  value,
  onChange,
  placeholder = 'PDF или ссылка',
  disabled = false,
  isLoading = false,
  sx,
}: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const IconComponent = ICON_MAP[icon]

  const displayValue =
    value instanceof File ? value.name : typeof value === 'string' ? value : ''

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      onChange(file)
    }
    e.target.value = ''
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.trim()
    onChange(text || null)
  }

  const handleIconClick = () => {
    inputRef.current?.click()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file?.type === 'application/pdf') {
      onChange(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  return (
    <Box sx={sx}>
      <Typography
        variant="body1"
        sx={{ mb: 1, fontWeight: 500, color: 'text.primary' }}
      >
        {label}
      </Typography>
      <Box
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          bgcolor: 'background.paper',
          overflow: 'hidden',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <TextField
          fullWidth
          placeholder={placeholder}
          value={displayValue}
          onChange={handleTextChange}
          disabled={disabled}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment
                position="start"
                sx={{
                  cursor: disabled ? 'default' : 'pointer',
                  opacity: disabled ? 0.5 : 1,
                }}
                onClick={disabled ? undefined : handleIconClick}
              >
                {isLoading ? (
                  <Box
                    component="span"
                    sx={{
                      width: 24,
                      height: 24,
                      border: '2px solid',
                      borderColor: 'text.secondary',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                      '@keyframes spin': {
                        to: { transform: 'rotate(360deg)' },
                      },
                    }}
                  />
                ) : (
                  <IconComponent sx={{ color: 'text.secondary', fontSize: 24 }} />
                )}
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiInputBase-root': {
              py: 1.5,
              px: 1.5,
            },
          }}
        />
      </Box>
    </Box>
  )
}
