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
	Select,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useState } from "react";
import { IBaseComponentProps } from "../../../../../../@types/ComponentInterfaces";

export interface ICreateMatchProps extends IBaseComponentProps {
	open: boolean;
	onClose: Function;
}

interface ICreateMatchForm {
	homeTeam?: string;
	awayTeam?: string;
	stadium?: string;
	round?: number;
	startDate?: Date | null;
}

function CreateMatch(props: ICreateMatchProps) {
	const { open, onClose } = props;
	const [form, setForm] = useState<ICreateMatchForm>({
		startDate: null,
	});

	const handleSave = () => {
		onClose(false);
	};

	const handleChangeTime = (newValue: Date | null) => {
		setForm({ ...form, startDate: newValue });
	};

	return (
		<Dialog maxWidth="sm" fullWidth onClose={() => onClose(false)} open={open} scroll="paper">
			<DialogTitle>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
					}}
				>
					Tạo trận đấu mới
				</Box>
			</DialogTitle>
			<DialogContent>
				<Stack spacing={3}>
					<Box sx={{ display: "flex" }}>
						<Box sx={{ width: "30%" }}>
							<FormControl sx={{ marginTop: 1, width: "100%" }} size="small" required>
								<InputLabel id="home-team">Chọn đội nhà</InputLabel>
								<Select
									labelId="home-team"
									label="Chọn đội nhà"
									// value={eventType}
									// onChange={(e) => setEventType(e.target.value)}
								>
									{/* <MenuItem key={index} value={item.value}>
											{item.name}
										</MenuItem> */}
								</Select>
							</FormControl>
						</Box>
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								width: "40%",
							}}
						>
							<Typography variant="h5">VS</Typography>
						</Box>
						<Box sx={{ width: "30%" }}>
							<FormControl sx={{ marginTop: 1, width: "100%" }} size="small" required>
								<InputLabel id="away-team">Chọn đội khách</InputLabel>
								<Select
									labelId="away-team"
									label="Chọn đội khách"
									// value={eventType}
									// onChange={(e) => setEventType(e.target.value)}
								>
									{/* <MenuItem key={index} value={item.value}>
											{item.name}
										</MenuItem> */}
								</Select>
							</FormControl>
						</Box>
					</Box>
					<Divider></Divider>
					<Box sx={{ display: "flex" }}>
						<Box sx={{ width: "30%" }}></Box>
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								width: "40%",
							}}
						>
							<FormControl sx={{ marginTop: 1, width: "100%" }} size="small" required>
								<InputLabel id="round">Vòng đấu</InputLabel>
								<Select
									labelId="round"
									label="Vòng đấu"
									// value={eventType}
									// onChange={(e) => setEventType(e.target.value)}
								>
									{/* <MenuItem key={index} value={item.value}>
                                                        {item.name}
                                                    </MenuItem> */}
								</Select>
							</FormControl>
						</Box>
						<Box sx={{ width: "30%" }}></Box>
					</Box>
					<Box sx={{ display: "flex" }}>
						<Box sx={{ width: "30%" }}></Box>
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								width: "40%",
							}}
						>
							<DateTimePicker
								label="Thời gian"
								value={form.startDate}
								onChange={handleChangeTime}
								minDate={new Date(new Date().getTime() + 86400000)}
								disableHighlightToday
								renderInput={(params) => (
									<TextField size="small" sx={{ width: "100%" }} required {...params} />
								)}
							/>
						</Box>
						<Box sx={{ width: "30%" }}></Box>
					</Box>
					<Box sx={{ display: "flex" }}>
						<Box sx={{ width: "30%" }}></Box>
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								width: "40%",
							}}
						>
							<TextField
								sx={{ width: "100%" }}
								label="Sân đấu"
								size="small"
								// name="mainMinute"
								// value={minuteExtra.main}
								variant="outlined"
								// onChange={handleOnChange}
							/>
						</Box>
						<Box sx={{ width: "30%" }}></Box>
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

export default CreateMatch;
