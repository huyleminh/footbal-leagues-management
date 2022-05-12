import {
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Stack,
	TextField,
} from "@mui/material";
import React, { useState } from "react";
import { IBaseComponentProps } from "../../../../../../@types/ComponentInterfaces";

export interface IPlayerFormDialog extends IBaseComponentProps {
	mode: "create" | "edit" | "replace";
	open: boolean;
	onCancel: () => void;
	onSubmit: (data: IPlayerFormDialogData) => void;
	data: IPlayerFormDialogData;
}

export interface IPlayerFormDialogData {
	id?: string;
	playerName: string;
	idNumber: string;
	country: string;
	stripNumber: number;
	position: string;
	type: number;
}

const InMatchPosition = ["Thủ môn", "Hậu vệ", "Tiền vệ", "Tiền đạo"];

const initValid = {
	playerName: {
		error: undefined,
		msg: "",
	},
	idNumber: {
		error: undefined,
		msg: "",
	},
	country: {
		error: undefined,
		msg: "",
	},
	stripNumber: {
		error: undefined,
		msg: "",
	},
	position: {
		error: undefined,
		msg: "",
	},
};

function PlayerFormDialog(props: IPlayerFormDialog) {
	const { mode, open, onCancel, onSubmit, data } = props;
	const [player, setPlayer] = useState<IPlayerFormDialogData>(data);
	const [valid, setValid] = useState<{
		playerName: {
			error: boolean | undefined;
			msg: string;
		};
		idNumber: {
			error: boolean | undefined;
			msg: string;
		};
		country: {
			error: boolean | undefined;
			msg: string;
		};
		stripNumber: {
			error: boolean | undefined;
			msg: string;
		};
		position: {
			error: boolean | undefined;
			msg: string;
		};
	}>(initValid);

	React.useEffect(() => {
		if (mode === "edit") {
			setPlayer(data);
		} else {
			setPlayer({
				id: data?.id,
				playerName: "",
				idNumber: "",
				country: "",
				stripNumber: 0,
				position: "",
				type: 0,
			});
		}
	}, [mode, data]);

	const clearForm = () => {
		setValid(initValid);
		setPlayer({
			id: undefined,
			playerName: "",
			idNumber: "",
			country: "",
			stripNumber: 0,
			position: "",
			type: 0,
		});
	};

	const handleSubmit = () => {
		const validate = { ...valid };
		const resPlayer = {
			...player,
			playerName: player.playerName.trim(),
			idNumber: player.idNumber.trim(),
			country: player.country.trim(),
			position: player.position.trim(),
		};
		// validate individual field before submit
		if (resPlayer.playerName === "") {
			validate.playerName = {
				error: true,
				msg: "Vui lòng không để trống.",
			};
		} else {
			validate.playerName = {
				error: false,
				msg: "",
			};
		}

		if (resPlayer.idNumber === "") {
			validate.idNumber = {
				error: true,
				msg: "Vui lòng không để trống.",
			};
		} else {
			validate.idNumber = {
				error: false,
				msg: "",
			};
		}

		if (resPlayer.country === "") {
			validate.country = {
				error: true,
				msg: "Vui lòng không để trống.",
			};
		} else {
			validate.country = {
				error: false,
				msg: "",
			};
		}

		if (resPlayer.stripNumber === 0) {
			validate.stripNumber = {
				error: true,
				msg: "Vui lòng chọn số áo.",
			};
		} else {
			validate.stripNumber = {
				error: false,
				msg: "",
			};
		}

		if (resPlayer.position === "") {
			validate.position = {
				error: true,
				msg: "Vui lòng chọn vị trí đấu.",
			};
		} else {
			validate.position = {
				error: false,
				msg: "",
			};
		}

		setValid(validate);

		if (
			validate.playerName.error === false &&
			validate.idNumber.error === false &&
			validate.country.error === false &&
			validate.stripNumber.error === false &&
			validate.position.error === false
		) {
			clearForm();
			onSubmit(resPlayer);
		}
	};

	const handleOnSelectPosition = (e: SelectChangeEvent) => {
		setPlayer({
			...player,
			position: InMatchPosition[parseInt(e.target.value)],
		});
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.target;
		if (target.name === "type") {
			setPlayer({
				...player,
				[target.name]: target.checked ? 1 : 0,
			});
		} else if (target.name === "stripNumber") {
			setPlayer({
				...player,
				[target.name]: parseInt(target.value),
			});
		} else {
			setPlayer({
				...player,
				[target.name]: target.value,
			});
		}
	};

	return (
		<Dialog
			open={open}
			maxWidth="xs"
			fullWidth
			disableEscapeKeyDown
			aria-labelledby="player-dialog-title"
		>
			{mode === "create" && (
				<DialogTitle id="player-dialog-title">Thêm mới cầu thủ</DialogTitle>
			)}
			{mode === "edit" && (
				<DialogTitle id="player-dialog-title">{`Sửa đổi cầu thủ - ${data?.playerName}`}</DialogTitle>
			)}
			{mode === "replace" && (
				<DialogTitle id="player-dialog-title">{`Thay thế cầu thủ - ${data?.playerName}`}</DialogTitle>
			)}

			<DialogContent>
				<Stack spacing={2} sx={{ mt: 1 }}>
					<TextField
						type="text"
						variant="outlined"
						label="Tên cầu thủ"
						size="small"
						value={player.playerName}
						onChange={handleChange}
						name="playerName"
						error={valid.playerName.error}
						helperText={valid.playerName.msg}
					/>

					<TextField
						type="text"
						variant="outlined"
						label="Số định danh"
						placeholder="Ví dụ: 123456789321"
						size="small"
						value={player.idNumber}
						onChange={handleChange}
						name="idNumber"
						error={valid.idNumber.error}
						helperText={valid.idNumber.msg}
					/>

					<Stack direction="row" spacing={2}>
						<TextField
							type="text"
							variant="outlined"
							label="Quốc tịch"
							placeholder="Ví dụ: Việt Nam"
							size="small"
							value={player.country}
							onChange={handleChange}
							name="country"
							error={valid.country.error}
							helperText={valid.country.msg}
						/>
						<FormGroup>
							<FormControlLabel
								label="Nhập tịch"
								control={
									<Checkbox
										defaultChecked={false}
										name="type"
										onChange={(e) => handleChange(e)}
										inputProps={{ "aria-label": "controlled" }}
									/>
								}
							/>
						</FormGroup>
					</Stack>

					<TextField
						type="number"
						inputProps={{
							min: 0,
						}}
						variant="outlined"
						label="Số áo thi đấu"
						size="small"
						value={player.stripNumber}
						onChange={handleChange}
						name="stripNumber"
						error={valid.stripNumber.error}
						helperText={valid.stripNumber.msg}
					/>
					<FormControl
						sx={{ m: 1, width: "100%" }}
						size="small"
						error={valid.position.error}
					>
						<InputLabel id="position-select">Vị trí thi đấu</InputLabel>
						<Select
							labelId="position-select"
							label="Vị trí thi đấu"
							value={
								InMatchPosition.indexOf(player.position) === -1
									? ""
									: InMatchPosition.indexOf(player.position).toString()
							}
							onChange={handleOnSelectPosition}
						>
							{InMatchPosition.map((element, i) => (
								<MenuItem key={i} value={i}>
									{element}
								</MenuItem>
							))}
						</Select>
						<FormHelperText>{valid.position.msg}</FormHelperText>
					</FormControl>
				</Stack>
			</DialogContent>

			<DialogActions>
				<Button
					variant="text"
					onClick={() => {
						clearForm();
						onCancel();
					}}
				>
					Hủy
				</Button>
				<Button variant="contained" onClick={handleSubmit}>
					Lưu
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default PlayerFormDialog;
