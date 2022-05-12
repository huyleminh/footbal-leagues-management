import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { IBaseComponentProps } from "../../../@types/ComponentInterfaces";
import { Button, DialogActions, DialogContent, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import Swal from "sweetalert2";
import HttpService from "../../../services/HttpService";
import { IAPIResponse } from "../../../@types/AppInterfaces";

export interface IResetManagerPasswordProps extends IBaseComponentProps {
	open: boolean;
	managerId?: string;
	managerName?: string;
	onClose: (value: boolean) => void;
}

interface IResetPasswordForm {
	password?: string;
	confirmedPassword?: string;
}

function ResetManagerPassword(props: IResetManagerPasswordProps) {
	const { open, onClose, managerId, managerName } = props;
	const [matchedPasswordError, setMatchedPasswordError] = useState(false);
	const [invalidPassword, setInvalidPassword] = useState(false);
	const [data, setData] = useState<IResetPasswordForm>({});

	const handleOnClose = () => {
		onClose(false);
	};

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const rule = e.target.dataset["rule"] || "";
		const temp = { ...data };
		temp[e.target.name as keyof IResetPasswordForm] = e.target.value.trim();
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
		if (!data.password || !data.confirmedPassword) {
			Swal.fire({
				title: "Thiếu thông tin",
				text: "Vui lòng điền đầy đủ thông tin trước khi xác nhận!",
				icon: "warning",
				confirmButtonText: "Đồng ý",
				customClass: {
					container: "swal2-elevated-container",
				},
			});
			return;
		}

		if (matchedPasswordError) {
			Swal.fire({
				title: "Sai thông tin",
				text: "Vui lòng kiểm tra lại thông tin trước khi tạo!",
				icon: "warning",
				confirmButtonText: "Đồng ý",
				customClass: {
					container: "swal2-elevated-container",
				},
			});
			return;
		}

		try {
			const res = await HttpService.patch<IAPIResponse<any>>(
				`/managers/${managerId}/password`,
				{
					password: data.password,
				},
			);
			if (res.code === 200) {
				Swal.fire({
					title: "Cấp lại mật khẩu thành công",
					text: "Mật khẩu được cấp mới thành công!",
					icon: "success",
					confirmButtonText: "Đồng ý",
					customClass: {
						container: "swal2-elevated-container",
					},
				}).then((value) => {
					if (value.isConfirmed || value.isDismissed) {
						handleOnClose();
					}
				});
			} else if (res.code === 400) {
				Swal.fire({
					title: "Không cấp lại mật khẩu được",
					text: `${res.data}`,
					icon: "warning",
					confirmButtonText: "Đồng ý",
					customClass: {
						container: "swal2-elevated-container",
					},
				});
			} else {
				throw new Error(`Unexpected code ${res.code}`);
			}
		} catch (error) {
			console.log(error);
			Swal.fire({
				title: "Có lỗi xảy ra",
				text: "Có lỗi xảy ra trong quá trình cấp lại mật khẩu, vui lòng thử lại sau!",
				icon: "error",
				confirmButtonText: "Đồng ý",
				customClass: {
					container: "swal2-elevated-container",
				},
			});
		}
	};

	return (
		<Dialog maxWidth="xs" fullWidth onClose={handleOnClose} open={open}>
			<DialogTitle>{`Cấp lại mật khẩu${
				managerName ? ` cho ${managerName}` : ""
			}`}</DialogTitle>
			<DialogContent>
				<Stack spacing={3}>
					<TextField
						error={invalidPassword}
						label="Mật khẩu mới"
						variant="outlined"
						type="password"
						name="password"
						onChange={handleOnChange}
						size="small"
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
						size="small"
						required
					/>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button color="primary" variant="text" onClick={handleOnClose}>
					Đóng
				</Button>
				<Button color="primary" variant="contained" onClick={handleSubmit} type="submit">
					Xác nhận
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ResetManagerPassword;
