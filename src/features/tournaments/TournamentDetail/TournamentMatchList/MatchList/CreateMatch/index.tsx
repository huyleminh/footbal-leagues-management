import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	FormControl,
	FormHelperText,
	InputLabel,
	LinearProgress,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { toast } from "material-react-toastify";
import { useEffect, useState } from "react";
import { IAPIResponse } from "../../../../../../@types/AppInterfaces";
import { IBaseComponentProps } from "../../../../../../@types/ComponentInterfaces";
import ToastMsg from "../../../../../../components/toast/ToastMsg";
import HttpService from "../../../../../../services/HttpService";

export interface ICreateMatchProps extends IBaseComponentProps {
	open: boolean;
	onClose: Function;
	totalRound: number;
	onSubmit: (item: ICreateMatchForm) => void;
	tournamentId?: string;
}

export interface ICreateMatchForm {
	homeId?: string;
	awayId?: string;
	stadiumName?: string;
	round?: number;
	scheduledDate?: Date | null;
}

interface IParticipantResData {
	_id: string;
	name: string;
	logo: string;
	totalMember: number;
	coachName: string;
}

const initValid = {
	homeId: {
		error: undefined,
		msg: "",
	},
	awayId: {
		error: undefined,
		msg: "",
	},
	stadiumName: {
		error: undefined,
		msg: "",
	},
	round: {
		error: undefined,
		msg: "",
	},
	scheduledDate: {
		error: undefined,
		msg: "",
	},
};

function CreateMatch(props: ICreateMatchProps) {
	const { open, onClose, onSubmit, totalRound, tournamentId } = props;
	const [form, setForm] = useState<ICreateMatchForm>({
		scheduledDate: null,
	});
	const [participantList, setParticipantList] = useState<Array<IParticipantResData>>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [valid, setValid] = useState<{
		homeId: {
			error: boolean | undefined;
			msg: string;
		};
		awayId: {
			error: boolean | undefined;
			msg: string;
		};
		stadiumName: {
			error: boolean | undefined;
			msg: string;
		};
		round: {
			error: boolean | undefined;
			msg: string;
		};
		scheduledDate: {
			error: boolean | undefined;
			msg: string;
		};
	}>(initValid);

	useEffect(() => {
		const fetchParticipants = async () => {
			setIsLoading(true);
			try {
				const res = await HttpService.get<
					IAPIResponse<Array<IParticipantResData> | string>
				>(`tournaments/${tournamentId}/participants`);
				if (res.code === 200) {
					setParticipantList(res.data as Array<IParticipantResData>);
				} else if (res.code === 400) {
					toast(<ToastMsg title={res.data as string} type="error" />, {
						type: toast.TYPE.ERROR,
					});
				} else {
					toast(<ToastMsg title="C?? l???i x???y ra, vui l??ng th??? l???i sau!" type="error" />, {
						type: toast.TYPE.ERROR,
					});
				}
			} catch (err) {
				console.log(err);
				toast(<ToastMsg title="C?? l???i x???y ra, vui l??ng th??? l???i sau!" type="error" />, {
					type: toast.TYPE.ERROR,
				});
			}
			setIsLoading(false);
		};
		if (open) fetchParticipants();
	}, [open, tournamentId]);

	const clearForm = () => {
		setValid(initValid);
		setForm({
			scheduledDate: null,
		});
	};

	const handleSave = () => {
		const res = { ...form };
		const validate = { ...valid };

		// Validate individual field
		if (!res.homeId) {
			validate.homeId = {
				error: true,
				msg: "Thi???u ?????i nh??.",
			};
		} else {
			validate.homeId = {
				error: false,
				msg: "",
			};
		}

		if (!res.awayId) {
			validate.awayId = {
				error: true,
				msg: "Thi???u ?????i kh??ch.",
			};
		} else {
			validate.awayId = {
				error: false,
				msg: "",
			};
		}

		if (!res.round) {
			validate.round = {
				error: true,
				msg: "Thi???u v??ng ?????u.",
			};
		} else {
			validate.round = {
				error: false,
				msg: "",
			};
		}

		if (!res.scheduledDate) {
			validate.scheduledDate = {
				error: true,
				msg: "Thi???u th???i gian b???t ?????u tr???n.",
			};
		} else {
			validate.scheduledDate = {
				error: false,
				msg: "",
			};
		}

		if (!res.stadiumName || res.stadiumName === "") res.stadiumName = "Ch??a x??c ?????nh";

		setValid(validate);

		if (
			validate.homeId.error === false &&
			validate.awayId.error === false &&
			validate.round.error === false &&
			validate.scheduledDate.error === false
		) {
			clearForm();
			onSubmit(res);
		}
	};

	const handleChange = (e: any) => {
		const target = e.target;
		setForm({
			...form,
			[target.name]: target.value,
		});
	};

	const handleChangeTime = (newValue: Date | null) => {
		setForm({ ...form, scheduledDate: newValue });
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
					T???o tr???n ?????u m???i
				</Box>
			</DialogTitle>
			<DialogContent>
				<Stack spacing={3}>
					{isLoading ? (
						<Box sx={{ width: "100%" }}>
							<LinearProgress />
						</Box>
					) : (
						<Box sx={{ display: "flex" }}>
							<Box sx={{ width: "30%" }}>
								<FormControl
									sx={{ marginTop: 1, width: "100%" }}
									size="small"
									required
									error={valid.homeId.error}
								>
									<InputLabel id="home-team">Ch???n ?????i nh??</InputLabel>
									<Select
										labelId="home-team"
										label="Ch???n ?????i nh??"
										name="homeId"
										value={form.homeId || ""}
										onChange={handleChange}
									>
										{participantList.map((item, index) => (
											<MenuItem
												key={index}
												value={item._id}
												disabled={form.awayId === item._id}
											>
												{item.name}
											</MenuItem>
										))}
									</Select>
									<FormHelperText>{valid.homeId.msg}</FormHelperText>
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
								<FormControl
									sx={{ marginTop: 1, width: "100%" }}
									size="small"
									required
									error={valid.awayId.error}
								>
									<InputLabel id="away-team">Ch???n ?????i kh??ch</InputLabel>
									<Select
										labelId="away-team"
										label="Ch???n ?????i kh??ch"
										name="awayId"
										value={form.awayId || ""}
										onChange={handleChange}
									>
										{participantList.map((item, index) => (
											<MenuItem
												key={index}
												value={item._id}
												disabled={form.homeId === item._id}
											>
												{item.name}
											</MenuItem>
										))}
									</Select>
									<FormHelperText>{valid.awayId.msg}</FormHelperText>
								</FormControl>
							</Box>
						</Box>
					)}
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
							<FormControl
								sx={{ marginTop: 1, width: "100%" }}
								size="small"
								required
								error={valid.round.error}
							>
								<InputLabel id="round">V??ng ?????u</InputLabel>
								<Select
									labelId="round"
									label="V??ng ?????u"
									name="round"
									value={form.round ?? ""}
									onChange={handleChange}
								>
									{[...Array(totalRound)].map((item, index) => (
										<MenuItem key={index} value={(index + 1) as number}>
											{`V??ng ${index + 1}`}
										</MenuItem>
									))}
								</Select>
								<FormHelperText>{valid.round.msg}</FormHelperText>
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
								label="Th???i gian"
								value={form.scheduledDate}
								onChange={handleChangeTime}
								minDate={new Date(new Date().getTime() + 86400000)}
								defaultCalendarMonth={new Date(new Date().getTime() + 86400000)}
								renderInput={(params) => (
									<TextField
										{...params}
										size="small"
										sx={{ width: "100%" }}
										required
										error={valid.scheduledDate.error}
										helperText={valid.scheduledDate.msg}
									/>
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
								label="S??n ?????u"
								size="small"
								name="stadiumName"
								value={form.stadiumName ?? ""}
								variant="outlined"
								onChange={handleChange}
							/>
						</Box>
						<Box sx={{ width: "30%" }}></Box>
					</Box>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button color="primary" variant="text" onClick={() => onClose(false)}>
					????ng
				</Button>
				<Button color="primary" variant="contained" onClick={() => handleSave()}>
					L??u
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default CreateMatch;
