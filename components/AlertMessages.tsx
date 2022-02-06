import { Box, Typography } from '@mui/material'
import useStore from '../backend/zustand/store'

export default function AlertMessages({ message1 }) {
  const chainIdMsg = useStore((state) => state.chainIdMsg)
  const walletMsg = useStore((state) => state.walletMsg)

  return (
    <Box>
      {chainIdMsg.length > 0 && <Typography>{chainIdMsg}</Typography>}
      {walletMsg.length > 0 && <Typography>{walletMsg}</Typography>}
      {message1.length > 0 && <Typography>{message1}</Typography>}
    </Box>
  )
}
