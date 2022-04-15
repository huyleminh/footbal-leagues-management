import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { IBaseComponentProps } from "../../../@types/ComponentInterfaces";
import {
	Box,
	Button,
	DialogActions,
	DialogContent,
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
	Stack,
	TextField,
} from "@mui/material";
import React, { useState } from "react";

export interface CreateManagerProps extends IBaseComponentProps {
	open: boolean;
	onClose: (value: boolean) => void;
}

interface CreateNewManagerForm {
	managerName?: string;
	password?: string;
	confirmedPassword?: string;
	name?: string;
	username?: string;
	email?: string;
	address?: string;
}

function CreateManager(props: CreateManagerProps) {
	const { open, onClose } = props;
	const [matchedPasswordError, setMatchedPasswordError] = useState(false);
	const [invalid, setInvalid] = useState({
		username: false,
		password: false,
		email: false,
	});
	const [data, setData] = useState<CreateNewManagerForm>({});

	const handleOnClose = () => {
		onClose(false);
	};

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const rule = e.target.dataset["rule"] || "";
		const temp = { ...data };
		temp[e.target.name as keyof CreateNewManagerForm] = e.target.value.trim();
		if (rule !== "")
			setInvalid({
				...invalid,
				[e.target.name]: !temp[e.target.name as keyof CreateNewManagerForm]?.match(
					new RegExp(rule),
				),
			});
		setMatchedPasswordError(
			!(
				temp.confirmedPassword === temp.password ||
				temp.password === undefined ||
				temp.confirmedPassword === undefined
			),
		);
		setData(temp);
	};

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
	};

	return (
		<Dialog onClose={handleOnClose} open={open}>
			<DialogTitle>Tạo quản lý mới</DialogTitle>
			<form onSubmit={handleSubmit}>
				<DialogContent>
					<Box
						sx={{
							paddingTop: "10px",
							minWidth: "450px",
						}}
					>
						<Stack spacing={3}>
							<TextField
								label="Tên"
								variant="outlined"
								onChange={handleOnChange}
								required
							/>
							<TextField
								error={invalid.username}
								label="Tên tài khoản"
								name="username"
								variant="outlined"
								onChange={handleOnChange}
								helperText={
									invalid.username ? "Tên tài khoản không được để trống" : ""
								}
								inputProps={{
									"data-rule": `^(?!\\s*$).+`,
								}}
								required
							/>
							<TextField
								error={invalid.email}
								label="Email"
								variant="outlined"
								name="email"
								onChange={handleOnChange}
								inputProps={{
									"data-rule": `^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$`,
								}}
								helperText={invalid.email ? "Địa chỉ email chưa đúng" : ""}
								required
							/>
							<TextField
								error={invalid.password}
								label="Mật khẩu"
								variant="outlined"
								type="password"
								name="password"
								onChange={handleOnChange}
								inputProps={{
									"data-rule": `^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$`,
								}}
								helperText="Mật khẩu có ít nhất 8 ký tự, ít nhất 1 chữ cái và 1 chữ số"
								required
							/>
							<TextField
								error={matchedPasswordError}
								label="Xác nhận mật khẩu"
								variant="outlined"
								type="password"
								name="confirmedPassword"
								helperText={matchedPasswordError ? "Mật khẩu không trùng khớp" : ""}
								onChange={handleOnChange}
								required
							/>
							<TextField
								label="Địa chỉ (không bắt buộc)"
								variant="outlined"
								onChange={handleOnChange}
							/>
							<FormControl>
								<FormLabel id="status-radio-button">Trạng thái</FormLabel>
								<RadioGroup
									row
									aria-labelledby="status-radio-button"
									name="status"
									onChange={handleOnChange}
									defaultValue={0}
								>
									<FormControlLabel
										value={0}
										control={<Radio />}
										label="Hoạt động"
									/>
									<FormControlLabel value={1} control={<Radio />} label="Khóa" />
								</RadioGroup>
							</FormControl>
						</Stack>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button color="primary" variant="outlined" onClick={handleOnClose}>
						Đóng
					</Button>
					<Button
						color="primary"
						variant="contained"
						onClick={handleSubmit}
						type="submit"
					>
						Xác nhận
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default CreateManager;
