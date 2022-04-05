import { Button, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import Illustration403 from "../../../assets/images/illustration_maintenance.svg"

function ForbiddenPage() {
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
						<Typography variant="h3">Truy cập bị cấm</Typography>
						<Typography variant="subtitle1">Bạn không có quyền truy cập trang này.</Typography>
					</Box>
					<img src={Illustration403} alt="404" />
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

export default ForbiddenPage;
