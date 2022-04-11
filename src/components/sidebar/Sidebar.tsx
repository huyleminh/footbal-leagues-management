import { Box, Stack, Typography } from "@mui/material";
import { SidebarType } from "../../@types/ComponentInterfaces";
import Menu from "../menu/Menu";
import "./styles.scss";

function Sidebar(props: SidebarType) {
	const { navigationList, isOpen } = props;

	return (
		<Box
			className={`dashboard-sidebar ${!isOpen ? "hidden" : ""}`}
			sx={{
				width: "330px",
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
						margin: "15px 15px 0px 15px",
						borderRadius: "10px",
						height: "60px",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
					}}
				>
					<Typography variant="h4" textAlign="center" sx={{ overflow: "hidden" }}>
						FBL Dashboard
					</Typography>
				</Box>

				{/* Sidebar navigation */}
				<Menu menuList={navigationList} />
			</Stack>
		</Box>
	);
}

export default Sidebar;
