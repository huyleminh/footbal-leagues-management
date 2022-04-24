import { LinearProgress, Box, Typography } from "@mui/material";

type LoadingPropsType = {
	message?: string;
};

function Loading(props: LoadingPropsType) {
	return (
		<Box
			sx={{
				minHeight: "100vh",
				width: "100%",
				display: "flex",
				justifyContent: "center",
			}}
		>
			<Box
				sx={{
					width: "50vw",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
				}}
			>
				<Typography
					variant="h3"
					sx={{
						marginBottom: "50px",
					}}
				>
					{(props.message || "Đang tải") + " ..."}
				</Typography>
				<LinearProgress />
			</Box>
		</Box>
	);
}

export default Loading;
