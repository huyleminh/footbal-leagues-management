import { Box, Chip, Stack, Tab, Tabs, Typography } from "@mui/material";
import React from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { IBaseComponentProps } from "../../../@types/ComponentInterfaces";
import PrivateRoute from "../../../components/routes/PrivateRoute";
import TournamentMatchList from "./TournamentMatchList";
import TournamentRanking from "./TournamentRanking";
import TournamentTeamList from "./TournamentTeamList";

export interface ITournamentDetailProps extends IBaseComponentProps {}

const tabListConfig = [
	{ key: "ranking", label: "Bảng xếp hạng", value: "/ranking" },
	{ key: "teams", label: "Danh sách đội bóng", value: "/teams" },
	{ key: "matches", label: "Danh sách trận đấu", value: "/matches" },
];

function TournamentDetail(props: ITournamentDetailProps) {
	const location = useLocation();
	let currentTab = tabListConfig.findIndex((item) => location.pathname.includes(item.value));
	currentTab = currentTab === -1 ? 0 : currentTab
	const [value, setValue] = React.useState(currentTab === -1 ? 0 : currentTab);

	const navigate = useNavigate();
	if (currentTab !== value) {
		setValue(currentTab);
	}

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
		navigate(`.${tabListConfig[newValue].value}`);
	};
	return (
		<Stack sx={{ height: "100%" }} spacing={3}>
			<Box>
				<Stack direction="row" spacing={3}>
					<Box sx={{ width: "150px", height: "150px" }}>
						<img
							src="https://givetour.s3.amazonaws.com/UploadFiles/League/35675/Avatar.png"
							alt="logoTournament"
							style={{ width: "100%", height: "100%" }}
						/>
					</Box>

					<Stack spacing={2}>
						<Typography variant="h5" sx={{ textTransform: "uppercase" }}>
							Premier league
						</Typography>
						<Typography sx={{ fontSize: "1.2rem" }}>Huy Le</Typography>
						<Box sx={{ maxWidth: "200px" }}>
							<Chip color="success" label="Đang diễn ra" />
						</Box>
					</Stack>
				</Stack>
			</Box>

			<Tabs value={value} onChange={handleChange} centered>
				{tabListConfig.map((tab) => {
					return (
						<Tab
							key={tab.key}
							label={tab.label}
							sx={{ flexGrow: 1, maxWidth: "100%" }}
						/>
					);
				})}
			</Tabs>

			<Box sx={{ flexGrow: "1" }}>
				<Routes>
					<Route
						path="/ranking"
						element={<PrivateRoute role="all" element={<TournamentRanking />} />}
					/>
					<Route
						path="/teams/*"
						element={<PrivateRoute role="all" element={<TournamentTeamList />} />}
					/>
					<Route
						path="/matches"
						element={<PrivateRoute role="all" element={<TournamentMatchList />} />}
					/>
					<Route
						index
						element={<PrivateRoute role="all" element={<TournamentRanking />} />}
					/>
					<Route path="*" element={<Navigate to={`/404`} replace />} />
				</Routes>
			</Box>
		</Stack>
	);
}

export default TournamentDetail;
