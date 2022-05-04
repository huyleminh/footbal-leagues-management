import { Box, Button, Stack, Divider, Typography } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { IBaseComponentProps } from "../../../../../../../@types/ComponentInterfaces";
import { IMatchDetailType } from "../MatchDetailInterfaces";

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
				<Stack direction="row" justifyContent="space-between">
					<Button
						startIcon={<EditRoundedIcon fontSize="small" />}
						color="primary"
						variant="contained"
						onClick={() => openModal(true)}
						size="small"
					>
						Chọn
					</Button>
					<Button
						startIcon={<EditRoundedIcon fontSize="small" />}
						color="primary"
						variant="contained"
						onClick={() => openModal(false)}
						size="small"
					>
						Chọn
					</Button>
				</Stack>
			) : null}
			<Box
				sx={{
					display: "flex",
					minHeight: "50px",
				}}
			>
				<Stack sx={{ width: "41%" }} spacing={2}>
					{matchDetail.homeTeam.lineup.map((item, index) => {
						return (
							<Typography key={index} textAlign="left" variant="body2">{`${
								item.stripNumber
							} - ${item.name} - ${item.position} ${
								item.captain ? "(Đội trưởng)" : ""
							}`}</Typography>
						);
					})}
				</Stack>
				<Box sx={{ width: "18%" }}>
					<Typography
						sx={{ fontWeight: "700", width: "100%", textAlign: "center" }}
						variant="body2"
					>
						Đội hình ra sân
					</Typography>
				</Box>
				<Stack sx={{ width: "41%" }} spacing={2}>
					{matchDetail.awayTeam.lineup.map((item, index) => {
						return (
							<Typography key={index} textAlign="right" variant="body2">{`${
								item.name
							} - ${item.position} ${item.captain ? "(Đội trưởng) " : ""}- ${
								item.stripNumber
							}`}</Typography>
						);
					})}
				</Stack>
			</Box>
			<Divider></Divider>
			<Box
				sx={{
					display: "flex",
					minHeight: "50px",
				}}
			>
				<Stack sx={{ width: "41%" }} spacing={2}>
					{matchDetail.homeTeam.substitution.map((item, index) => {
						return (
							<Typography key={index} textAlign="left" variant="body2">
								{`${item.stripNumber} - ${item.name}`}
							</Typography>
						);
					})}
				</Stack>
				<Box sx={{ width: "18%" }}>
					<Typography
						sx={{ fontWeight: "700", width: "100%", textAlign: "center" }}
						variant="body2"
					>
						Dự bị
					</Typography>
				</Box>
				<Stack sx={{ width: "41%" }} spacing={2}>
					{matchDetail.awayTeam.substitution.map((item, index) => {
						return (
							<Typography
								key={index}
								textAlign="right"
								variant="body2"
							>{`${item.name} - ${item.stripNumber}`}</Typography>
						);
					})}
				</Stack>
			</Box>
		</Stack>
	);
}

export default MatchLineup;
