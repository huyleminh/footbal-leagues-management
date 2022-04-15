import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { IBaseComponentProps } from "../../../@types/ComponentInterfaces";
import {
	Box,
	Button,
	DialogActions,
	DialogContent,
	Stack,
	TextField,
} from "@mui/material";
import React, { useState } from "react";

export interface ResetManagerPasswordProps extends IBaseComponentProps {
	open: boolean;
	managerId?: string;
	onClose: (value: boolean) => void;
}

interface ResetPasswordForm {
	managerName?: string;
	password?: string;
	confirmedPassword?: string;
}

function ResetManagerPassword(props: ResetManagerPasswordProps) {
	const { open, onClose, managerId } = props;
	const [matchedPasswordError, setMatchedPasswordError] = useState(false);
	const [invalidPassword, setInvalidPassword] = useState(false);
	const [data, setData] = useState<ResetPasswordForm>({
		managerName: "Huy Le", // get manager name by id in order to confirm
	});

	const handleOnClose = () => {
		onClose(false);
	};

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const rule = e.target.dataset["rule"] || "";
		const temp = { ...data };
		temp[e.target.name as keyof ResetPasswordForm] = e.target.value.trim();
		if (rule !== "") setInvalidPassword(!temp.password?.match(new RegExp(rule)));
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
			<DialogTitle>{`Cấp lại mật khẩu${
				data.managerName ? ` cho ${data.managerName}` : ""
			}`}</DialogTitle>
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
								error={invalidPassword}
								label="Mật khẩu mới"
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
								label="Xác nhận mật khẩu mới"
								variant="outlined"
								type="password"
								name="confirmedPassword"
								helperText={matchedPasswordError ? "Mật khẩu không trùng khớp" : ""}
								onChange={handleOnChange}
								required
							/>
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

export default ResetManagerPassword;
