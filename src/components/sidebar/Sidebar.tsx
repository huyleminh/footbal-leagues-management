import { Box, Stack, Typography } from "@mui/material";
import { ISidebarType } from "../../@types/ComponentInterfaces";
import NavigationList from "../../shared/NavigationList";
import Menu from "../menu/Menu";
import "./styles.scss";

function Sidebar(props: ISidebarType) {
	const { role, isOpen } = props;
	const navigationList = NavigationList.NAV_LIST

	return (
		<Box
			className={`dashboard-sidebar ${!isOpen ? "hidden" : ""}`}
			sx={{
				width: "260px",
				minWidth: "260px",
			}}
		>
			<Stack
				sx={{
					backgroundColor: "#8B33FF",
					display: "flex",
					flexDirection: "column",
					height: "100%",
				}}
				spacing={2}
			>
				{/* Sidebar */}
				<Box
					sx={{
						backgroundColor: "white",
						margin: "1rem 1rem 0px 1rem",
						borderRadius: "10px",
						height: "60px",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
					}}
				>
					<Typography variant="h5" textAlign="center" sx={{ overflow: "hidden" }}>
						FBL Dashboard
					</Typography>
				</Box>

				{/* Sidebar navigation */}
				<Menu menuList={navigationList} role={role}/>
			</Stack>
		</Box>
	);
}

export default Sidebar;
