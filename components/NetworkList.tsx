import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';

export default function SelectedListItem() {
	const [selectedIndex, setSelectedIndex] = React.useState(1);

	const handleListItemClick = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>,
		index: number,
	) => {
		setSelectedIndex(index);
	};

	return (
		<Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
			<List component="nav" aria-label="main mailbox folders">
				<ListItemButton
					selected={selectedIndex === 0}
					onClick={(event) => handleListItemClick(event, 0)}
				>
					<ListItemIcon>
						<InboxIcon />
					</ListItemIcon>
					<ListItemText primary="Harmony One" />
				</ListItemButton>
				<ListItemButton
					selected={selectedIndex === 1}
					onClick={(event) => handleListItemClick(event, 1)}
				>
					<ListItemIcon>
						<DraftsIcon />
					</ListItemIcon>
					<ListItemText primary="Fantom Opera" />
				</ListItemButton>
			</List>
			<Divider />
			<List component="nav" aria-label="secondary mailbox folder">
				<ListItemButton
					selected={selectedIndex === 2}
					onClick={(event) => handleListItemClick(event, 2)}
				>
					<ListItemIcon>
						<DraftsIcon />
					</ListItemIcon>
					<ListItemText primary="Harmony Testnet" />
				</ListItemButton>
				<ListItemButton
					selected={selectedIndex === 3}
					onClick={(event) => handleListItemClick(event, 3)}
				>
					<ListItemIcon>
						<DraftsIcon />
					</ListItemIcon>
					<ListItemText primary="Fantom Testnet" />
				</ListItemButton>
			</List>
		</Box>
	);
}
