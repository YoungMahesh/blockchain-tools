import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import Drawer from '@mui/material/Drawer'
import CssBaseline from '@mui/material/CssBaseline'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import useStore from '../../backend/zustand/store'
import { loadWeb3 } from '../../backend/common/web3Provider'
import { ToastContainer } from 'react-toastify'

const drawerWidth = 240
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  })
}))

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end'
}))

export default function Layout({ children }: { children: any }) {
  const [wallet2, setWallet2] = useState('Connect Wallet')
  const setChainId = useStore((state) => state.setChainId)
  const setChainIdMsg = useStore((state) => state.setChainIdMsg)
  const wallet = useStore((state) => state.wallet)
  const setWallet = useStore((state) => state.setWallet)
  const setWalletMsg = useStore((state) => state.setWalletMsg)

  useEffect(() => {
    loadWeb3(setWallet, setChainId, setChainIdMsg, setWalletMsg)
  }, [])

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

  const open = false
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              flexWrap: 'wrap',
              justifyContent: 'space-between'
            }}
          >
            <Typography variant="h6" noWrap component="div">
              Blockchain Tools
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
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box'
          }
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Divider />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap'
          }}
        >
          {children}
        </Box>
      </Main>
      <ToastContainer />
    </Box>
  )
}
