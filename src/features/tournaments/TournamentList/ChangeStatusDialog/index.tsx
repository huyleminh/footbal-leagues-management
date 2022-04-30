import {
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControl,
	MenuItem,
	Select,
	Stack,
	Typography,
} from "@mui/material";
import React from "react";
import { IBaseComponentProps } from "../../../../@types/ComponentInterfaces";

export interface IChangeStatusDialog extends IBaseComponentProps {
	open: boolean;
	onCancel: () => void | undefined;
	onSubmit: (data: IChangeStatusDialogData) => void;
	loading: boolean;
	subtitle: string;
	previousStatus: JSX.Element;
    id: string;
}

export interface IChangeStatusDialogData {
	id: string;
	value: number;
}

const statusMap = [
	{ value: 0, title: "Sắp diễn ra" },
	{ value: 1, title: "Đang diễn ra" },
	{ value: 2, title: "Sắp kết thúc" },
	{ value: 3, title: "Kết thúc" },
];

function ChangeStatusDialog(props: IChangeStatusDialog) {
	const { open, onCancel, onSubmit, loading, subtitle, previousStatus, id } = props;

	const [newStatus, setNewStatus] = React.useState<number>(0);

	const handleSubmit = () => {
		onSubmit({ id, value: newStatus });
	};

	return (
		<Dialog
			open={open}
			aria-labelledby="change-tournament-status-dialog-title"
			maxWidth="xs"
			fullWidth
			disableEscapeKeyDown
		>
			<DialogTitle id="change-tournament-status-dialog-title">
				Chuyển trạng thái giải đấu
			</DialogTitle>

			<DialogContent>
				<DialogContentText variant="subtitle2" sx={{ mb: 3 }}>
					{subtitle}
				</DialogContentText>

				<Stack spacing={2}>
					<Stack direction="row" spacing={3} sx={{ width: "100%", alignItems: "center" }}>
						<Typography
							sx={{
								fontWeight: "500",
								fontSize: "15px",
								minWidth: 135,
							}}
						>
							Trạng thái ban đầu
						</Typography>
						{previousStatus}
					</Stack>

					<Stack direction="row" spacing={3} sx={{ width: "100%", alignItems: "center" }}>
						<Typography
							sx={{
								fontWeight: "500",
								fontSize: "15px",
								minWidth: 135,
							}}
						>
							Trạng thái mới
						</Typography>
						<FormControl size="small">
							<Select
								value={newStatus}
								onChange={(e) => setNewStatus(+e.target.value)}
							>
								{statusMap.map((status, index) => (
									<MenuItem key={index} value={status.value}>{status.title}</MenuItem>
								))}
							</Select>
						</FormControl>
					</Stack>
				</Stack>
			</DialogContent>

			<DialogActions>
				<Button disabled={loading} variant="text" onClick={() => onCancel()}>
					Hủy
				</Button>
				<Button
					disabled={loading}
					variant="contained"
					onClick={handleSubmit}
					startIcon={loading ? <CircularProgress color="inherit" size={15} /> : <></>}
				>
					Lưu
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ChangeStatusDialog;
