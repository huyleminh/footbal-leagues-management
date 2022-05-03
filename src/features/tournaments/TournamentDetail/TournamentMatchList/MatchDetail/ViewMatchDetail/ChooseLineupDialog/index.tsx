import {
	Box,
	Button,
	Card,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	LinearProgress,
	MenuItem,
	Select,
	SelectChangeEvent,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import { toast } from "material-react-toastify";
import React, { useEffect, useState } from "react";
import { useMatch } from "react-router-dom";
import { IAPIResponse } from "../../../../../../../@types/AppInterfaces";
import { IBaseComponentProps } from "../../../../../../../@types/ComponentInterfaces";
import ToastMsg from "../../../../../../../components/toast/ToastMsg";
import HttpService from "../../../../../../../services/HttpService";

export interface IModalData {
	matchId?: string;
	isHome?: boolean;
	teamId?: string;
}

export interface IChooseLineupProps extends IBaseComponentProps {
	open: boolean;
	onClose: Function;
	data: IModalData;
}

export interface IPlayerDataDialog {
	playerId: string;
	name: string;
	stripNumber: number;
	nationality: string;
}

interface IPlayer {
	isSelected?: boolean;
	player: IPlayerDataDialog;
	position?: string;
}

const InMatchPosition = ["Thủ môn", "Hậu vệ", "Tiền vệ", "Tiền đạo", "Dự bị"]; // The first and the last element of this array must not be change

function ChooseLineupDialog(props: IChooseLineupProps) {
	const { open, onClose, data } = props;
	const [isLoading, setIsLoading] = useState(false);
	const [maxPlayer, setMaxPlayer] = useState(4);
	const [playerList, setPlayerList] = useState<Array<IPlayer>>([]);
	const match = useMatch("/tournaments/:id/matches");

	useEffect(() => {
		const fetchPlayer = async () => {
			setIsLoading(true);
			try {
				const [players, config] = await Promise.allSettled([
					HttpService.get<
						IAPIResponse<
							| Array<{
									_id: string;
									teamId: string;
									stripNumber: number;
									position: string;
									playerName: string;
									idNumber: string;
									country: string;
							  }>
							| string
						>
					>(`/teams/${data.teamId}/players`),
					HttpService.get<
						IAPIResponse<
							| {
									maxAbroadPlayer: number;
									maxAdditionalPlayer: number;
									maxPlayerAge: number;
									maxPlayerPerMatch: number;
									maxTeam: number;
							  }
							| string
						>
					>(`/tournaments/${match?.params.id}/config`),
				]);
				if (players.status === "fulfilled" && config.status === "fulfilled") {
					// handle players
					if (players.value.code === 200) {
						setPlayerList(
							(
								players.value.data as Array<{
									_id: string;
									teamId: string;
									stripNumber: number;
									position: string;
									playerName: string;
									idNumber: string;
									country: string;
								}>
							).map((player) => ({
								player: {
									playerId: player._id,
									name: player.playerName,
									stripNumber: player.stripNumber,
									nationality: player.country,
								},
							})),
						);
					} else if (players.value.code === 400) {
						toast(<ToastMsg title={players.value.data as string} type="error" />, {
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

					// handle config
					if (config.value.code === 200) {
						setMaxPlayer(
							(
								config.value.data as {
									maxAbroadPlayer: number;
									maxAdditionalPlayer: number;
									maxPlayerAge: number;
									maxPlayerPerMatch: number;
									maxTeam: number;
								}
							).maxPlayerPerMatch,
						);
					} else if (config.value.code === 400) {
						toast(<ToastMsg title={config.value.data as string} type="error" />, {
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
		if (open) fetchPlayer();
	}, [data, open, match?.params.id]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>, player: IPlayerDataDialog) => {
		if (e.target.checked) {
			if (maxPlayer - playerList.filter((item) => item.isSelected).length !== 0)
				setPlayerList(
					playerList.map((item) =>
						item.player === player ? { ...item, isSelected: true } : item,
					),
				);
		} else {
			setPlayerList(
				playerList.map((item) =>
					item.player === player
						? { ...item, isSelected: false, position: undefined }
						: item,
				),
			);
		}
	};

	const handleOnSelectPosition = (e: SelectChangeEvent, player: IPlayerDataDialog) => {
		if (
			playerList.filter(
				(item) =>
					item.isSelected &&
					item.position !== InMatchPosition[InMatchPosition.length - 1] &&
					item.position,
			).length >= 11 &&
			parseInt(e.target.value) !== InMatchPosition.length - 1
		) {
			toast(
				<ToastMsg
					title="Đã đạt số lượng cầu thủ ra sân tối đa, chỉ được chọn dự bị."
					type="warning"
				/>,
				{
					type: toast.TYPE.WARNING,
				},
			);
		} else {
			setPlayerList(
				playerList.map((item) =>
					item.player === player
						? { ...item, position: InMatchPosition[parseInt(e.target.value)] }
						: item,
				),
			);
		}
	};

	const handleSave = () => {
		onClose({ players: playerList.filter((player) => player.isSelected), isHome: data.isHome });
	};

	return (
		<Dialog maxWidth={false} onClose={() => onClose(false)} open={open} scroll="paper">
			<DialogTitle>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
					}}
				>
					<span>Chọn đội hình ra sân</span>
					<Box sx={{ display: "flex", flexDirection: "column" }}>
						<Typography
							variant="subtitle2"
							textAlign="right"
							sx={{ color: "black" }}
						>{`Còn ${
							maxPlayer - playerList.filter((item) => item.isSelected).length
						} lượt lựa chọn`}</Typography>
						<Typography
							variant="subtitle2"
							textAlign="right"
							sx={{ color: "black" }}
						>{`${
							playerList.filter(
								(item) =>
									item.isSelected &&
									item.position !== InMatchPosition[InMatchPosition.length - 1] &&
									item.position,
							).length
						} cầu thủ ra sân`}</Typography>
					</Box>
				</Box>
			</DialogTitle>
			<DialogContent>
				<Box>
					{isLoading ? (
						<Box sx={{ width: "100%" }}>
							<LinearProgress />
						</Box>
					) : null}
					<TableContainer sx={{ maxHeight: 440, overflow: "auto" }} component={Card}>
						<Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
							<TableHead>
								<TableRow>
									<TableCell
										align="left"
										sx={{ width: "50px", minWidth: "50px" }}
									></TableCell>
									<TableCell align="left">Số áo</TableCell>
									<TableCell align="left" sx={{ minWidth: "250px" }}>
										Tên
									</TableCell>
									<TableCell align="left" sx={{ minWidth: "150px" }}>
										Quốc tịch
									</TableCell>
									<TableCell align="left" sx={{ minWidth: "170px" }}>
										Vị trí
									</TableCell>
								</TableRow>
							</TableHead>
							{isLoading ? null : (
								<TableBody>
									{playerList.map((row, index) => (
										<TableRow
											key={index}
											sx={{
												"&:last-child td, &:last-child th": { border: 0 },
											}}
											hover
										>
											<TableCell align="left">
												<Checkbox
													checked={
														row.isSelected === undefined
															? false
															: row.isSelected
													}
													onChange={(e) => handleChange(e, row.player)}
													inputProps={{ "aria-label": "controlled" }}
												/>
											</TableCell>
											<TableCell align="left">
												{row.player.stripNumber}
											</TableCell>
											<TableCell align="left">{row.player.name}</TableCell>
											<TableCell align="left">
												{row.player.nationality}
											</TableCell>
											<TableCell align="left">
												<FormControl
													sx={{ m: 1, width: "100%" }}
													size="small"
												>
													<Select
														disabled={
															row.isSelected === undefined
																? true
																: !row.isSelected
														}
														value={
															row.position === undefined
																? ""
																: InMatchPosition.findIndex(
																		(item) =>
																			item === row.position,
																  ) === -1
																? ""
																: InMatchPosition.findIndex(
																		(item) =>
																			item === row.position,
																  ).toString()
														}
														onChange={(e: SelectChangeEvent<string>) =>
															handleOnSelectPosition(e, row.player)
														}
													>
														{InMatchPosition.map((element, i) => (
															<MenuItem
																key={i}
																disabled={
																	i === 0 &&
																	playerList.filter(
																		(item) =>
																			item.isSelected &&
																			item.position ===
																				InMatchPosition[0],
																	).length === 1
																		? true
																		: false
																}
																value={i}
															>
																{element}
															</MenuItem>
														))}
													</Select>
												</FormControl>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							)}
						</Table>
					</TableContainer>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button color="primary" variant="text" onClick={() => onClose(null)}>
					Đóng
				</Button>
				<Button color="primary" variant="contained" onClick={() => handleSave()}>
					Lưu
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ChooseLineupDialog;
