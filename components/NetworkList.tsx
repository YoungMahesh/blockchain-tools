import * as React from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import Divider from '@mui/material/Divider'
import InboxIcon from '@mui/icons-material/Inbox'
import useStore from '../backend/zustand/store'

export default function SelectedListItem() {
  const chainId = useStore((state) => state.chainId)

  const handleListItemClick = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    chainId: number
  ) => {
    const currChain = '0x' + chainId.toString(16)
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: currChain }]
    })
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <List
        component="nav"
        aria-label="main mailbox folders"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Supported Networks
          </ListSubheader>
        }
      >
        {[
          { networkName: 'Polygon Mainnet', networkId: 137 },
          { networkName: 'Harmony One', networkId: 1666600000 },
          { networkName: 'Fantom Opera', networkId: 250 }
        ].map((obj1, idx) => (
          <ListItemButton
            key={idx}
            selected={chainId === obj1.networkId}
            onClick={(event) => handleListItemClick(event, obj1.networkId)}
          >
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary={obj1.networkName} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <List component="nav" aria-label="main mailbox folders">
        {[
          { networkName: 'Rinkeby Testnet', networkId: 4 },
          { networkName: 'Polygon Testnet', networkId: 80001 },
          { networkName: 'Harmony Testnet', networkId: 1666700000 },
          { networkName: 'Fantom Testnet', networkId: 4002 }
        ].map((obj1, idx) => (
          <ListItemButton
            key={idx}
            selected={chainId === obj1.networkId}
            onClick={(event) => handleListItemClick(event, obj1.networkId)}
          >
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary={obj1.networkName} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  )
}
