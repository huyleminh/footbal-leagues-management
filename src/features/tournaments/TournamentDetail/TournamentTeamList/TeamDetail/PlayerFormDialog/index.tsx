import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
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
	playerName: string;
	idNumber: string;
	country: string;
	stripNumber: number;
	position: string;
}

function PlayerFormDialog(props: IPlayerFormDialog) {
	const { mode, open, onCancel, onSubmit, data } = props;
	const [player, setPlayer] = useState<IPlayerFormDialogData>(data);

	React.useEffect(() => {
		if (mode === "edit") {
			setPlayer(data);
		} else
			setPlayer({
				playerName: "",
				idNumber: "",
				country: "",
				stripNumber: 0,
				position: "",
			});
	}, [mode]);

	const handleSubmit = () => {
		onSubmit(player);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.target;
		setPlayer({
			...player,
			[target.name]: target.value.trim(),
		});
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
					/>

					<TextField
						type="text"
						variant="outlined"
						label="Quốc tịch"
						placeholder="Ví dụ: Việt Nam"
						size="small"
						value={player.country}
						onChange={handleChange}
						name="country"
					/>

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
					/>

					<TextField
						type="text"
						variant="outlined"
						label="Vị trí thi đấu"
						placeholder="Ví dụ: Thủ môn"
						size="small"
						value={player.position}
						onChange={handleChange}
						name="position"
					/>
				</Stack>
			</DialogContent>

			<DialogActions>
				<Button variant="outlined" onClick={() => onCancel()}>
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
