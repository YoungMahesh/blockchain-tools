import { Box, Typography, Button } from '@mui/material'

export default function Footer() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        flexWrap: 'wrap'
      }}
    >
      <Button
        onClick={() =>
          window.open('https://github.com/YoungMahesh/blockchain-tools')
        }
      >
        Source Code
      </Button>
      <Button onClick={() => window.open('https://t.me/youngmahesh')}>
        Discuss Issues
      </Button>
    </Box>
  )
}
