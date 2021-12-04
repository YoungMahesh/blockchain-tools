import SideNavigation from "./SideNavigation"
import { Box } from '@mui/material'

export default function Layout({ children }) {
	return (
		<>
			<SideNavigation>
				{children}
			</SideNavigation>
		</>
	)
}