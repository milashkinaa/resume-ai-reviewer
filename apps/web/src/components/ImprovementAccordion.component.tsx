import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import WorkIcon from '@mui/icons-material/Work'
import ComputerIcon from '@mui/icons-material/Computer'
import PersonIcon from '@mui/icons-material/Person'
import BuildIcon from '@mui/icons-material/Build'

import type { ImprovementItem } from '../../../../shared/types/match.types'

export type ImprovementAccordionIcon =
  | 'warning'
  | 'water'
  | 'work'
  | 'computer'
  | 'person'
  | 'build'

const ICON_MAP: Record<ImprovementAccordionIcon, React.ComponentType> = {
  warning: WarningAmberIcon,
  water: WaterDropIcon,
  work: WorkIcon,
  computer: ComputerIcon,
  person: PersonIcon,
  build: BuildIcon,
}

export interface ImprovementAccordionProps {
  title: string
  items: ImprovementItem[]
  icons?: ImprovementAccordionIcon[]
}

export function ImprovementAccordion({
  title,
  items,
  icons = ['warning', 'water', 'work', 'computer', 'person', 'build'],
}: ImprovementAccordionProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        {title}
      </Typography>
      {items.map((item, index) => {
        const IconComponent =
          ICON_MAP[icons[index % icons.length]] ?? ICON_MAP.warning
        return (
          <Accordion
            key={index}
            sx={{
              boxShadow: 'none',
              border: '1px solid',
              borderColor: 'divider',
              '&:before': { display: 'none' },
              '&:not(:last-child)': { mb: 1 },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                '& .MuiAccordionSummary-content': {
                  alignItems: 'center',
                  gap: 1,
                },
              }}
            >
              <Box sx={{ color: 'text.secondary', fontSize: 20, flexShrink: 0, display: 'inline-flex', '& svg': { fontSize: 'inherit' } }}>
                <IconComponent />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {item.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ pl: 4.5 }}
              >
                {item.value}
              </Typography>
            </AccordionDetails>
          </Accordion>
        )
      })}
    </Box>
  )
}
