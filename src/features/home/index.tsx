import { Stack, Typography } from "@mui/material";

export interface IHomeProps {}

function Home(props: IHomeProps) {
	return (
		<Stack spacing={3}>
			<Typography variant="h3" sx={{ textAlign: "center", fontWeight: 800 }}>
				Bảng điều khiển hệ thống quản lý các giải đấu bóng đá
			</Typography>
			<Typography
				variant="subtitle1"
				sx={{ fontStyle: "italic", color: "#000", textAlign: "center" }}
			>
				2022 - Hệ thống quản lý các giải đấu bóng đá
			</Typography>
		</Stack>
	);
}

export default Home;
