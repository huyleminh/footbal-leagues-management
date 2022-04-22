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
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import StadiumRoundedIcon from "@mui/icons-material/StadiumRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { useState } from "react";

interface LineupType {
	stripNumber: number;
	name: string;
	position: string;
	captain?: boolean;
}

interface SubstitutionType {
	stripNumber: number;
	name: string;
}

interface TeamMatchDetailType {
	name: string;
	point: number;
	logo: string;
	totalShot: number;
	shotsOnTarget: number;
	possessions: number;
	totalPasses: number;
	passAccuracy: number;
	offside: number;
	corners: number;
	fouls: number;
	lineup: Array<LineupType>;
	substitution: Array<SubstitutionType>;
}

interface MatchDetailType {
	id: string;
	homeTeam: TeamMatchDetailType;
	awayTeam: TeamMatchDetailType;
	stadium: string;
	date: string;
}

export enum EVENT_TYPE {
	GOAL,
	OG,
	PEN,
	RED_CARD,
	YEL_CARD,
	SUBSTITUTION,
}

interface MatchEventType {
	eventType: EVENT_TYPE; // goal, OG, penalty, red card, yellow card, substitution
	isHome: boolean; // event of home team or away team
	mainPlayer: {
		// main player of the event. Ex: scorer in goal event, player who received card, player who was substitute out
		name: string;
		stripNumber: number;
	};
	subPlayer?: {
		// sub player of the event. Ex: assist (if exists) in goal related event, player who was substitute in
		name: string;
		stripNumber: number;
	};
	minute: number;
}

function ViewMatchDetail(props: any) {
	const { open, onClose, matchId } = props;
	const [matchDetail, setMatchDetail] = useState<MatchDetailType>({
		id: matchId,
		homeTeam: {
			name: "Manchester City",
			point: 4,
			logo: "https://upload.wikimedia.org/wikipedia/vi/thumb/1/1d/Manchester_City_FC_logo.svg/1200px-Manchester_City_FC_logo.svg.png",
			totalShot: 24,
			shotsOnTarget: 10,
			possessions: 70,
			totalPasses: 754,
			passAccuracy: 92,
			offside: 0,
			corners: 9,
			fouls: 10,
			lineup: [
				{
					stripNumber: 31,
					name: "Ederson",
					position: "Thủ môn",
				},
				{
					stripNumber: 17,
					name: "K. De Bruyne",
					position: "Tiền vệ",
					captain: true,
				},
				{
					stripNumber: 47,
					name: "P. Foden",
					position: "Tiền đạo",
				},
			],
			substitution: [
				{
					stripNumber: 8,
					name: "Raheem Sterling",
				},
				{
					stripNumber: 9,
					name: "Gabriel Jesus",
				},
			],
		},
		awayTeam: {
			name: "Manchester United",
			point: 1,
			logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png",
			totalShot: 5,
			shotsOnTarget: 2,
			possessions: 30,
			totalPasses: 331,
			passAccuracy: 83,
			offside: 1,
			corners: 3,
			fouls: 14,
			lineup: [
				{
					stripNumber: 1,
					name: "D. De Gea",
					position: "Thủ môn",
				},
				{
					stripNumber: 5,
					name: "H. Maguire",
					position: "Hậu vệ",
					captain: true,
				},
				{
					stripNumber: 17,
					name: "Fred",
					position: "Tiền vệ",
				},
			],
			substitution: [
				{
					stripNumber: 4,
					name: "Phil Jones",
				},
				{
					stripNumber: 10,
					name: "Marcus Rashford",
				},
			],
		},
		stadium: "City of Manchester Stadium",
		date: "06/03/2022 00:00",
	});

	const [matchEvent, setMatchEvent] = useState<Array<MatchEventType>>([
		{
			eventType: EVENT_TYPE.GOAL,
			isHome: true,
			mainPlayer: {
				name: "K. De Bruyne",
				stripNumber: 17,
			},
			minute: 5,
		},
		{
			eventType: EVENT_TYPE.GOAL,
			isHome: true,
			mainPlayer: {
				name: "K. De Bruyne",
				stripNumber: 17,
			},
			minute: 28,
		},
		{
			eventType: EVENT_TYPE.GOAL,
			isHome: false,
			mainPlayer: {
				name: "Jadon Sancho",
				stripNumber: 17,
			},
			subPlayer: {
				name: "P. Pogba",
				stripNumber: 6,
			},
			minute: 22,
		},
		{
			eventType: EVENT_TYPE.YEL_CARD,
			isHome: false,
			mainPlayer: {
				name: "H. Maguire",
				stripNumber: 5,
			},
			minute: 63,
		},
		{
			eventType: EVENT_TYPE.SUBSTITUTION,
			isHome: false,
			mainPlayer: {
				name: "Anthony Elanga",
				stripNumber: 36,
			},
			subPlayer: {
				name: "Jesse Lingard",
				stripNumber: 14,
			},
			minute: 64,
		},
	]);

	const titleList = [
		{
			title: "Tên đội",
			dataKey: "name",
		},
		{
			title: "Số cú sút",
			dataKey: "totalShot",
		},
		{
			title: "Sút trúng đích",
			dataKey: "shotsOnTarget",
		},
		{
			title: "Kiểm soát bóng",
			dataKey: "possessions",
			postfix: "%",
		},
		{
			title: "Số đường chuyền",
			dataKey: "totalPasses",
		},
		{
			title: "Chuyền chính xác",
			dataKey: "passAccuracy",
			postfix: "%",
		},
		{
			title: "Việt vị",
			dataKey: "offside",
		},
		{
			title: "Số phạt góc",
			dataKey: "corners",
		},
		{
			title: "Số lỗi",
			dataKey: "fouls",
		},
	];

	console.log(
		matchEvent.filter(
			(item) =>
				(item.eventType === EVENT_TYPE.GOAL ||
					item.eventType === EVENT_TYPE.OG ||
					item.eventType === EVENT_TYPE.PEN) &&
				!item.isHome,
		),
	);

	const handleOpenEditModal = (reload: boolean) => {
		console.log("Edit match detail");
	};

	return (
		<Dialog maxWidth={false} onClose={() => onClose(false)} open={open} scroll="paper">
			<DialogTitle>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
					}}
				>
					Chi tiết trận đấu
					<Button
						startIcon={<EditRoundedIcon fontSize="small" />}
						color="primary"
						variant="contained"
						onClick={() => handleOpenEditModal(true)}
					>
						Sửa
					</Button>
				</Box>
			</DialogTitle>
			<DialogContent>
				<Box
					sx={{
						paddingTop: "10px",
						minWidth: "80vw",
					}}
				>
					<Stack spacing={2}>
						<Box
							sx={{
								display: "flex",
								minHeight: "50px",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Box
								sx={{
									display: "flex",
									marginRight: "25px",
								}}
							>
								<StadiumRoundedIcon
									sx={{ marginRight: "10px" }}
									color="primary"
									fontSize="medium"
								/>
								<Typography sx={{ color: "black" }} variant="subtitle2">
									{matchDetail.stadium}
								</Typography>
							</Box>
							<Box
								sx={{
									display: "flex",
									marginRight: "25px",
								}}
							>
								<AccessTimeRoundedIcon
									sx={{ marginRight: "10px" }}
									color="primary"
									fontSize="medium"
								/>
								<Typography sx={{ color: "black" }} variant="subtitle2">
									{matchDetail.date}
								</Typography>
							</Box>
						</Box>
						<Box
							sx={{
								display: "flex",
								minHeight: "100px",
							}}
						>
							<Box sx={{ display: "flex", width: "41%" }}>
								<Box
									sx={{
										display: "flex",
										position: "relative",
										justifyContent: "center",
										alignItems: "center",
										width: "100%",
									}}
								>
									<img
										style={{
											height: "100px",
											width: "100px",
											objectFit: "cover",
											borderRadius: "10px",
										}}
										src="https://upload.wikimedia.org/wikipedia/vi/thumb/1/1d/Manchester_City_FC_logo.svg/1200px-Manchester_City_FC_logo.svg.png"
										alt="home-team-logo"
									/>
									<Typography
										sx={{
											position: "absolute",
											right: "0",
											top: "50%",
											transform: "translateY(-50%)",
										}}
										color="primary"
										variant="h3"
									>
										4
									</Typography>
								</Box>
							</Box>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									width: "18%",
								}}
							>
								<Box
									sx={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										width: "100%",
									}}
								>
									<Typography variant="h5">VS</Typography>
								</Box>
							</Box>
							<Box sx={{ display: "flex", width: "41%" }}>
								<Box
									sx={{
										display: "flex",
										width: "100%",
										justifyContent: "center",
										alignItems: "center",
										position: "relative",
									}}
								>
									<Typography
										sx={{
											position: "absolute",
											left: "0",
											top: "50%",
											transform: "translateY(-50%)",
										}}
										color="primary"
										variant="h3"
									>
										1
									</Typography>
									<img
										style={{
											height: "100px",
											width: "100px",
											objectFit: "cover",
											borderRadius: "10px",
										}}
										src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"
										alt="home-team-logo"
									/>
								</Box>
							</Box>
						</Box>
						{titleList.map((item, index) => (
							<Box
								key={index}
								sx={{
									display: "flex",
									minHeight: "50px",
								}}
							>
								<Box sx={{ display: "flex", width: "41%" }}>
									<Box
										sx={{
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
											width: "100%",
										}}
									>
										<Typography variant="body1">
											{`${
												matchDetail.homeTeam[
													item.dataKey as keyof TeamMatchDetailType
												]
											}${item.postfix || ""}`}
										</Typography>
									</Box>
								</Box>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										width: "18%",
									}}
								>
									<Box
										sx={{
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
											width: "100%",
										}}
									>
										<Typography sx={{ fontWeight: "bold" }} variant="body1">
											{item.title}
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
										<Typography variant="body1">
											{`${
												matchDetail.awayTeam[
													item.dataKey as keyof TeamMatchDetailType
												]
											}${item.postfix || ""}`}
										</Typography>
									</Box>
								</Box>
							</Box>
						))}
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
										{matchDetail.homeTeam.lineup.map((item, index) => {
											return (
												<Typography
													key={index}
													textAlign="left"
													variant="body1"
												>{`${item.stripNumber} - ${item.name} - ${
													item.position
												} ${
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
									}}
								>
									<Stack sx={{ width: "100%" }} spacing={2}>
										{matchDetail.awayTeam.lineup.map((item, index) => {
											return (
												<Typography
													key={index}
													textAlign="right"
													variant="body1"
												>{`${item.name} - ${item.position} ${
													item.captain ? "(Đội trưởng) " : ""
												}- ${item.stripNumber}`}</Typography>
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
										justifyContent: "center",
										width: "100%",
									}}
								>
									<Stack sx={{ width: "100%" }} spacing={2}>
										{matchEvent
											.filter(
												(item) =>
													(item.eventType === EVENT_TYPE.GOAL ||
														item.eventType === EVENT_TYPE.OG ||
														item.eventType === EVENT_TYPE.PEN) &&
													item.isHome,
											)
											.map((element, index) => {
												return (
													<Typography
														key={index}
														sx={{
															width: "100%",
															textAlign: "left",
														}}
														variant="body1"
													>
														{element.subPlayer
															? `${element.mainPlayer.name} (${element.mainPlayer.stripNumber}) - Kiến tạo: ${element.subPlayer.name} (${element.subPlayer.stripNumber}) - ${element.minute}'`
															: `${element.mainPlayer.name} (${element.mainPlayer.stripNumber}) - ${element.minute}'`}
													</Typography>
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
										Ghi bàn
									</Typography>
								</Box>
							</Box>
							<Box sx={{ display: "flex", width: "41%" }}>
								<Box
									sx={{
										display: "flex",
										width: "100%",
										justifyContent: "center",
									}}
								>
									<Stack sx={{ width: "100%" }} spacing={2}>
										{matchEvent
											.filter(
												(item) =>
													(item.eventType === EVENT_TYPE.GOAL ||
														item.eventType === EVENT_TYPE.OG ||
														item.eventType === EVENT_TYPE.PEN) &&
													!item.isHome,
											)
											.map((element, index) => {
												return (
													<Typography
														key={index}
														sx={{
															width: "100%",
															textAlign: "right",
														}}
														variant="body1"
													>
														{element.subPlayer
															? `${element.mainPlayer.name} (${element.mainPlayer.stripNumber}) - Kiến tạo: ${element.subPlayer.name} (${element.subPlayer.stripNumber}) - ${element.minute}'`
															: `${element.mainPlayer.name} (${element.mainPlayer.stripNumber}) - ${element.minute}'`}
													</Typography>
												);
											})}
									</Stack>
								</Box>
							</Box>
						</Box>
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
										position: "relative",
										justifyContent: "center",
										width: "100%",
									}}
								>
									<Stack sx={{ width: "100%" }} spacing={2}>
										{matchEvent
											.filter(
												(item) =>
													(item.eventType === EVENT_TYPE.YEL_CARD ||
														item.eventType === EVENT_TYPE.RED_CARD) &&
													item.isHome,
											)
											.map((element, index) => {
												return (
													<Typography
														key={index}
														sx={{
															width: "100%",
															textAlign: "left",
														}}
														variant="body1"
													>
														{`${element.mainPlayer.name} (${
															element.mainPlayer.stripNumber
														}) - ${
															element.eventType ===
															EVENT_TYPE.YEL_CARD
																? "Thẻ vàng"
																: "Thẻ đỏ"
														} - ${element.minute}'`}
													</Typography>
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
										Thẻ
									</Typography>
								</Box>
							</Box>
							<Box sx={{ display: "flex", width: "41%" }}>
								<Box
									sx={{
										display: "flex",
										width: "100%",
										justifyContent: "center",
										position: "relative",
									}}
								>
									<Stack sx={{ width: "100%" }} spacing={2}>
										{matchEvent
											.filter(
												(item) =>
													(item.eventType === EVENT_TYPE.YEL_CARD ||
														item.eventType === EVENT_TYPE.RED_CARD) &&
													!item.isHome,
											)
											.map((element, index) => {
												return (
													<Typography
														key={index}
														sx={{
															width: "100%",
															textAlign: "right",
														}}
														variant="body1"
													>
														{`${element.mainPlayer.name} (${
															element.mainPlayer.stripNumber
														}) - ${
															element.eventType ===
															EVENT_TYPE.YEL_CARD
																? "Thẻ vàng"
																: "Thẻ đỏ"
														} - ${element.minute}'`}
													</Typography>
												);
											})}
									</Stack>
								</Box>
							</Box>
						</Box>
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
										position: "relative",
										justifyContent: "center",
										width: "100%",
									}}
								>
									<Stack sx={{ width: "100%" }} spacing={2}>
										{matchEvent
											.filter(
												(item) =>
													item.eventType === EVENT_TYPE.SUBSTITUTION &&
													item.isHome,
											)
											.map((element, index) => {
												return (
													<Typography
														key={index}
														sx={{
															width: "100%",
															textAlign: "left",
														}}
														variant="body1"
													>
														{element.subPlayer
															? `Ra: ${element.mainPlayer.name} (${element.mainPlayer.stripNumber}) - Vào: ${element.subPlayer.name} (${element.subPlayer.stripNumber}) - ${element.minute}'`
															: `Ra: ${element.mainPlayer.name} (${element.mainPlayer.stripNumber}) - ${element.minute}'`}
													</Typography>
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
										Thay người
									</Typography>
								</Box>
							</Box>
							<Box sx={{ display: "flex", width: "41%" }}>
								<Box
									sx={{
										display: "flex",
										width: "100%",
										justifyContent: "center",
										position: "relative",
									}}
								>
									<Stack sx={{ width: "100%" }} spacing={2}>
										{matchEvent
											.filter(
												(item) =>
													item.eventType === EVENT_TYPE.SUBSTITUTION &&
													!item.isHome,
											)
											.map((element, index) => {
												return (
													<Typography
														key={index}
														sx={{
															width: "100%",
															textAlign: "right",
														}}
														variant="body1"
													>
														{element.subPlayer
															? `Ra: ${element.mainPlayer.name} (${element.mainPlayer.stripNumber}) - Vào: ${element.subPlayer.name} (${element.subPlayer.stripNumber}) - ${element.minute}'`
															: `Ra: ${element.mainPlayer.name} (${element.mainPlayer.stripNumber}) - ${element.minute}'`}
													</Typography>
												);
											})}
									</Stack>
								</Box>
							</Box>
						</Box>
					</Stack>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button color="primary" variant="contained" onClick={() => onClose(false)}>
					Đóng
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ViewMatchDetail;
