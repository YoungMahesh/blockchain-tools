import {
	AppBar, Box, CssBaseline, Divider, Drawer,
	IconButton, List, ListItem, ListItemIcon, ListItemText,
	Toolbar, Typography, Button
} from '@mui/material'
import { Diamond as DiamondIcon, Menu as MenuIcon, Lock as LockIcon, Send as SendIcon } from '@mui/icons-material'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router';
import NetworkList from './NetworkList';
import useStore from '../backend/zustand/store'
import { loadWeb3 } from '../backend/api/web3Provider';

const drawerWidth = 240;

interface Props {
	children?: (page: ReactElement) => ReactNode
}

export default function SideNavigation(props: Props) {
	const router = useRouter()
	const [mobileOpen, setMobileOpen] = useState(false)
	const [wallet2, setWallet2] = useState('Connect Wallet')

	const setChainId = useStore(state => state.setChainId)
	const setChainIdMsg = useStore(state => state.setChainIdMsg)

	const wallet = useStore(state => state.wallet)
	const setWallet = useStore(state => state.setWallet)
	const setWalletMsg = useStore(state => state.setWalletMsg)

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
			window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en')
	}

	useEffect(() => {
		if (wallet.length > 0) setWallet2(`${wallet.slice(0, 5)}...${wallet.slice(38, 42)}`)
		else setWallet2('Connect Wallet')
	}, [wallet])

	const drawer = (
		<div>
			<Toolbar />
			<Divider />
			<List>
				{[
					{ title: 'MultiSender', path: '/', icon: 'sendIcon' },
					{ title: 'Locker', path: '/locker', icon: 'lockIcon' },
					{ title: 'My Locks', path: '/mylocks', icon: 'lockIcon' },
					{ title: 'Faucet', path: '/faucet', icon: 'diamondIcon' }
				].map((obj1, index) => (
					<Link href={obj1.path} key={obj1.title} passHref>
						<ListItem button selected={router.pathname === obj1.path}>
							<ListItemIcon>
								{/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
								{obj1.icon === 'lockIcon' && <LockIcon />}
								{obj1.icon === 'sendIcon' && <SendIcon />}
								{obj1.icon === 'diamondIcon' && <DiamondIcon />}
							</ListItemIcon>
							<ListItemText primary={obj1.title} />
						</ListItem>
					</Link>
				))}
			</List>
		</div>
	)

	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<AppBar
				position="fixed"
				sx={{
					width: { sm: `calc(100% - ${drawerWidth}px)` },
					ml: { sm: `${drawerWidth}px` },
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
					<Box sx={{ display: 'flex', width: '100%', flexWrap: 'wrap', justifyContent: 'space-between' }}>
						<Typography variant="h6" noWrap component="div">
							BlockChain Tools (Beta)
						</Typography>
						<Button onClick={connectToWallet} variant="contained" sx={{ background: '#293241' }}>
							{wallet2}
						</Button>
					</Box>
				</Toolbar>
			</AppBar>
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
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						display: { xs: 'block', sm: 'none' },
						'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
					}}
				>
					{drawer}
				</Drawer>
				<Drawer
					variant="permanent"
					sx={{
						display: { xs: 'none', sm: 'block' },
						'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
					}}
					open
				>
					{drawer}
				</Drawer>
			</Box>
			<Box
				component="main"
				sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
			>
				<Toolbar />
				<Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
					{props.children}
					<NetworkList />
				</Box>

			</Box>
		</Box>
	)
}


