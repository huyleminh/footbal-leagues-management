import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
	Box,
	Button,
	FormControl,
	InputLabel,
	LinearProgress,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { useLocation, useMatch } from "react-router-dom";
import { IBaseComponentProps } from "../../../../../@types/ComponentInterfaces";
import { toast } from "material-react-toastify";
import ToastMsg from "../../../../../components/toast/ToastMsg";
import AuthContext from "../../../../../contexts/AuthContext";
import ViewMatchDetail from "../MatchDetail/ViewMatchDetail";
import CreateMatch, { ICreateMatchForm } from "./CreateMatch";
import MatchListItem, { MatchListItemType } from "./MatchListItem";
import HttpService from "../../../../../services/HttpService";
import { IAPIBaseMetadata, IAPIResponse } from "../../../../../@types/AppInterfaces";
import removeVietnameseTones from "../../../../../utils/ConvertVieStr";

export interface IMatchListProps extends IBaseComponentProps {}

interface IMatchListResMetadata extends IAPIBaseMetadata {
	round: number;
	totalRound: number;
}

interface IMatchListResData {
	competitors: {
		teamId: string;
		teamType: number;
		goal: number | null;
		isWinner: boolean;
		logo: string;
		name: string;
	}[];
	round: number;
	scheduledDate: string;
	stadiumName: string;
	_id: string;
}

function MatchList(props: IMatchListProps) {
	const location = useLocation();
	const [totalRound, setTotalRound] = useState(1);
	const queryString = new URLSearchParams(location.search);
	const [teamKey, setTeamKey] = useState(queryString.get("teamKey") || "");
	const [selectedRound, setSelectedRound] = useState(1);
	const context = useContext(AuthContext);
	const [openDetailModal, setOpenDetailModal] = useState(false);
	const [openCreateModal, setOpenCreateModal] = useState(false);
	const [targetMatch, setTargetMatch] = useState<MatchListItemType | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const match = useMatch("/tournaments/:id/matches");

	const [data, setData] = useState<Array<MatchListItemType>>([]);

	useEffect(() => {
		const fetch = async () => {
			setIsLoading(true);
			try {
				const res = await HttpService.get<IAPIResponse<Array<IMatchListResData> | string>>(
					`matches?round=${selectedRound}&tournamentId=${match?.params.id}`,
				);
				if (res.code === 200) {
					const metadata = res.metadata as IMatchListResMetadata;
					setTotalRound(metadata.totalRound);
					setData(
						(res.data as Array<IMatchListResData>).map((item) => {
							const homeTeamData = item.competitors.find(
								(element) => element.teamType === 0,
							);
							const awayTeamData = item.competitors.find(
								(element) => element.teamType === 1,
							);
							return {
								id: item._id,
								round: item.round.toString(),
								homeTeam: {
									name: homeTeamData?.name,
									point: homeTeamData?.goal,
									logo: homeTeamData?.logo,
								},
								awayTeam: {
									name: awayTeamData?.name,
									point: awayTeamData?.goal,
									logo: awayTeamData?.logo,
								},
								stadium: item.stadiumName,
							} as MatchListItemType;
						}),
					);
				} else if (res.code === 400) {
					toast(<ToastMsg title={res.data as string} type="error" />, {
						type: toast.TYPE.ERROR,
					});
				} else {
					toast(<ToastMsg title="Có lỗi xảy ra, vui lòng thử lại sau!" type="error" />, {
						type: toast.TYPE.ERROR,
					});
				}
			} catch (err) {
				console.log(err);
				toast(<ToastMsg title="Có lỗi xảy ra, vui lòng thử lại sau!" type="error" />, {
					type: toast.TYPE.ERROR,
				});
			}
			setIsLoading(false);
		};
		fetch();
	}, [match?.params.id, selectedRound]);

	const handleItemClick = (item: MatchListItemType) => {
		setTargetMatch(item);
		setOpenDetailModal(true);
	};

	const handleCreate = async (data: ICreateMatchForm) => {
		const payload = {
			...data,
			scheduledDate: data.scheduledDate?.toISOString(),
			tournamentId: match?.params.id,
		};
		try {
			const res = await HttpService.post<IAPIResponse<string>>("/matches", payload);
			if (res.code === 201) {
				window.location.reload();
			} else if (res.code === 400) {
				toast(<ToastMsg title={res.data as string} type="error" />, {
					type: toast.TYPE.ERROR,
				});
			} else {
				toast(<ToastMsg title="Có lỗi xảy ra, vui lòng thử lại sau!" type="error" />, {
					type: toast.TYPE.ERROR,
				});
			}
		} catch (err) {
			console.log(err);
			toast(<ToastMsg title="Có lỗi xảy ra, vui lòng thử lại sau!" type="error" />, {
				type: toast.TYPE.ERROR,
			});
		}
		setOpenCreateModal(false);
	};

	const displayData = data.filter(
		(item) =>
			removeVietnameseTones(item.homeTeam.name)
				.toLowerCase()
				.includes(removeVietnameseTones(teamKey.toLowerCase())) ||
			removeVietnameseTones(item.awayTeam.name)
				.toLowerCase()
				.includes(removeVietnameseTones(teamKey.toLowerCase())),
	);

	const handleOpenDetailModal = (refresh: boolean) => {
		if (refresh) window.location.reload();
		setOpenDetailModal(false);
	};

	return (
		<>
			<CreateMatch
				open={openCreateModal}
				totalRound={totalRound}
				onClose={setOpenCreateModal}
				onSubmit={handleCreate}
				tournamentId={match?.params.id}
			/>
			<ViewMatchDetail
				open={openDetailModal}
				match={targetMatch}
				onClose={handleOpenDetailModal}
			/>
			<Stack sx={{ height: "100%" }}>
				<Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
					<Stack
						spacing={2}
						sx={{ display: "flex", alignItems: "center" }}
						direction="row"
					>
						{context.role === "manager" ? (
							<Button
								color="primary"
								variant="contained"
								size="small"
								onClick={() => setOpenCreateModal(true)}
								startIcon={<AddRoundedIcon />}
							>
								Tạo mới
							</Button>
						) : null}
						<Typography sx={{ fontSize: "1rem", fontWeight: 600 }}>Lọc</Typography>

						<FormControl sx={{ m: 0, minWidth: 120 }} size="small">
							<InputLabel id="round">Vòng đấu</InputLabel>
							<Select
								id="roundSelect"
								label="Vòng đấu"
								labelId="round"
								value={selectedRound}
								onChange={(e) => {
									setSelectedRound(e.target.value as number);
								}}
							>
								{[...Array(totalRound)].map((item, index) => (
									<MenuItem key={index} value={(index + 1) as number}>{`Vòng ${
										index + 1
									}`}</MenuItem>
								))}
							</Select>
						</FormControl>
					</Stack>
					<TextField
						variant="outlined"
						placeholder="Nhập tên đội bóng"
						size="small"
						name="teamKey"
						value={teamKey}
						onChange={(e) => setTeamKey(e.target.value)}
						InputProps={{
							endAdornment: <SearchRoundedIcon color="primary" />,
						}}
					></TextField>
				</Box>
				{isLoading ? (
					<Box sx={{ width: "100%" }}>
						<LinearProgress />
					</Box>
				) : (
					<Box
						sx={{
							height: "53vh",
							overflow: "auto",
						}}
					>
						{displayData.length === 0 ? (
							<Typography variant="body1" textAlign="center">
								Không có dữ liệu
							</Typography>
						) : (
							displayData.map((item, index) => (
								<MatchListItem key={index} data={item} onClick={handleItemClick} />
							))
						)}
					</Box>
				)}
			</Stack>
		</>
	);
}

export default MatchList;
