import SideNavigation from "./SideNavigation"


export default function Layout({ children }) {
	return (
		<>
			<SideNavigation>
				{children}
			</SideNavigation>
		</>
	)
}