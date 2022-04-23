import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Stack,
	Divider,
	Typography,
	TextField,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { IBaseComponentProps } from "../../../../../../../@types/ComponentInterfaces";
import { IMatchDetailType } from "..";

interface IMatchLineupProps extends IBaseComponentProps {
	editMode: boolean;
	matchDetail: IMatchDetailType;
	openModal: Function;
}

function MatchLineup(props: IMatchLineupProps) {
	const { editMode, matchDetail, openModal } = props;
	return (
		<Stack spacing={2}>
			{editMode ? (
				<Box
					sx={{
						display: "flex",
						minHeight: "50px",
					}}
				>
					<Box sx={{ display: "flex", width: "41%" }}>
						<Button
							startIcon={<EditRoundedIcon fontSize="small" />}
							color="primary"
							variant="contained"
							onClick={() => openModal(true)}
						>
							Chọn
						</Button>
					</Box>
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							width: "18%",
						}}
					>
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								width: "100%",
							}}
						></Box>
					</Box>
					<Box sx={{ display: "flex", width: "41%", justifyContent: "flex-end" }}>
						<Button
							startIcon={<EditRoundedIcon fontSize="small" />}
							color="primary"
							variant="contained"
							onClick={() => openModal(false)}
						>
							Chọn
						</Button>
					</Box>
				</Box>
			) : null}
			<Box
				sx={{
					display: "flex",
					minHeight: "50px",
				}}
			>
				<Box sx={{ display: "flex", width: "41%" }}>
					<Box
						sx={{
							display: "flex",
							width: "100%",
						}}
					>
						<Stack sx={{ width: "100%" }} spacing={2}>
							{matchDetail.homeTeam.lineup.map((item, index) => {
								return (
									<Typography key={index} textAlign="left" variant="body1">{`${
										item.stripNumber
									} - ${item.name} - ${item.position} ${
										item.captain ? "(Đội trưởng)" : ""
									}`}</Typography>
								);
							})}
						</Stack>
					</Box>
				</Box>
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						width: "18%",
					}}
				>
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							width: "100%",
						}}
					>
						<Typography sx={{ fontWeight: "bold" }} variant="body1">
							Đội hình ra sân
						</Typography>
					</Box>
				</Box>
				<Box sx={{ display: "flex", width: "41%" }}>
					<Box
						sx={{
							display: "flex",
							width: "100%",
							justifyContent: "flex-end",
						}}
					>
						<Stack sx={{ width: "100%" }} spacing={2}>
							{matchDetail.awayTeam.lineup.map((item, index) => {
								return (
									<Typography key={index} textAlign="right" variant="body1">{`${
										item.name
									} - ${item.position} ${item.captain ? "(Đội trưởng) " : ""}- ${
										item.stripNumber
									}`}</Typography>
								);
							})}
						</Stack>
					</Box>
				</Box>
			</Box>
			<Divider></Divider>
			<Box
				sx={{
					display: "flex",
					minHeight: "50px",
				}}
			>
				<Box sx={{ display: "flex", width: "41%" }}>
					<Box
						sx={{
							display: "flex",
							width: "100%",
						}}
					>
						<Stack sx={{ width: "100%" }} spacing={2}>
							{matchDetail.homeTeam.substitution.map((item, index) => {
								return (
									<Typography
										key={index}
										textAlign="left"
										variant="body1"
									>{`${item.stripNumber} - ${item.name}`}</Typography>
								);
							})}
						</Stack>
					</Box>
				</Box>
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						width: "18%",
					}}
				>
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							width: "100%",
						}}
					>
						<Typography sx={{ fontWeight: "bold" }} variant="body1">
							Dự bị
						</Typography>
					</Box>
				</Box>
				<Box sx={{ display: "flex", width: "41%" }}>
					<Box
						sx={{
							display: "flex",
							width: "100%",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Stack sx={{ width: "100%" }} spacing={2}>
							{matchDetail.homeTeam.substitution.map((item, index) => {
								return (
									<Typography
										key={index}
										textAlign="right"
										variant="body1"
									>{`${item.name} - ${item.stripNumber}`}</Typography>
								);
							})}
						</Stack>
					</Box>
				</Box>
			</Box>
		</Stack>
	);
}

export default MatchLineup;
