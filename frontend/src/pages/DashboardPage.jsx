import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Flame } from 'lucide-react'

export default function DashboardPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 64px)',
        gap: 3,
      }}
    >
      <Flame size={64} color="#e74c3c" />
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          background: 'linear-gradient(135deg, #e74c3c, #f39c12, #f1c40f)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        IGNIS Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary">
        AI-Powered Industrial Fire Surveillance — Phase 0 Setup Complete
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.5 }}>
        Map, charts, and classified hotspot markers will be added in Phase 9
      </Typography>
    </Box>
  )
}
