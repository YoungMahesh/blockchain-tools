import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import DiamondIcon from '@mui/icons-material/Diamond'
import LockIcon from '@mui/icons-material/Lock'
import SendIcon from '@mui/icons-material/Send'
import { ReactElement, ReactNode, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useStore0 from './store0'

const drawerWidth = 240

interface Props {
  children?: (page: ReactElement) => ReactNode
}

export default function Drawer1(props: Props) {
  const router = useRouter()
  const mobileOpen = useStore0((state) => state.mobileOpen)
  const setMobileOpen = useStore0((state) => state.setMobileOpen)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {[
          { title: 'MultiSender', path: '/', icon: 'sendIcon' },
          { title: 'Locker', path: '/locker', icon: 'lockIcon' },
          { title: 'My Locks', path: '/mylocks', icon: 'lockIcon' },
          { title: 'Faucet', path: '/faucet', icon: 'diamondIcon' },
          { title: 'Converter', path: '/converter', icon: 'autoRenewIcon' }
        ].map((obj1, index) => (
          <Link href={obj1.path} key={obj1.title}>
            <a>
              <ListItem button selected={router.pathname === obj1.path}>
                <ListItemIcon>
                  {obj1.icon === 'lockIcon' && <LockIcon />}
                  {obj1.icon === 'sendIcon' && <SendIcon />}
                  {obj1.icon === 'diamondIcon' && <DiamondIcon />}
                  {obj1.icon === 'autoRenewIcon' && <AutorenewIcon />}
                </ListItemIcon>
                <ListItemText primary={obj1.title} />
              </ListItem>
            </a>
          </Link>
        ))}
      </List>
    </div>
  )

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth
          }
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth
          }
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  )
}
