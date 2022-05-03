import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	FormControl,
	InputLabel,
	MenuItem,
	Radio,
	Select,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { IBaseComponentProps } from "../../../../../../../@types/ComponentInterfaces";
import { IModalData } from "../ChooseLineupDialog";
import { IMatchDetailType } from "../MatchDetailInterfaces";

export interface IPlayerEventDialog {
	playerId: string;
	name: string;
	stripNumber: number;
}

export interface IAddMatchEventProps extends IBaseComponentProps {
	open: boolean;
	onClose: Function;
	data: IModalData;
	matchData: IMatchDetailType;
}

const EVENT = [
	{
		name: "Ghi bàn",
		value: "normal",
		subSelect: [
			// use the empty string to disable the select input
			"Chọn cầu thủ ghi bàn",
			"Chọn cầu thủ kiến tạo",
		],
	},
	{
		name: "Phản lưới nhà",
		value: "og",
		subSelect: [
			// use the empty string to disable the select input
			"Chọn cầu thủ",
			"",
		],
	},
	{
		name: "Phạt đền",
		value: "penalty",
		subSelect: [
			// use the empty string to disable the select input
			"Chọn cầu thủ",
			"",
		],
	},
	{
		name: "Thẻ vàng",
		value: "yellow",
		subSelect: [
			// use the empty string to disable the select input
			"Chọn cầu thủ nhận thẻ",
			"",
		],
	},
	{
		name: "Thẻ đỏ",
		value: "red",
		subSelect: [
			// use the empty string to disable the select input
			"Chọn cầu thủ nhận thẻ",
			"",
		],
	},
	{
		name: "Thay người",
		value: "sub",
		subSelect: [
			// use the empty string to disable the select input
			"Chọn cầu thủ ra",
			"Chọn cầu thủ vào",
		],
	},
];

function AddMatchEventDialog(props: IAddMatchEventProps) {
	const { open, onClose, data, matchData } = props;
	const [eventType, setEventType] = useState("");
	const [mainSelect, setMainSelect] = useState("");
	const [subSelect, setSubSelect] = useState("");
	const [timeType, setTimeType] = useState(true); // true: normal minute, false: extra minute
	const [minuteNormal, setMinuteNormal] = useState("");
	const [minuteExtra, setMinuteExtra] = useState({
		main: "",
		extra: "",
	});
	const [playerList, setPlayerList] = useState<Array<IPlayerEventDialog>>([]);

	useEffect(() => {
		if (data.isHome) {
			setPlayerList([
				...matchData.homeTeam.lineup.map((player) => ({
					playerId: player.playerId,
					name: player.name,
					stripNumber: player.stripNumber,
				})),
				...matchData.homeTeam.substitution.map((player) => ({
					playerId: player.playerId,
					name: player.name,
					stripNumber: player.stripNumber,
				})),
			]);
		} else {
			setPlayerList([
				...matchData.awayTeam.lineup.map((player) => ({
					playerId: player.playerId,
					name: player.name,
					stripNumber: player.stripNumber,
				})),
				...matchData.awayTeam.substitution.map((player) => ({
					playerId: player.playerId,
					name: player.name,
					stripNumber: player.stripNumber,
				})),
			]);
		}
	}, [data, matchData]);

	const clearModal = () => {
		setEventType("");
		setMainSelect("");
		setSubSelect("");
		setMinuteNormal("");
		setMinuteExtra({
			main: "",
			extra: "",
		});
	};

	const handleSave = () => {
		const mainPlayer = playerList.find((player) => player.playerId === mainSelect);
		const subPlayer = playerList.find((player) => player.playerId === subSelect);
		const temp = {
			eventType: eventType === "sub" ? null : eventType,
			isHome: data.isHome,
			mainPlayer: {
				id: mainSelect,
				name: mainPlayer?.name,
				stripNumber: mainPlayer?.stripNumber,
			},
			minute: timeType ? minuteNormal : `${minuteExtra.main}+${minuteExtra.extra}`,
			subPlayer:
				subSelect === ""
					? undefined
					: {
							id: subSelect,
							name: subPlayer?.name,
							stripNumber: subPlayer?.stripNumber,
					  },
		};
		onClose(temp);
		clearModal();
	};

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.target;
		if (target.name === "normalMinute") {
			setMinuteNormal(target.value);
		} else if (target.name === "mainMinute") {
			setMinuteExtra({ ...minuteExtra, main: target.value });
		} else setMinuteExtra({ ...minuteExtra, extra: target.value });
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
					Chọn sự kiện trận đấu
				</Box>
			</DialogTitle>
			<DialogContent>
				<Stack sx={{ width: "500px" }} spacing={3}>
					<Stack sx={{ width: "100%" }} direction="row" spacing={3}>
						<Box sx={{ width: "50%", display: "flex" }}>
							<Stack sx={{ width: "100%" }} spacing={3}>
								<FormControl sx={{ marginTop: 1, width: "100%" }} size="small">
									<InputLabel id="event-type">Loại sự kiện</InputLabel>
									<Select
										labelId="event-type"
										label="Loại sự kiện"
										value={eventType}
										onChange={(e) => {
											setMainSelect("");
											setSubSelect("");
											setEventType(e.target.value);
										}}
									>
										{EVENT.map((item, index) => (
											<MenuItem key={index} value={item.value}>
												{item.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Stack>
						</Box>
						<Box sx={{ width: "50%", display: "flex" }}>
							<Stack sx={{ width: "100%" }} spacing={3}>
								<Box sx={{ width: "100%" }}>
									<FormControl sx={{ marginTop: 1, width: "100%" }} size="small">
										<InputLabel id="main-select">
											{
												EVENT.find((item) => item.value === eventType)
													?.subSelect[0]
											}
										</InputLabel>
										<Select
											labelId="main-select"
											label={
												EVENT.find((item) => item.value === eventType)
													?.subSelect[0]
											}
											disabled={
												EVENT.find((item) => item.value === eventType)
													?.subSelect[0] === "" || eventType === ""
											}
											value={mainSelect}
											onChange={(e) => setMainSelect(e.target.value)}
										>
											{playerList.map((item, index) => (
												<MenuItem
													key={index}
													value={item.playerId}
													disabled={item.playerId === subSelect}
												>
													{item.name}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Box>
								<FormControl sx={{ marginTop: 1, width: "100%" }} size="small">
									<InputLabel id="sub-select">
										{
											EVENT.find((item) => item.value === eventType)
												?.subSelect[1]
										}
									</InputLabel>
									<Select
										labelId="sub-select"
										label={
											EVENT.find((item) => item.value === eventType)
												?.subSelect[1]
										}
										disabled={
											EVENT.find((item) => item.value === eventType)
												?.subSelect[1] === "" || eventType === ""
										}
										value={subSelect}
										onChange={(e) => setSubSelect(e.target.value)}
									>
										{playerList.map((item, index) => (
											<MenuItem
												key={index}
												value={item.playerId}
												disabled={item.playerId === mainSelect}
											>
												{item.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Stack>
						</Box>
					</Stack>
					<Divider></Divider>
					<Box
						sx={{
							marginTop: 1,
							width: "100%",
							display: "flex",
							justifyContent: "space-between",
						}}
					>
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<Radio checked={timeType} onChange={() => setTimeType(!timeType)} />
							<TextField
								sx={{ width: "100px" }}
								type="number"
								label="Phút"
								name="normalMinute"
								value={minuteNormal}
								variant="outlined"
								onChange={handleOnChange}
								disabled={!timeType}
								InputProps={{ inputProps: { min: 0, max: 120 } }}
								size="small"
							/>
						</Box>
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<Radio checked={!timeType} onChange={() => setTimeType(!timeType)} />
							<TextField
								sx={{ width: "100px" }}
								type="number"
								label="Phút"
								name="mainMinute"
								value={minuteExtra.main}
								variant="outlined"
								onChange={handleOnChange}
								disabled={timeType}
								InputProps={{ inputProps: { min: 0, max: 120 } }}
								size="small"
							/>
							<Typography
								sx={{
									display: "inline-block",
									margin: "0 1rem",
									fontSize: "1.25rem",
								}}
							>
								+
							</Typography>
							<TextField
								sx={{ width: "100px" }}
								type="number"
								label="Phút bù"
								name="extraMinute"
								value={minuteExtra.extra}
								variant="outlined"
								onChange={handleOnChange}
								disabled={timeType}
								InputProps={{ inputProps: { min: 0, max: 120 } }}
								size="small"
							/>
						</Box>
					</Box>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button
					color="primary"
					variant="text"
					onClick={() => {
						clearModal();
						onClose(false);
					}}
				>
					Đóng
				</Button>
				<Button color="primary" variant="contained" onClick={() => handleSave()}>
					Lưu
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default AddMatchEventDialog;
