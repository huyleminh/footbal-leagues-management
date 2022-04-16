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
import Swal from "sweetalert2";
import HttpService from "../../../services/HttpService";
import { IAPIResponse } from "../../../@types/AppInterfaces";

export interface CreateManagerProps extends IBaseComponentProps {
	open: boolean;
	onClose: (value: boolean) => void;
}

interface CreateNewManagerForm {
	password?: string;
	confirmedPassword?: string;
	name?: string;
	username?: string;
	email?: string;
	address?: string;
	status?: string;
}

function CreateManager(props: CreateManagerProps) {
	const { open, onClose } = props;
	const [matchedPasswordError, setMatchedPasswordError] = useState(false);
	const [invalid, setInvalid] = useState({
		username: false,
		password: false,
		email: false,
	});
	const [data, setData] = useState<CreateNewManagerForm>({
		status: "1"
	});

	const handleOnClose = (reload: boolean) => {
		onClose(reload);
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
		if (!data.name || !data.username || !data.email || !data.password || !data.confirmedPassword || !data.status) {
			Swal.fire({
				title: "Thiếu thông tin",
				text: "Vui lòng điền đầy đủ thông tin trước khi tạo!",
				icon: "warning",
				confirmButtonText: "Đồng ý",
				customClass: {
					container: "swal2-elevated-container"
				}
			});
			return;
		}

		if (matchedPasswordError || invalid.username || invalid.password || invalid.email) {
			Swal.fire({
				title: "Sai thông tin",
				text: "Vui lòng kiểm tra lại thông tin trước khi tạo!",
				icon: "warning",
				confirmButtonText: "Đồng ý",
				customClass: {
					container: "swal2-elevated-container"
				}
			});
			return;
		}

		try {
			const res = await HttpService.post<IAPIResponse<any>>("/managers", {
				fullname: data.name,
				username: data.username,
				password: data.password,
				email: data.email,
				status: data.status,
				address: data.address
			})
			if (res.code === 201) {
				Swal.fire({
					title: "Tạo thành công",
					text: "Tạo quản lý mới thành công!",
					icon: "success",
					confirmButtonText: "Đồng ý",
					customClass: {
						container: "swal2-elevated-container"
					}
				}).then((value) => {
					if (value.isConfirmed || value.isDismissed) {
						handleOnClose(true)
					}
				});
			} else {
				if (res.code === 400) {
					Swal.fire({
						title: "Không tạo được",
						text: `${res.data}`,
						icon: "warning",
						confirmButtonText: "Đồng ý",
						customClass: {
							container: "swal2-elevated-container"
						}
					});
				} else {
					Swal.fire({
						title: "Có lỗi xảy ra",
						text: "Có lỗi xảy ra trong quá trình tạo, vui lòng thử lại sau!",
						icon: "error",
						confirmButtonText: "Đồng ý",
						customClass: {
							container: "swal2-elevated-container"
						}
					});
				}
			}
		} catch (error) {
			console.log(error)
		}
	};

	return (
		<Dialog onClose={() => handleOnClose(false)} open={open}>
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
								name="name"
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
								name="address"
								onChange={handleOnChange}
							/>
							<FormControl>
								<FormLabel id="status-radio-button">Trạng thái</FormLabel>
								<RadioGroup
									row
									aria-labelledby="status-radio-button"
									name="status"
									onChange={handleOnChange}
									defaultValue={1}
								>
									<FormControlLabel
										value={1}
										control={<Radio />}
										label="Hoạt động"
									/>
									<FormControlLabel
										value={0}
										control={<Radio />}
										label="Khóa"
									/>
								</RadioGroup>
							</FormControl>
						</Stack>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button color="primary" variant="outlined" onClick={() => handleOnClose(false)}>
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
