import { Box, Grid, TextField, Divider, Typography, Button, Stack } from "@mui/material";
import IllustrationLogin from "../../../assets/images/illustration_login.svg"
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom'

function LoginPage() {
	return (
		<Box sx={{
			display: "flex",
			justifyContent: "center",
			height: "100vh",
			backgroundColor: "#CCCCCC"
		}}>
			<Box sx={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
			}}>
				<Box sx={{
					backgroundColor: "white",
					minWidth: "70vw",
					minHeight: "70vh",
					borderRadius: "10px",
					padding: "50px",
					display: "flex"
				}}>
					<Grid container>
						<Grid item sx={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "center"
						}} xs={6}>
							<img src={IllustrationLogin} alt="login" />
						</Grid>
						<Grid item sx={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "center"
						}} xs={6}>
							<Box sx={{
								display: "flex",
								flexDirection: "column",
								padding: "50px"
							}}>
								<Stack spacing={3}>
									<Typography variant="h2">Đăng nhập</Typography>
									<Typography variant="subtitle2">Vui lòng đăng nhập để sử dụng các chức năng của hệ thống.</Typography>
									<TextField id="outlined-basic" label="Tên đăng nhập" variant="outlined" />
									<TextField id="outlined-basic" label="Mật khẩu" type="password" variant="outlined" />
									<Button variant="contained" sx={{ minHeight: "55px"}}>Đăng nhập</Button>
									<Divider></Divider>
									<Typography variant="subtitle1" sx={{ textAlign: "center"}}>2022 - Hệ thống quản lý giải đấu bóng đá quốc gia</Typography>
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
