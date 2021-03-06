import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { IBaseComponentProps } from "../../../@types/ComponentInterfaces";
import {
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
		status: "1",
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
		if (
			!data.name ||
			!data.username ||
			!data.email ||
			!data.password ||
			!data.confirmedPassword ||
			!data.status
		) {
			Swal.fire({
				title: "Thi???u th??ng tin",
				text: "Vui l??ng ??i???n ?????y ????? th??ng tin tr?????c khi t???o!",
				icon: "warning",
				confirmButtonText: "?????ng ??",
				customClass: {
					container: "swal2-elevated-container",
				},
			});
			return;
		}

		if (matchedPasswordError || invalid.username || invalid.password || invalid.email) {
			Swal.fire({
				title: "Sai th??ng tin",
				text: "Vui l??ng ki???m tra l???i th??ng tin tr?????c khi t???o!",
				icon: "warning",
				confirmButtonText: "?????ng ??",
				customClass: {
					container: "swal2-elevated-container",
				},
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
				address: data.address,
			});
			if (res.code === 201) {
				Swal.fire({
					title: "T???o th??nh c??ng",
					text: "T???o qu???n l?? m???i th??nh c??ng!",
					icon: "success",
					confirmButtonText: "?????ng ??",
					customClass: {
						container: "swal2-elevated-container",
					},
				}).then((value) => {
					if (value.isConfirmed || value.isDismissed) {
						handleOnClose(true);
					}
				});
			} else if (res.code === 400) {
				Swal.fire({
					title: "Kh??ng t???o ???????c",
					text: `${res.data}`,
					icon: "warning",
					confirmButtonText: "?????ng ??",
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
				title: "C?? l???i x???y ra",
				text: "C?? l???i x???y ra trong qu?? tr??nh t???o, vui l??ng th??? l???i sau!",
				icon: "error",
				confirmButtonText: "?????ng ??",
				customClass: {
					container: "swal2-elevated-container",
				},
			});
		}
	};

	return (
		<Dialog
			maxWidth="sm"
			fullWidth
			scroll="paper"
			onClose={() => handleOnClose(false)}
			open={open}
		>
			<DialogTitle>T???o qu???n l?? m???i</DialogTitle>
			<DialogContent>
				<Stack spacing={3}>
					<TextField
						label="T??n"
						variant="outlined"
						name="name"
						onChange={handleOnChange}
						size="small"
						required
					/>
					<TextField
						error={invalid.username}
						label="T??n t??i kho???n"
						name="username"
						variant="outlined"
						onChange={handleOnChange}
						size="small"
						helperText={invalid.username ? "T??n t??i kho???n kh??ng ???????c ????? tr???ng" : ""}
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
						size="small"
						inputProps={{
							"data-rule": `^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$`,
						}}
						helperText={invalid.email ? "?????a ch??? email ch??a ????ng" : ""}
						required
					/>
					<TextField
						error={invalid.password}
						label="M???t kh???u"
						variant="outlined"
						type="password"
						name="password"
						onChange={handleOnChange}
						size="small"
						inputProps={{
							"data-rule": `^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$`,
						}}
						helperText="M???t kh???u c?? ??t nh???t 8 k?? t???, ??t nh???t 1 ch??? c??i v?? 1 ch??? s???"
						required
					/>
					<TextField
						error={matchedPasswordError}
						label="X??c nh???n m???t kh???u"
						variant="outlined"
						type="password"
						name="confirmedPassword"
						helperText={matchedPasswordError ? "M???t kh???u kh??ng tr??ng kh???p" : ""}
						onChange={handleOnChange}
						size="small"
						required
					/>
					<TextField
						label="?????a ch??? (kh??ng b???t bu???c)"
						variant="outlined"
						name="address"
						onChange={handleOnChange}
						size="small"
					/>
					<FormControl>
						<FormLabel id="status-radio-button">Tr???ng th??i</FormLabel>
						<RadioGroup
							row
							aria-labelledby="status-radio-button"
							name="status"
							onChange={handleOnChange}
							defaultValue={1}
						>
							<FormControlLabel value={1} control={<Radio />} label="Ho???t ?????ng" />
							<FormControlLabel value={0} control={<Radio />} label="Kh??a" />
						</RadioGroup>
					</FormControl>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button color="primary" variant="text" onClick={() => handleOnClose(false)}>
					????ng
				</Button>
				<Button color="primary" variant="contained" onClick={handleSubmit} type="submit">
					X??c nh???n
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default CreateManager;
