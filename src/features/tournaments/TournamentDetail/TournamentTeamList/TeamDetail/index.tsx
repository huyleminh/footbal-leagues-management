import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import { Box, Button, LinearProgress, Stack, Typography } from "@mui/material";
import { toast } from "material-react-toastify";
import { useEffect, useState } from "react";
import { Link, useLocation, useMatch, useNavigate } from "react-router-dom";
import { IAPIResponse } from "../../../../../@types/AppInterfaces";
import { IBaseComponentProps } from "../../../../../@types/ComponentInterfaces";
import ToastMsg from "../../../../../components/toast/ToastMsg";
import HttpService from "../../../../../services/HttpService";
import { ITeamListData } from "../TeamList";
import PlayerList from "./PlayerList";
import StaffList from "./StaffList";

export interface ITeamDetailProps extends IBaseComponentProps {}

export interface ITeamStaff {
	fullname?: string;
	country?: string;
	role?: number;
	_id?: string;
}

export interface IPlayerListDetail {
	_id?: string;
	playerName?: string;
	idNumber?: string;
	country?: string;
	stripNumber?: number;
	position?: string;
}

interface ITeamDetailTeamList extends ITeamListData {
	teamStaff?: Array<ITeamStaff>;
}

interface ITeamDetailData {
	team?: ITeamDetailTeamList;
	playerList?: Array<IPlayerListDetail>;
}

function TeamDetail(props: ITeamDetailProps) {
	const location = useLocation();
	const [isLoading, setIsLoading] = useState(false);
	const match = useMatch("tournaments/:tournamentId/teams/:id");
	const [data, setData] = useState<ITeamDetailData>({});

	const navigate = useNavigate()

	useEffect(() => {
		const fetch = async () => {
			setIsLoading(true);
			try {
				const res = await HttpService.get<IAPIResponse<ITeamDetailData | string>>(
					`teams/${match ? match.params.id : ""}`,
				);
				if (res.code === 200) {
					setData(res.data as ITeamDetailData);
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

	return (
		<Box sx={{ position: "relative" }}>
			<Button
				sx={{ position: "absolute", zIndex: "1000" }}
				variant="text"
				startIcon={<ChevronLeftRoundedIcon fontSize="small" />}
				onClick={() => navigate(location.pathname.replace(match?.params.id || "", ""))}
			>
				Về trang danh sách
			</Button>
			{isLoading ? (
				<Box sx={{ width: "100%" }}>
					<LinearProgress />
				</Box>
			) : (
				<>
					<Stack alignItems="center" sx={{ mb: 4, position: "relative" }}>
						<Box
							sx={{ width: "100px", height: "100px", mb: 1 }}
							className="team-card-image"
						>
							<img
								src={data.team?.logo || ""}
								alt="logoTeam"
								style={{ width: "100%", height: "100%" }}
							/>
						</Box>

						<Typography variant="h6" sx={{ textTransform: "uppercase" }}>
							{data.team?.name || ""}
						</Typography>

						<Typography
							variant="subtitle1"
							sx={{ textTransform: "uppercase", fontSize: "0.875rem" }}
						>
							{data.team?.coachName || ""}
						</Typography>

						<Link
							to={`../../matches?teamKey=${data.team?.name}`}
							style={{ textDecoration: "none" }}
						>
							<Button variant="contained" startIcon={<OpenInNewRoundedIcon />}>
								Danh sách trận đấu
							</Button>
						</Link>
					</Stack>

					<Box sx={{ mb: 6 }}>
						<StaffList data={data.team?.teamStaff} />
					</Box>

					<Box sx={{ mb: 6 }}>
						<PlayerList data={data.playerList} />
					</Box>
				</>
			)}
		</Box>
	);
}

export default TeamDetail;
