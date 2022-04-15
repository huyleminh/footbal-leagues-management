import { LogoutRounded, MenuRounded } from "@mui/icons-material";
import { Box, Button, Stack, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { DashboardType } from "../../@types/ComponentInterfaces";
import ForbiddenPage from "../errors/403";
import PageNotFound from "../errors/404";
import PrivateRoute from "../../components/routes/PrivateRoute";
import Sidebar from "../../components/sidebar/Sidebar";
import AuthService from "../../services/AuthService";
import Home from "../home";
import TournamentFeature from "../tournaments";

function Dashboard(props: DashboardType) {
	const { type } = props;
	let user = null;
	user = localStorage.getItem("user");
	user = user ? JSON.parse(user) : null;

	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(true);

	const openMenu = () => {
		setIsOpen(!isOpen);
	};

	const handleLogout = () => {
		AuthService.postLogoutAsync();
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
						padding: "1rem 1rem 1rem 0",
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
							}}
						>
							{/* Header */}
							<Button
								sx={{ borderRadius: "10px", padding: "0px 1rem" }}
								onClick={openMenu}
							>
								<MenuRounded />
							</Button>
							<Stack direction="row" spacing={2}>
								<Typography
									variant="h6"
									sx={{
										display: "inline-flex",
										alignItems: "center",
									}}
								>{`Xin chào, ${user ? user.fullname : "unknown"} !`}</Typography>
								<Tooltip title="Đăng xuất">
									<Button
										sx={{ borderRadius: "10px", padding: "0px 1rem" }}
										onClick={handleLogout}
									>
										<LogoutRounded />
									</Button>
								</Tooltip>
							</Stack>
						</Box>
						<Box
							sx={{
								backgroundColor: "white",
								flexGrow: "1",
								borderRadius: "10px",
								minHeight: `calc(100vh - 3rem - 60px)`,
								padding: "1rem",
							}}
						>
							{/* Content */}
							<Routes>
								<Route
									path="/test"
									element={
										<PrivateRoute role="admin" element={<PageNotFound />} />
									}
								/>
								<Route
									path="/test2"
									element={
										<PrivateRoute role="manager" element={<ForbiddenPage />} />
									}
								/>
								<Route
									path="/tournaments/*"
									element={<PrivateRoute role="all" element={<TournamentFeature />} />}
								/>
								<Route
									index
									element={<PrivateRoute role="all" element={<Home />} />}
								/>
							</Routes>
						</Box>
					</Stack>
				</Box>
			</Stack>
		</Box>
	);
}

export default Dashboard;
