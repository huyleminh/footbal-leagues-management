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
	LinearProgress,
	MenuItem,
	Radio,
	Select,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import React, { useState } from "react";
import { IBaseComponentProps } from "../../../../../../../@types/ComponentInterfaces";
import { IModalData, IPlayerDataDialog } from "../ChooseLineupDialog";
import { EVENT_TYPE } from "../MatchEvent";

export interface IAddMatchEventProps extends IBaseComponentProps {
	open: boolean;
	onClose: Function;
	data: IModalData;
}

const EVENT = [
	{
		name: "Ghi bàn",
		value: EVENT_TYPE.GOAL,
		subSelect: [
			// use the empty string to disable the select input
			"Chọn cầu thủ ghi bàn",
			"Chọn cầu thủ kiến tạo",
		],
	},
	{
		name: "Phản lưới nhà",
		value: EVENT_TYPE.OG,
		subSelect: [
			// use the empty string to disable the select input
			"Chọn cầu thủ",
			"",
		],
	},
	{
		name: "Phạt đền",
		value: EVENT_TYPE.PEN,
		subSelect: [
			// use the empty string to disable the select input
			"Chọn cầu thủ",
			"",
		],
	},
	{
		name: "Thẻ vàng",
		value: EVENT_TYPE.YEL_CARD,
		subSelect: [
			// use the empty string to disable the select input
			"Chọn cầu thủ nhận thẻ",
			"",
		],
	},
	{
		name: "Thẻ đỏ",
		value: EVENT_TYPE.RED_CARD,
		subSelect: [
			// use the empty string to disable the select input
			"Chọn cầu thủ nhận thẻ",
			"",
		],
	},
	{
		name: "Thay người",
		value: EVENT_TYPE.SUBSTITUTION,
		subSelect: [
			// use the empty string to disable the select input
			"Chọn cầu thủ ra",
			"Chọn cầu thủ vào",
		],
	},
];

function AddMatchEventDialog(props: IAddMatchEventProps) {
	const { open, onClose, data } = props;
	const [isLoading, setIsLoading] = useState(false);
	const [eventType, setEventType] = useState("");
	const [mainSelect, setMainSelect] = useState("");
	const [subSelect, setSubSelect] = useState("");
	const [timeType, setTimeType] = useState(true); // true: normal minute, false: extra minute
	const [minuteNormal, setMinuteNormal] = useState("");
	const [minuteExtra, setMinuteExtra] = useState({
		main: "",
		extra: "",
	});
	const [playerList, setPlayerList] = useState<Array<IPlayerDataDialog>>([
		{
			name: "P. Foden",
			stripNumber: 47,
			nationality: "Anh",
		},
		{
			name: "P. Foden",
			stripNumber: 47,
			nationality: "Anh",
		},
		{
			name: "P. Foden",
			stripNumber: 47,
			nationality: "Anh",
		},
	]);

	const handleSave = () => {
		onClose(false);
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
										onChange={(e) => setEventType(e.target.value)}
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
												EVENT.find(
													(item) => item.value === parseInt(eventType),
												)?.subSelect[0]
											}
										</InputLabel>
										<Select
											labelId="main-select"
											label={
												EVENT.find(
													(item) => item.value === parseInt(eventType),
												)?.subSelect[0]
											}
											disabled={
												EVENT.find(
													(item) => item.value === parseInt(eventType),
												)?.subSelect[0] === ""
											}
										>
											{/* {playerList.map((item, index) => (
									<MenuItem key={index}>
										{item}
									</MenuItem>
								))} */}
										</Select>
									</FormControl>
								</Box>
								<FormControl sx={{ marginTop: 1, width: "100%" }} size="small">
									<InputLabel id="sub-select">
										{
											EVENT.find((item) => item.value === parseInt(eventType))
												?.subSelect[1]
										}
									</InputLabel>
									<Select
										labelId="sub-select"
										label={
											EVENT.find((item) => item.value === parseInt(eventType))
												?.subSelect[1]
										}
										disabled={
											EVENT.find((item) => item.value === parseInt(eventType))
												?.subSelect[1] === ""
										}
									>
										{/* {playerList.map((item, index) => (
									<MenuItem key={index}>
										{item}
									</MenuItem>
								))} */}
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
						<Box sx={{ display: "flex", "& > *": { marginRight: "10px" } }}>
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
							/>
						</Box>
						<Box sx={{ display: "flex", "& > *": { marginRight: "10px" } }}>
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
							/>
							<Typography
								sx={{ display: "inline-flex", alignItems: "center" }}
								variant="body1"
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
							/>
						</Box>
					</Box>
				</Stack>
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

export default AddMatchEventDialog;
