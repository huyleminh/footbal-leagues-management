import { LogoutRounded, MenuRounded } from "@mui/icons-material";
import { Box, Button, Stack, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardType } from "../../@types/ComponentInterfaces";
import Sidebar from "../sidebar/Sidebar";

function Dashboard(props: DashboardType) {
	const { type, children } = props;
	let user = null;
	user = localStorage.getItem("user");
	user = user ? JSON.parse(user) : null;

	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(true);

	const openMenu = () => {
		setIsOpen(!isOpen);
	};

	const handleLogout = () => {
		navigate("/login");
	};

	return (
		<Box
			sx={{
				backgroundColor: "#dfdfdf",
				minHeight: "100vh",
			}}
		>
			<Stack
				direction="row"
				sx={{
					minHeight: "100vh",
				}}
				spacing={2}
			>
				<Sidebar role={type} isOpen={isOpen} />
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						flexGrow: "1",
						padding: "0px 15px 15px 0px",
					}}
				>
					<Stack
						sx={{
							height: "100%",
						}}
						spacing={2}
					>
						<Box
							sx={{
								backgroundColor: "white",
								height: "60px",
								borderRadius: "10px",
								display: "flex",
								justifyContent: "space-between",
								marginTop: "15px",
							}}
						>
							{/* Header */}
							<Button
								sx={{ borderRadius: "10px", padding: "0px 20px" }}
								onClick={openMenu}
							>
								<MenuRounded />
							</Button>
							<Box
								sx={{
									display: "flex",
								}}
							>
								<Typography
									variant="h6"
									sx={{
										display: "inline-flex",
										alignItems: "center",
									}}
								>{`Xin chào, ${user ? user.fullname : "unknown"} !`}</Typography>
								<Tooltip title="Đăng xuất">
									<Button
										sx={{ borderRadius: "10px", padding: "0px 20px" }}
										onClick={handleLogout}
									>
										<LogoutRounded />
									</Button>
								</Tooltip>
							</Box>
						</Box>
						<Box
							sx={{
								backgroundColor: "white",
								flexGrow: "1",
								borderRadius: "10px",
							}}
						>
							{/* Content */}
							{children || null}
						</Box>
					</Stack>
				</Box>
			</Stack>
		</Box>
	);
}

export default Dashboard;
