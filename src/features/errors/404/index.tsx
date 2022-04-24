import { Button, Stack, Typography } from "@mui/material";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Illustration404 from "../../../assets/images/illustration_404.svg"

function PageNotFound() {
	// Declare variables
	let navigate = useNavigate()

	// Declare functions
	const goHome = () => {
		console.log("Navigate")
		navigate("/")
	}

	return (
		<Box sx={{
			display: "flex",
			justifyContent: "center",
			height: "100vh"
		}}>
			<Box sx={{
				display: "flex",
				flexDirection: "column",
				margin: "auto 0",
				maxWidth: "480px"
			}}>
				<Stack spacing={3}>
					<Box sx={{
						textAlign: "center"
					}}>
						<Typography variant="h3">Không tìm thấy trang</Typography>
						<Typography variant="subtitle1">Không thể tìm thấy trang bạn cần tìm. Vui lòng kiểm tra lại URL.</Typography>
					</Box>
					<img src={Illustration404} alt="404" />
					<Box sx={{
						display: "flex",
						justifyContent: "center"
					}}>
						<Button variant="contained" onClick={goHome}>Về trang chủ</Button>
					</Box>
				</Stack>
			</Box>
		</Box>
	);
}

export default PageNotFound;
