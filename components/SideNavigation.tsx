import * as React from 'react';
import {
	AppBar, Box, CssBaseline, Divider, Drawer,
	IconButton, List, ListItem, ListItemIcon, ListItemText,
	Toolbar, Typography
} from '@mui/material'
import { Diamond as DiamondIcon, Menu as MenuIcon, Lock as LockIcon, Send as SendIcon } from '@mui/icons-material'
import type { ReactElement, ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router';
import NetworkList from './NetworkList';

const drawerWidth = 240;

interface Props {
	/**
	 * Injected by the documentation to work in an iframe.
	 * You won't need it on your project.
	 */
	window?: () => Window;
	children?: (page: ReactElement) => ReactNode
}

export default function SideNavigation(props: Props) {
	const { window } = props;
	const router = useRouter()
	const [mobileOpen, setMobileOpen] = React.useState(false);

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
			{/* <Divider />
			<List>
				{['All mail', 'Trash', 'Spam'].map((text, index) => (
					<ListItem button key={text}>
						<ListItemIcon>
							{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
						</ListItemIcon>
						<ListItemText primary={text} />
					</ListItem>
				))}
			</List> */}
		</div>
	);

	const container = window !== undefined ? () => window().document.body : undefined;

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
					<Typography variant="h6" noWrap component="div">
						BlockChain Tools (Beta)
					</Typography>
				</Toolbar>
			</AppBar>
			<Box
				component="nav"
				sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
				aria-label="mailbox folders"
			>
				{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
				<Drawer
					container={container}
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


