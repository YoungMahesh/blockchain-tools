import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import useStore from '../backend/zustand/store'


export default function SelectedListItem() {
	const [selectedIndex, setSelectedIndex] = React.useState('0x4');
	const chainId = useStore(state => state.chainId)

	React.useEffect(() => {
		const currChain = '0x' + chainId.toString(16)
		setSelectedIndex(currChain)
	}, [chainId])

	const handleListItemClick = async (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>,
		index: number,
		chainId: string
	) => {
		await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId }] })
	};

	return (
		<Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
			<List component="nav" aria-label="main mailbox folders">
				<ListItemButton
					selected={selectedIndex === '0x89'}
					onClick={(event) => handleListItemClick(event, 0, '0x89')}
				>
					<ListItemIcon>
						<InboxIcon />
					</ListItemIcon>
					<ListItemText primary="Polygon Mainnet" />
				</ListItemButton>
				<ListItemButton
					selected={selectedIndex === '0x63564c40'}
					onClick={(event) => handleListItemClick(event, 0, '0x63564c40')}
				>
					<ListItemIcon>
						<InboxIcon />
					</ListItemIcon>
					<ListItemText primary="Harmony One" />
				</ListItemButton>
				<ListItemButton
					selected={selectedIndex === '0xfa'}
					onClick={(event) => handleListItemClick(event, 1, '0xfa')}
				>
					<ListItemIcon>
						<InboxIcon />
					</ListItemIcon>
					<ListItemText primary="Fantom Opera" />
				</ListItemButton>
			</List>
			<Divider />
			<List component="nav" aria-label="secondary mailbox folder">
				<ListItemButton
					selected={selectedIndex === '0x13881'}
					onClick={(event) => handleListItemClick(event, 2, '0x13881')}
				>
					<ListItemIcon>
						<InboxIcon />
					</ListItemIcon>
					<ListItemText primary="Polygon Testnet" />
				</ListItemButton>
				<ListItemButton
					selected={selectedIndex === '0x6357d2e0'}
					onClick={(event) => handleListItemClick(event, 2, '0x6357d2e0')}
				>
					<ListItemIcon>
						<InboxIcon />
					</ListItemIcon>
					<ListItemText primary="Harmony Testnet" />
				</ListItemButton>
				<ListItemButton
					selected={selectedIndex === '0xfa2'}
					onClick={(event) => handleListItemClick(event, 3, '0xfa2')}
				>
					<ListItemIcon>
						<InboxIcon />
					</ListItemIcon>
					<ListItemText primary="Fantom Testnet" />
				</ListItemButton>
			</List>
		</Box>
	);
}
