import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import NetworkList from '../NetworkList'
import Drawer1 from './Drawer1'
import Header from './Header'
import useStore0 from './store0'

const drawerWidth = 240

export default function Layout({ children }) {
  const hideNetworks = useStore0((state) => state.hideNetworks)

  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <Drawer1 />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` }
        }}
      >
        <Toolbar />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap'
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}
