import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import MenuIcon from '@mui/icons-material/Menu'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import useStore from '../../backend/zustand/store'
import { loadWeb3 } from '../../backend/common/web3Provider'
import useStore0 from './store0'

const drawerWidth = 240

interface Props {
  children?: (page: ReactElement) => ReactNode
}

export default function Header(props: Props) {
  const mobileOpen = useStore0((state) => state.mobileOpen)
  const setMobileOpen = useStore0((state) => state.setMobileOpen)
  const [wallet2, setWallet2] = useState('Connect Wallet')

  const setChainId = useStore((state) => state.setChainId)
  const setChainIdMsg = useStore((state) => state.setChainIdMsg)

  const wallet = useStore((state) => state.wallet)
  const setWallet = useStore((state) => state.setWallet)
  const setWalletMsg = useStore((state) => state.setWalletMsg)

  useEffect(() => {
    loadWeb3(setWallet, setChainId, setChainIdMsg, setWalletMsg)
  }, [])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const connectToWallet = async () => {
    if (window.ethereum)
      await window.ethereum.request({ method: 'eth_requestAccounts' })
    else
      window.open(
        'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en'
      )
  }

  useEffect(() => {
    if (wallet.length > 0)
      setWallet2(`${wallet.slice(0, 5)}...${wallet.slice(38, 42)}`)
    else setWallet2('Connect Wallet')
  }, [wallet])

  return (
    <>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              flexWrap: 'wrap',
              justifyContent: 'space-between'
            }}
          >
            <Typography variant="h6" noWrap component="div">
              BlockChain Tools (Beta)
            </Typography>
            <Button
              onClick={connectToWallet}
              variant="contained"
              sx={{ background: '#293241' }}
            >
              {wallet2}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  )
}
