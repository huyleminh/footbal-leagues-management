import CloseIcon from "@mui/icons-material/Close";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Collapse,
	Divider,
	Grid,
	IconButton,
	Stack,
	TextField,
	Tooltip,
	Typography
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ILoginResponse, IUserLogin } from "../../../@types/AuthInterfaces";
import IllustrationLogin from "../../../assets/images/illustration_login.svg";
import AuthService from "../../../services/AuthService";

function LoginPage() {
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(false);
	const [userLogin, setUserLogin] = useState<IUserLogin>({ username: "", password: "" });
	const [userLoginError, setUserLoginError] = useState({ username: false, password: false });
	const [alert, setAlert] = useState({ open: false, msg: "" });

	const handleChangeField = (event: React.ChangeEvent<HTMLInputElement>) => {
		const target = event.target;

		setUserLogin({
			...userLogin,
			[target.name]: target.value,
		});
	};

	const handleSubmit = async () => {
		if (!userLogin.username || !userLogin.password) {
			return;
		}
		if (userLoginError.username || userLoginError.password) {
			return;
		}

		setIsLoading(true);
		try {
			const res = await AuthService.postLoginAsync(userLogin);
			setIsLoading(false);

			if (res.code === 200) {
				AuthService.setLocalData(res.data as ILoginResponse);
				navigate("/");
			} else if (res.code === 400) {
				setAlert({ open: true, msg: res?.data as string });
			}
		} catch (error) {
			console.log(error);
			setAlert({ open: true, msg: "Đã có lỗi xảy ra, vui lòng thử lại sau" });
		}
	};

	const handleValidateField = (event: React.FocusEvent<HTMLInputElement>) => {
		const target = event.target;
		if (!target.value) {
			return;
		}

		const rule = target.dataset["rule"] || "";

		if (!target.value.trim() || !target.value.match(new RegExp(rule))) {
			setUserLoginError({
				...userLoginError,
				[target.name]: true,
			});
			return;
		}

		setUserLoginError({
			...userLoginError,
			[target.name]: false,
		});
	};

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				height: "100vh",
				backgroundColor: "#CCCCCC",
			}}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
				}}
			>
				<Box
					sx={{
						backgroundColor: "white",
						minWidth: "70vw",
						minHeight: "70vh",
						borderRadius: "10px",
						padding: "50px",
						display: "flex",
					}}
				>
					<Grid container>
						<Grid
							item
							sx={{
								display: { xs: "none", md: "flex" },
								flexDirection: "column",
								justifyContent: "center",
							}}
							xs={6}
						>
							<img src={IllustrationLogin} alt="login" />
						</Grid>
						<Grid
							item
							sx={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
							}}
							xs={6}
						>
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									padding: "50px",
								}}
							>
								<Stack spacing={3}>
									<Collapse in={alert.open}>
										<Alert
											severity="warning"
											action={
												<IconButton
													aria-label="close"
													color="inherit"
													size="small"
													onClick={() => {
														setAlert({ open: false, msg: "" });
													}}
												>
													<CloseIcon fontSize="inherit" />
												</IconButton>
											}
											sx={{ mb: 2 }}
										>
											{alert.msg}
										</Alert>
									</Collapse>
									<Typography variant="h2">Đăng nhập</Typography>
									<Typography variant="subtitle2">
										Vui lòng đăng nhập để sử dụng các chức năng của hệ thống.
									</Typography>
									<TextField
										label="Tên đăng nhập"
										variant="outlined"
										name="username"
										onChange={handleChangeField}
										value={userLogin.username}
										onBlur={handleValidateField}
										error={userLoginError.username}
										inputProps={{}}
										helperText={
											userLoginError.username &&
											"Tên đăng nhập không được bỏ trống"
										}
										autoFocus
									/>
									<TextField
										label="Mật khẩu"
										type="password"
										variant="outlined"
										name="password"
										onChange={handleChangeField}
										value={userLogin.password}
										onBlur={handleValidateField}
										error={userLoginError.password}
										inputProps={{
											"data-rule": "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$",
										}}
										helperText={
											userLoginError.password && (
												<Tooltip
													title={`Mật khẩu có ít nhất 8 ký tự, ít nhất 1 chữ cái và 1 chữ số`}
													placement="bottom"
												>
													<Typography
														variant="caption"
														sx={{
															color: "#FF4842",
															fontSize: "0.8rem",
															display: "flex",
															alignItems: "center",
														}}
													>
														<span style={{ marginRight: "5px" }}>
															Mật khẩu không đúng định dạng
														</span>
														<HelpOutlineRoundedIcon fontSize="small" />
													</Typography>
												</Tooltip>
											)
										}
									/>
									<Button
										variant="contained"
										sx={{ minHeight: "55px" }}
										onClick={handleSubmit}
									>
										{isLoading ? (
											<CircularProgress sx={{ color: "#FFF" }} size={30} />
										) : (
											"Đăng nhập"
										)}
									</Button>
									<Divider></Divider>
									<Typography variant="subtitle1" sx={{ textAlign: "center" }}>
										2022 - Hệ thống quản lý giải đấu bóng đá quốc gia
									</Typography>
								</Stack>
							</Box>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Box>
	);
}

export default LoginPage;
