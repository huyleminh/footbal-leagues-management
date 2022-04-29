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
import React, { useState } from "react";
import { IBaseComponentProps } from "../../../../../../../@types/ComponentInterfaces";
import CustomPagination from "../../../../../../../components/pagination";

export interface IModalData {
	matchId?: string;
	isHome?: boolean;
}

export interface IChooseLineupProps extends IBaseComponentProps {
	open: boolean;
	onClose: Function;
	data: IModalData;
}

export interface IPlayerDataDialog {
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
	const [totalPage, setTotalPage] = useState(1);
	const [pagination, setPagination] = useState({
		page: 1,
		maxItem: 5,
	});
	const [maxPlayer, setMaxPlayer] = useState(4);
	const [playerList, setPlayerList] = useState<Array<IPlayer>>([
		{
			player: {
				name: "P. Foden",
				stripNumber: 47,
				nationality: "Anh",
			},
		},
		{
			player: {
				name: "P. Foden",
				stripNumber: 47,
				nationality: "Anh",
			},
		},
		{
			player: {
				name: "P. Foden",
				stripNumber: 47,
				nationality: "Anh",
			},
		},
		{
			player: {
				name: "P. Foden",
				stripNumber: 47,
				nationality: "Anh",
			},
		},
		{
			player: {
				name: "P. Foden",
				stripNumber: 47,
				nationality: "Anh",
			},
		},
	]);

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
					item.player === player ? { ...item, isSelected: false, position: undefined } : item,
				),
			);
		}
	};

	const handleOnSelectPosition = (e: SelectChangeEvent, player: IPlayerDataDialog) => {
		setPlayerList(
			playerList.map((item) =>
				item.player === player
					? { ...item, position: InMatchPosition[parseInt(e.target.value)] }
					: item,
			),
		);
	};

	const handleSave = () => {
		onClose(false);
	}

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
					<TableContainer component={Card}>
						<Table sx={{ minWidth: 650 }} aria-label="simple table">
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
					<CustomPagination
						page={pagination.page}
						totalPage={totalPage}
						onChange={(value) =>
							setPagination({
								...pagination,
								page: value,
							})
						}
						allowChangeMax
						maxItem={pagination.maxItem}
						maxItemList={[5, 10, 15, 20, 25]}
						onChangeMaxItem={(value) =>
							setPagination({
								page: 1,
								maxItem: value,
							})
						}
						sx={{
							mt: 3,
							display: "inline-flex",
							justifyContent: "flex-end",
							width: "100%",
						}}
					/>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button color="primary" variant="text" onClick={() => onClose(false)}>
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
