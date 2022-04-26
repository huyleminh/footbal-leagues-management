import { Box, Chip, LinearProgress, Stack, Tab, Tabs, Typography } from "@mui/material";
import { toast } from "material-react-toastify";
import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useMatch, useNavigate } from "react-router-dom";
import { IAPIResponse } from "../../../@types/AppInterfaces";
import { IBaseComponentProps } from "../../../@types/ComponentInterfaces";
import PrivateRoute from "../../../components/routes/PrivateRoute";
import ToastMsg from "../../../components/toast/ToastMsg";
import HttpService from "../../../services/HttpService";
import TournamentMatchList from "./TournamentMatchList";
import TournamentRanking from "./TournamentRanking";
import TournamentTeamList from "./TournamentTeamList";

export interface ITournamentDetailProps extends IBaseComponentProps {}

const tabListConfig = [
	{ key: "ranking", label: "Bảng xếp hạng", value: "/ranking" },
	{ key: "teams", label: "Danh sách đội bóng", value: "/teams" },
	{ key: "matches", label: "Danh sách trận đấu", value: "/matches" },
];

interface ITournamentDetailData {
	_id?: string;
	name?: string;
	logoUrl?: string;
	sponsorName?: Array<string>;
	totalTeam?: number;
	status?: number;
	scheduledDate?: string;
	createdAt?: string;
	updateAt?: string;
	createdByName?: string;
}

enum TOURNAMENT_STATUS_ENUM {
	PENDING,
	INPROGRESS,
	EXPIRE_SOON,
	ENDED,
}

function TournamentDetail(props: ITournamentDetailProps) {
	const location = useLocation();
	let currentTab = tabListConfig.findIndex((item) => location.pathname.includes(item.value));
	currentTab = currentTab === -1 ? 0 : currentTab;
	const [value, setValue] = React.useState(currentTab === -1 ? 0 : currentTab);
	const navigate = useNavigate();
	if (currentTab !== value) {
		setValue(currentTab);
	}
	const match = useMatch("tournaments/:id/*");
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState<ITournamentDetailData>({});

	useEffect(() => {
		const fetch = async () => {
			setIsLoading(true);
			try {
				const res = await HttpService.get<IAPIResponse<ITournamentDetailData | string>>(
					`tournaments/${match ? match.params.id : ""}`,
				);
				if (res.code === 200) {
					setData(res.data as ITournamentDetailData);
				} else {
					toast(<ToastMsg title={res?.data as string} type="error" />, {
						type: toast.TYPE.ERROR,
					});
				}
			} catch (e) {
				console.log(e);
				toast(<ToastMsg title="Có lỗi xảy ra, vui lòng thử lại sau!" type="error" />, {
					type: toast.TYPE.ERROR,
				});
			}
			setIsLoading(false);
		};
		fetch();
	}, [match]);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
		navigate(`.${tabListConfig[newValue].value}`);
	};
	return (
		<Stack sx={{ height: "100%" }} spacing={3}>
			{isLoading ? (
				<Box sx={{ width: "100%" }}>
					<LinearProgress />
				</Box>
			) : (
				<Box>
					<Stack direction="row" spacing={3}>
						<Box
							sx={{
								width: "200px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<img
								src={data.logoUrl || ""}
								alt="logoTournament"
								style={{
									minWidth: "150px",
									minHeight: "150px",
									height: "100%",
									objectFit: "contain",
								}}
							/>
						</Box>

						<Stack spacing={2}>
							<Typography variant="h5" sx={{ textTransform: "uppercase" }}>
								{data.name || ""}
							</Typography>
							<Typography sx={{ fontSize: "1rem" }}>
								{`Tài trợ: ${data.sponsorName?.map((item) => `${item} `) || ""}`}
							</Typography>
							<Typography sx={{ fontSize: "1rem" }}>
								Người tạo: {data.createdByName || "Không rõ"}
							</Typography>
							<Box sx={{ maxWidth: "200px" }}>
								{data.status === TOURNAMENT_STATUS_ENUM.PENDING ? (
									<Chip color="info" label="Sắp diễn ra" />
								) : data.status === TOURNAMENT_STATUS_ENUM.INPROGRESS ? (
									<Chip color="success" label="Đang diễn ra" />
								) : data.status === TOURNAMENT_STATUS_ENUM.EXPIRE_SOON ? (
									<Chip color="warning" label="Sắp kết thúc" />
								) : (
									<Chip color="error" label="Đã kết thúc" />
								)}
							</Box>
						</Stack>
					</Stack>
				</Box>
			)}

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
						path="/matches/*"
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
