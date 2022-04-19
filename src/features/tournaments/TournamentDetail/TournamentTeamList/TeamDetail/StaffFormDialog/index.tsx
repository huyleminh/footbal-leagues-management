import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	MenuItem,
	Select,
	Stack,
	TextField,
} from "@mui/material";
import React, { useState } from "react";
import { IBaseComponentProps } from "../../../../../../@types/ComponentInterfaces";

export interface IStaffFormDialog extends IBaseComponentProps {
	mode: "create" | "edit";
	open: boolean;
	onCancel: () => void;
	onSubmit: (data: IStaffFormDialogData) => void;
	data: IStaffFormDialogData;
}

export interface IStaffFormDialogData {
	fullname: string;
	country: string;
	role: number;
}

function StaffFormDialog(props: IStaffFormDialog) {
	const { mode, open, onCancel, onSubmit, data } = props;
	const [staff, setStaff] = useState<IStaffFormDialogData>(data);

	React.useEffect(() => {
		if (mode === "create") {
			setStaff({ fullname: "", country: "", role: 2 });
		} else setStaff(data);
	}, [mode]);

	const handleSubmit = () => {
		onSubmit(staff);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.target;
		setStaff({
			...staff,
			[target.name]: target.value.trim(),
		});
	};

	return (
		<Dialog
			open={open}
			maxWidth="xs"
			fullWidth
			disableEscapeKeyDown
			aria-labelledby="staff-dialog-title"
		>
			{mode === "create" && (
				<DialogTitle id="staff-dialog-title">Thêm mới ban huấn luyện</DialogTitle>
			)}
			{mode === "edit" && (
				<DialogTitle id="staff-dialog-title">Sửa đổi ban huấn luyện</DialogTitle>
			)}

			<DialogContent>
				<Stack spacing={2} sx={{ mt: 1 }}>
					<TextField
						type="text"
						variant="outlined"
						label="Tên thành viên"
						size="small"
						value={staff.fullname}
						onChange={handleChange}
						name="fullname"
					/>

					<TextField
						type="text"
						variant="outlined"
						label="Quốc tịch"
						size="small"
						value={staff.country}
						onChange={handleChange}
						name="country"
					/>

					<FormControl sx={{ m: 0 }} size="small">
						<Select
							labelId="role-select-label"
							value={staff.role}
							onChange={(event) =>
								setStaff({ ...staff, role: event.target.value as number })
							}
						>
							<MenuItem value={0}>HLV trưởng</MenuItem>
							<MenuItem value={1}>Trợ lý HLV</MenuItem>
							<MenuItem value={2}>Nhân viên</MenuItem>
						</Select>
					</FormControl>
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

export default StaffFormDialog;
