import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Stack,
	Divider,
	Typography,
	TextField,
	LinearProgress,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import StadiumRoundedIcon from "@mui/icons-material/StadiumRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { useContext, useEffect, useRef, useState } from "react";
import MatchEvent, { IMatchEventType } from "./MatchEvent";
import MatchLineup from "./MatchLineup";
import ChooseLineupDialog, { IModalData } from "./ChooseLineupDialog";
import AuthContext from "../../../../../../contexts/AuthContext";
import AddMatchEventDialog from "./AddMatchEventDialog";
import { toast } from "material-react-toastify";
import ToastMsg from "../../../../../../components/toast/ToastMsg";
import HttpService from "../../../../../../services/HttpService";
import { IAPIResponse } from "../../../../../../@types/AppInterfaces";
import {
	ITeamMatchDetailType,
	IMatchDetailType,
	IMatchDetailResData,
	IMatchDetailProps,
	IMatchEventResData,
	ILineupType,
	ISubstitutionType,
} from "./MatchDetailInterfaces";
import Swal from "sweetalert2";
import _ from "lodash";

const titleList = [
	{
		title: "Tên đội",
		dataKey: "name",
	},
	{
		title: "Số cú sút",
		dataKey: "totalShot",
	},
	{
		title: "Sút trúng đích",
		dataKey: "shotsOnTarget",
	},
	{
		title: "Kiểm soát bóng",
		dataKey: "possessions",
		postfix: "%",
	},
	{
		title: "Số đường chuyền",
		dataKey: "totalPasses",
	},
	{
		title: "Chuyền chính xác",
		dataKey: "passAccuracy",
		postfix: "%",
	},
	{
		title: "Việt vị",
		dataKey: "offside",
	},
	{
		title: "Số phạt góc",
		dataKey: "corners",
	},
	{
		title: "Số lỗi",
		dataKey: "fouls",
	},
];

function ViewMatchDetail(props: IMatchDetailProps) {
	const { open, onClose, match } = props;
	const context = useContext(AuthContext);
	const [editMode, setEditMode] = useState(false);
	const backup = useRef<IMatchDetailType>({
		id: "",
		homeTeam: {
			id: "",
			name: "",
			logo: "",
			lineup: [],
			substitution: [],
		},
		awayTeam: {
			id: "",
			name: "",
			logo: "",
			lineup: [],
			substitution: [],
		},
		stadium: "",
		date: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [openChooseLineup, setOpenChooseLineup] = useState(false);
	const changeDetail = useRef(false);
	const refresh = useRef(false);
	const [reload, setReload] = useState(false);
	const [openAddEvent, setOpenAddEvent] = useState(false);
	const [modalData, setModalData] = useState<IModalData>({});
	const [matchDetail, setMatchDetail] = useState<IMatchDetailType>({
		id: match?.id || "",
		homeTeam: {
			id: "",
			name: "",
			logo: "",
			lineup: [],
			substitution: [],
		},
		awayTeam: {
			id: "",
			name: "",
			logo: "",
			lineup: [],
			substitution: [],
		},
		stadium: "",
		date: "",
	});

	const [matchEvent, setMatchEvent] = useState<Array<IMatchEventType>>([]);

	useEffect(() => {
		const fetchDetail = async () => {
			setIsLoading(true);
			try {
				const [detail, event] = await Promise.allSettled([
					HttpService.get<IAPIResponse<IMatchDetailResData | string>>(
						`/matches/${match?.id}`,
					),
					HttpService.get<IAPIResponse<any | string>>(`/matches/${match?.id}/events`),
				]);
				// handle detail response
				if (detail.status === "fulfilled") {
					const res = detail.value;
					if (res.code === 200) {
						let data = res.data as IMatchDetailResData;
						let home = data.competitors.find((item) => item.teamType === 0);
						let homeLineup = home?.lineup.filter((player) => player.playerType === 0);
						let homeSub = home?.lineup.filter((player) => player.playerType === 1);
						let away = data.competitors.find((item) => item.teamType === 1);
						let awayLineup = away?.lineup.filter((player) => player.playerType === 0);
						let awaySub = away?.lineup.filter((player) => player.playerType === 1);

						setMatchDetail({
							id: data._id,
							homeTeam: {
								id: home?.teamId ?? "",
								name: match?.homeTeam.name ?? "",
								logo: match?.homeTeam.logo ?? "",
								point: home?.goal,
								totalShot: home?.totalShot,
								totalPasses: home?.totalPass,
								shotsOnTarget: home?.shotsOntarget,
								possessions: home?.possessions,
								offside: home?.offsides,
								passAccuracy: home?.passAccuracy,
								corners: home?.conners,
								fouls: home?.fouls,
								lineup:
									homeLineup?.map((element) => ({
										playerId: element.playerId,
										stripNumber: element.stripNumber,
										name: element.playerName,
										position: element.inMatchPosition,
									})) || [],
								substitution:
									homeSub?.map((element) => ({
										playerId: element.playerId,
										stripNumber: element.stripNumber,
										name: element.playerName,
									})) || [],
							},
							awayTeam: {
								id: away?.teamId ?? "",
								name: match?.awayTeam.name ?? "",
								logo: match?.awayTeam.logo ?? "",
								point: away?.goal,
								totalShot: away?.totalShot,
								totalPasses: away?.totalPass,
								shotsOnTarget: away?.shotsOntarget,
								possessions: away?.possessions,
								offside: away?.offsides,
								passAccuracy: away?.passAccuracy,
								corners: away?.conners,
								fouls: away?.fouls,
								lineup:
									awayLineup?.map((element) => ({
										playerId: element.playerId,
										stripNumber: element.stripNumber,
										name: element.playerName,
										position: element.inMatchPosition,
									})) || [],
								substitution:
									awaySub?.map((element) => ({
										playerId: element.playerId,
										stripNumber: element.stripNumber,
										name: element.playerName,
									})) || [],
							},
							stadium: data.stadiumName,
							date: new Date(data.scheduledDate),
						});
					} else if (res.code === 400) {
						toast(<ToastMsg title={res.data as string} type="error" />, {
							type: toast.TYPE.ERROR,
						});
					} else {
						toast(
							<ToastMsg
								title="Có lỗi xảy ra khi lấy dữ liệu trận đấu, vui lòng thử lại sau!"
								type="error"
							/>,
							{
								type: toast.TYPE.ERROR,
							},
						);
					}
				} else {
					toast(
						<ToastMsg
							title="Có lỗi xảy ra khi lấy dữ liệu trận đấu, vui lòng thử lại sau!"
							type="error"
						/>,
						{
							type: toast.TYPE.ERROR,
						},
					);
				}

				// handle event response
				if (event.status === "fulfilled") {
					const res = event.value;
					if (res.code === 200) {
						setMatchEvent(
							(res.data as Array<IMatchEventResData>).map((item) => {
								return {
									eventType:
										item.goal?.type || item.card?.type || item.substitution,
									isHome: item.isHome,
									minute: item.ocurringMinute,
									mainPlayer: {
										id:
											item.goal?.player ||
											item.card?.player ||
											item.substitution?.outPlayer,
										name:
											item.goal?.playerName ||
											item.card?.playerName ||
											item.substitution?.outName,
										stripNumber: parseInt(
											(item.goal?.playerStrip ||
												item.card?.playerStrip ||
												item.substitution?.outStrip) ??
												"0",
										),
									},
									subPlayer:
										item.goal?.assist || item.substitution
											? {
													id:
														item.goal?.assist ||
														item.substitution?.inPlayer,
													name:
														item.goal?.assistName ||
														item.substitution?.outName,
													stripNumber: parseInt(
														(item.goal?.assistStrip ||
															item.substitution?.inStrip) ??
															"0",
													),
											  }
											: undefined,
								} as IMatchEventType;
							}),
						);
					} else if (res.code === 400) {
						toast(<ToastMsg title={res.data as string} type="error" />, {
							type: toast.TYPE.ERROR,
						});
					} else {
						toast(
							<ToastMsg
								title="Có lỗi xảy ra khi lấy dữ liệu trận đấu, vui lòng thử lại sau!"
								type="error"
							/>,
							{
								type: toast.TYPE.ERROR,
							},
						);
					}
				} else {
					toast(
						<ToastMsg
							title="Có lỗi xảy ra khi lấy dữ liệu trận đấu, vui lòng thử lại sau!"
							type="error"
						/>,
						{
							type: toast.TYPE.ERROR,
						},
					);
				}
			} catch (err) {
				console.log(err);
				toast(<ToastMsg title="Có lỗi xảy ra, vui lòng thử lại sau!" type="error" />, {
					type: toast.TYPE.ERROR,
				});
			}
			setIsLoading(false);
		};
		if (open) fetchDetail();
	}, [open, match, reload]);

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.name !== "stadium") {
			changeDetail.current = true; // check if there are changes
		}
		const temp = { ...matchDetail };
		let [teamType, fieldName] = e.target.name.split("-");
		if (!fieldName) fieldName = teamType;
		if (teamType === "home")
			temp.homeTeam[fieldName as keyof ITeamMatchDetailType] = e.target.value.trim() as never;
		else if (teamType === "away")
			temp.awayTeam[fieldName as keyof ITeamMatchDetailType] = e.target.value.trim() as never;
		else if (fieldName === "stadium")
			temp[fieldName as keyof IMatchDetailType] = e.target.value as never;
		else temp[fieldName as keyof IMatchDetailType] = e.target.value.trim() as never;
		setMatchDetail(temp);
	};

	const handleChangeTime = (newValue: Date | null) => {
		setMatchDetail({ ...matchDetail, date: newValue });
	};

	const handleSwitchToEditMode = async () => {
		if (editMode) {
			const res = await Swal.fire({
				icon: "warning",
				title: "Xác nhận",
				text: "Bấm đồng ý để xác nhận thay đổi. Nếu thay đổi thông tin trận đấu (trừ thời gian và tên sân) lần đầu sẽ tính thời gian 1 giờ trước khi khóa chức năng sửa.",
				confirmButtonText: "Đồng ý",
				denyButtonText: "Hủy",
				showDenyButton: true,
				allowEscapeKey: false,
				allowOutsideClick: false,
			});

			if (res.isConfirmed) {
				// submit form
				const payload = {
					scheduledDate: (matchDetail.date as Date).toISOString(),
					stadiumName: matchDetail.stadium.trim(),
					competitors: changeDetail.current
						? [
								{
									teamId: matchDetail.homeTeam.id,
									teamType: 0,
									isWinner: false,
									goal: matchDetail.homeTeam.point,
									totalShot: matchDetail.homeTeam.totalShot,
									shotsOntarget: matchDetail.homeTeam.shotsOnTarget,
									possessions: matchDetail.homeTeam.possessions,
									totalPass: matchDetail.homeTeam.totalPasses,
									passAccuracy: matchDetail.homeTeam.passAccuracy,
									offsides: matchDetail.homeTeam.offside,
									conners: matchDetail.homeTeam.corners,
									fouls: matchDetail.homeTeam.fouls,
									lineup: [
										...matchDetail.homeTeam.lineup.map((player) => ({
											playerId: player.playerId,
											playerType: 0,
											inMatchPosition: player.position,
										})),
										...matchDetail.homeTeam.substitution.map((player) => ({
											playerId: player.playerId,
											playerType: 1,
											inMatchPosition: "Dự bị",
										})),
									],
								},
								{
									teamId: matchDetail.awayTeam.id,
									teamType: 1,
									isWinner: false,
									goal: matchDetail.awayTeam.point,
									totalShot: matchDetail.awayTeam.totalShot,
									shotsOntarget: matchDetail.awayTeam.shotsOnTarget,
									possessions: matchDetail.awayTeam.possessions,
									totalPass: matchDetail.awayTeam.totalPasses,
									passAccuracy: matchDetail.awayTeam.passAccuracy,
									offsides: matchDetail.awayTeam.offside,
									conners: matchDetail.awayTeam.corners,
									fouls: matchDetail.awayTeam.fouls,
									lineup: [
										...matchDetail.awayTeam.lineup.map((player) => ({
											playerId: player.playerId,
											playerType: 0,
											inMatchPosition: player.position,
										})),
										...matchDetail.awayTeam.substitution.map((player) => ({
											playerId: player.playerId,
											playerType: 1,
											inMatchPosition: "Dự bị",
										})),
									],
								},
						  ]
						: null,
					events: changeDetail.current
						? matchEvent.map((event) => ({
								ocurringMinute: event.minute,
								isHome: event.isHome,
								card:
									event.eventType === "yellow" || event.eventType === "red"
										? {
												type: event.eventType,
												player: event.mainPlayer.id,
										  }
										: undefined,
								goal:
									event.eventType === "normal" ||
									event.eventType === "og" ||
									event.eventType === "penalty"
										? {
												type: event.eventType,
												player: event.mainPlayer.id,
												assist: event.subPlayer
													? event.subPlayer.id
													: undefined,
										  }
										: undefined,
								substitution: !event.eventType
									? {
											type: undefined,
											inPlayer: event.subPlayer?.id,
											outPlayer: event.mainPlayer.id,
									  }
									: undefined,
						  }))
						: null,
				};

				// call API
				try {
					const res = await HttpService.put<IAPIResponse<string | undefined>>(
						`/matches/${matchDetail.id}`,
						payload,
					);
					if (res.code === 204) {
						refresh.current = true; // notify match list to refresh
						setEditMode(!editMode);
						setReload(!reload);
					} else if (res.code === 400) {
						toast(<ToastMsg title={res.data as string} type="error" />, {
							type: toast.TYPE.ERROR,
						});
					} else {
						toast(
							<ToastMsg title="Có lỗi xảy ra, vui lòng thử lại sau!" type="error" />,
							{
								type: toast.TYPE.ERROR,
							},
						);
					}
				} catch (err) {
					console.log(err);
					toast(<ToastMsg title="Có lỗi xảy ra, vui lòng thử lại sau!" type="error" />, {
						type: toast.TYPE.ERROR,
					});
				}
			} else if (res.isDenied) {
				// undo all change
				changeDetail.current = false;
				refresh.current = false;
				setMatchDetail(_.cloneDeep(backup.current));
				setEditMode(!editMode);
			}
		} else {
			backup.current = _.cloneDeep(matchDetail);
			setEditMode(!editMode);
		}
	};

	const handleOpenChooseLineup = (isHome: boolean) => {
		setModalData({
			matchId: matchDetail.id,
			isHome: isHome,
			teamId: isHome ? matchDetail.homeTeam.id : matchDetail.awayTeam.id,
		});
		setOpenChooseLineup(true);
	};

	const handleOpenAddEvent = (isHome: boolean) => {
		setModalData({
			matchId: matchDetail.id,
			isHome: isHome,
			teamId: isHome ? matchDetail.homeTeam.id : matchDetail.awayTeam.id,
		});
		setOpenAddEvent(true);
	};

	const getResultFromChooseLineup = (
		data: {
			players: Array<{
				isSelected: boolean;
				player: {
					playerId: string;
					name: string;
					stripNumber: number;
					nationality: string;
				};
				position?: string;
			}>;
			isHome: boolean;
		} | null,
	) => {
		if (!data) {
			setOpenChooseLineup(false);
		} else {
			const lineup = data.players
				.filter((player) => player.position && player.position !== "Dự bị")
				.map(
					(item) =>
						({
							playerId: item.player.playerId,
							stripNumber: item.player.stripNumber,
							name: item.player.name,
							position: item.position,
						} as ILineupType),
				);
			const substitution = data.players
				.filter((player) => !player.position || player.position === "Dự bị")
				.map(
					(item) =>
						({
							playerId: item.player.playerId,
							stripNumber: item.player.stripNumber,
							name: item.player.name,
						} as ISubstitutionType),
				);

			const temp = { ...matchDetail };
			if (data.isHome) {
				temp.homeTeam.lineup = lineup;
				temp.homeTeam.substitution = substitution;
				setMatchDetail(temp);
			} else {
				temp.awayTeam.lineup = lineup;
				temp.awayTeam.substitution = substitution;
				setMatchDetail(temp);
			}
			changeDetail.current = true;
			setOpenChooseLineup(false);
		}
	};

	const getResultFromAddEvent = (event: IMatchEventType | null) => {
		if (!event) {
			setOpenAddEvent(false);
		} else {
			setMatchEvent([...matchEvent, event]);
			changeDetail.current = true;
			setOpenAddEvent(false);
		}
	};

	return (
		<>
			<ChooseLineupDialog
				data={modalData}
				open={openChooseLineup}
				onClose={getResultFromChooseLineup}
			/>
			<AddMatchEventDialog
				data={modalData}
				matchData={matchDetail}
				open={openAddEvent}
				onClose={getResultFromAddEvent}
			/>
			<Dialog maxWidth="xl" fullWidth open={open} scroll="paper" disableEscapeKeyDown>
				<DialogTitle>
					<Stack direction="row" justifyContent="space-between">
						Chi tiết trận đấu
						{context.role === "manager" ? (
							isLoading ? null : (
								<Button
									startIcon={
										editMode ? (
											<SaveRoundedIcon fontSize="small" />
										) : (
											<EditRoundedIcon fontSize="small" />
										)
									}
									color="primary"
									variant="contained"
									onClick={() => handleSwitchToEditMode()}
								>
									{editMode ? "Lưu" : "Sửa"}
								</Button>
							)
						) : null}
					</Stack>
				</DialogTitle>
				<DialogContent>
					{isLoading ? (
						<Box sx={{ width: "100%" }}>
							<LinearProgress />
						</Box>
					) : (
						<Box sx={{ paddingTop: "10px" }}>
							<Stack spacing={1}>
								<Box
									sx={{
										display: "flex",
										minHeight: "45px",
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<Box
										sx={{
											display: "flex",
											marginRight: "25px",
										}}
									>
										{editMode ? (
											<TextField
												size="small"
												label="Sân vận động"
												name="stadium"
												variant="outlined"
												value={matchDetail.stadium}
												onChange={handleOnChange}
											/>
										) : (
											<>
												<StadiumRoundedIcon
													sx={{ marginRight: "10px" }}
													color="primary"
													fontSize="medium"
												/>
												<Typography
													sx={{ color: "black" }}
													variant="subtitle2"
												>
													{matchDetail.stadium}
												</Typography>
											</>
										)}
									</Box>
									<Box
										sx={{
											display: "flex",
											marginRight: "25px",
										}}
									>
										{editMode ? (
											<DateTimePicker
												label="Thời gian"
												value={matchDetail.date}
												onChange={handleChangeTime}
												renderInput={(params) => (
													<TextField
														size="small"
														label="Thời gian"
														variant="outlined"
														{...params}
													/>
												)}
											/>
										) : (
											<>
												<AccessTimeRoundedIcon
													sx={{ marginRight: "10px" }}
													color="primary"
													fontSize="medium"
												/>
												<Typography
													sx={{ color: "black" }}
													variant="subtitle2"
												>
													{matchDetail.date instanceof Date
														? `${matchDetail.date.getDate()}/${
																matchDetail.date.getMonth() + 1
														  }/${matchDetail.date.getFullYear()} ${matchDetail.date.getHours()}:${
																matchDetail.date.getMinutes() < 10
																	? `0${matchDetail.date.getMinutes()}`
																	: matchDetail.date.getMinutes()
														  }`
														: matchDetail.date}
												</Typography>
											</>
										)}
									</Box>
								</Box>
								<Box
									sx={{
										display: "flex",
										minHeight: "100px",
									}}
								>
									<Box sx={{ display: "flex", width: "41%" }}>
										<Box
											sx={{
												display: "flex",
												position: "relative",
												justifyContent: "center",
												alignItems: "center",
												width: "100%",
											}}
										>
											<Box sx={{ height: "auto", width: "120px" }}>
												<img
													style={{
														height: "auto",
														width: "100%",
														objectFit: "contain",
														borderRadius: "10px",
													}}
													src={matchDetail.homeTeam.logo}
													alt="home-team-logo"
												/>
											</Box>
											{editMode ? (
												<TextField
													size="small"
													sx={{
														position: "absolute",
														right: "0",
														top: "50%",
														transform: "translateY(-50%)",
														maxWidth: "100px",
													}}
													label="Điểm số"
													name="home-point"
													variant="outlined"
													value={matchDetail.homeTeam.point ?? ""}
													onChange={handleOnChange}
												/>
											) : (
												<Typography
													sx={{
														position: "absolute",
														right: "0",
														top: "50%",
														transform: "translateY(-50%)",
													}}
													color="primary"
													variant="h3"
												>
													{matchDetail.homeTeam.point ?? ""}
												</Typography>
											)}
										</Box>
									</Box>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											width: "18%",
										}}
									>
										<Box
											sx={{
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
												width: "100%",
											}}
										>
											<Typography sx={{ fontSize: "1rem", fontWeight: 700 }}>
												VS
											</Typography>
										</Box>
									</Box>
									<Box sx={{ display: "flex", width: "41%" }}>
										<Box
											sx={{
												display: "flex",
												width: "100%",
												justifyContent: "center",
												alignItems: "center",
												position: "relative",
											}}
										>
											{editMode ? (
												<TextField
													size="small"
													sx={{
														position: "absolute",
														left: "0",
														top: "50%",
														transform: "translateY(-50%)",
														maxWidth: "100px",
													}}
													label="Điểm số"
													name="away-point"
													variant="outlined"
													value={matchDetail.awayTeam.point ?? ""}
													onChange={handleOnChange}
												/>
											) : (
												<Typography
													sx={{
														position: "absolute",
														left: "0",
														top: "50%",
														transform: "translateY(-50%)",
													}}
													color="primary"
													variant="h3"
												>
													{matchDetail.awayTeam.point ?? ""}
												</Typography>
											)}
											<Box sx={{ height: "auto", width: "120px" }}>
												<img
													style={{
														height: "auto",
														width: "100%",
														objectFit: "contain",
														borderRadius: "10px",
													}}
													src={matchDetail.awayTeam.logo}
													alt="home-team-logo"
												/>
											</Box>
										</Box>
									</Box>
								</Box>
								{titleList.map((item, index) => (
									<Box
										key={index}
										sx={{
											display: "flex",
											padding: "0.75rem 0",
										}}
									>
										<Box
											sx={{
												display: "flex",
												width: "41%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											{editMode && item.dataKey !== "name" ? ( // cannot change team name
												<TextField
													size="small"
													label={item.title}
													name={`home-${item.dataKey}`}
													variant="outlined"
													value={
														matchDetail.homeTeam[
															item.dataKey as keyof ITeamMatchDetailType
														] ?? ""
													}
													onChange={handleOnChange}
												/>
											) : (
												<>
													<Typography variant="body2">
														{matchDetail.homeTeam[
															item.dataKey as keyof ITeamMatchDetailType
														]
															? `${
																	matchDetail.homeTeam[
																		item.dataKey as keyof ITeamMatchDetailType
																	]
															  }${item.postfix || ""}`
															: ""}
													</Typography>
												</>
											)}
										</Box>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												width: "18%",
											}}
										>
											<Typography sx={{ fontWeight: "700" }} variant="body2">
												{item.title}
											</Typography>
										</Box>
										<Box
											sx={{
												display: "flex",
												width: "41%",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											{editMode && item.dataKey !== "name" ? ( // cannot change team name
												<TextField
													size="small"
													label={item.title}
													name={`away-${item.dataKey}`}
													variant="outlined"
													value={
														matchDetail.awayTeam[
															item.dataKey as keyof ITeamMatchDetailType
														] ?? ""
													}
													onChange={handleOnChange}
												/>
											) : (
												<>
													<Typography variant="body2">
														{matchDetail.awayTeam[
															item.dataKey as keyof ITeamMatchDetailType
														]
															? `${
																	matchDetail.awayTeam[
																		item.dataKey as keyof ITeamMatchDetailType
																	]
															  }${item.postfix || ""}`
															: ""}
													</Typography>
												</>
											)}
										</Box>
									</Box>
								))}
								<Divider></Divider>
								<MatchLineup
									matchDetail={matchDetail}
									editMode={editMode}
									openModal={handleOpenChooseLineup}
								/>
								<Divider></Divider>
								<MatchEvent
									matchEvent={matchEvent}
									setMatchEvent={setMatchEvent}
									editMode={editMode}
									openModal={handleOpenAddEvent}
								/>
							</Stack>
						</Box>
					)}
				</DialogContent>
				<DialogActions>
					<Button
						color="primary"
						variant="contained"
						onClick={() => {
							setEditMode(false);
							onClose(refresh.current);
							refresh.current = false;
						}}
					>
						Đóng
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default ViewMatchDetail;
