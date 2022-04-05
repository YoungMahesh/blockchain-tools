import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import useStore0 from './store0'
import { useState, useEffect } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import Drawer from '@mui/material/Drawer'
import CssBaseline from '@mui/material/CssBaseline'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Link from 'next/link'
import { useRouter } from 'next/router'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import DiamondIcon from '@mui/icons-material/Diamond'
import LockIcon from '@mui/icons-material/Lock'
import SendIcon from '@mui/icons-material/Send'
import useStore from '../../backend/zustand/store'
import { loadWeb3 } from '../../backend/common/web3Provider'

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
  const router = useRouter()
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

  const theme = useTheme()
  const [open, setOpen] = useState(false)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
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
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {[
            { title: 'MultiSender', path: '/', icon: 'sendIcon' },
            { title: 'Locker', path: '/locker', icon: 'lockIcon' },
            { title: 'My Locks', path: '/mylocks', icon: 'lockIcon' },
            // { title: 'Faucet', path: '/faucet', icon: 'diamondIcon' },
            { title: 'Converter', path: '/converter', icon: 'autoRenewIcon' }
          ].map((obj1, index) => (
            <Link href={obj1.path} key={obj1.title}>
              <a>
                <ListItem button selected={router.pathname === obj1.path}>
                  <ListItemIcon>
                    {obj1.icon === 'lockIcon' && <LockIcon />}
                    {obj1.icon === 'sendIcon' && <SendIcon />}
                    {/* {obj1.icon === 'diamondIcon' && <DiamondIcon />} */}
                    {obj1.icon === 'autoRenewIcon' && <AutorenewIcon />}
                  </ListItemIcon>
                  <ListItemText primary={obj1.title} />
                </ListItem>
              </a>
            </Link>
          ))}
        </List>
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
    </Box>
  )
}
