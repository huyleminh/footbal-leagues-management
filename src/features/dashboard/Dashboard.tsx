import { LogoutRounded, MenuRounded } from "@mui/icons-material";
import { Box, Button, Stack, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { IDashboardType } from "../../@types/ComponentInterfaces";
import PrivateRoute from "../../components/routes/PrivateRoute";
import Sidebar from "../../components/sidebar/Sidebar";
import AuthService from "../../services/AuthService";
import Home from "../home";
import TournamentFeature from "../tournaments";
import ManagerFeature from "../admin";
import AuthContext from "../../contexts/AuthContext";

function Dashboard(props: IDashboardType) {
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
		<AuthContext.Provider value={{ role: type }}>
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
									>{`Xin chào, ${
										user ? user.fullname : "unknown"
									} !`}</Typography>
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
										path="/tournaments/*"
										element={
											<PrivateRoute
												role="all"
												element={<TournamentFeature />}
											/>
										}
									/>
									<Route
										path="/managers/*"
										element={
											<PrivateRoute
												role="admin"
												element={<ManagerFeature />}
											/>
										}
									/>
									<Route
										index
										element={<PrivateRoute role="all" element={<Home />} />}
									/>
									<Route path="*" element={<Navigate to="/404" replace />} />
								</Routes>
							</Box>
						</Stack>
					</Box>
				</Stack>
			</Box>
		</AuthContext.Provider>
	);
}

export default Dashboard;
