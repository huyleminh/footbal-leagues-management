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
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import StadiumRoundedIcon from "@mui/icons-material/StadiumRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { useContext, useState } from "react";
import MatchEvent, { EVENT_TYPE, IMatchEventType } from "./MatchEvent";
import MatchLineup from "./MatchLineup";
import ChooseLineupDialog, { IModalData } from "./ChooseLineupDialog";
import AuthContext from "../../../../../../contexts/AuthContext";
import AddMatchEventDialog from "./AddMatchEventDialog";
import moment from "moment";

export interface ILineupType {
	stripNumber: number;
	name: string;
	position: string;
	captain?: boolean;
}

export interface ISubstitutionType {
	stripNumber: number;
	name: string;
}

export interface ITeamMatchDetailType {
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
	lineup: Array<ILineupType>;
	substitution: Array<ISubstitutionType>;
}

export interface IMatchDetailType {
	id: string;
	homeTeam: ITeamMatchDetailType;
	awayTeam: ITeamMatchDetailType;
	stadium: string;
	date: string | Date | null;
}

function ViewMatchDetail(props: any) {
	const { open, onClose, matchId } = props;
	const context = useContext(AuthContext);
	const [datetime, setDatetime] = useState<Date | null>(new Date());
	const [editMode, setEditMode] = useState(false);
	const [openChooseLineup, setOpenChooseLineup] = useState(false);
	const [openAddEvent, setOpenAddEvent] = useState(false);
	const [modalData, setModalData] = useState<IModalData>({});
	const [matchDetail, setMatchDetail] = useState<IMatchDetailType>({
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

	const [matchEvent, setMatchEvent] = useState<Array<IMatchEventType>>([
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

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const temp = { ...matchDetail };
		let [teamType, fieldName] = e.target.name.split("-");
		if (!fieldName) fieldName = teamType;
		if (teamType === "home")
			temp.homeTeam[fieldName as keyof ITeamMatchDetailType] = e.target.value.trim() as never;
		else if (teamType === "away")
			temp.awayTeam[fieldName as keyof ITeamMatchDetailType] = e.target.value.trim() as never;
		else temp[fieldName as keyof IMatchDetailType] = e.target.value.trim() as never;
		setMatchDetail(temp);
	};

	const handleChangeTime = (newValue: Date | null) => {
		setMatchDetail({ ...matchDetail, date: newValue });
	};

	const handleOpenEditModal = (reload: boolean) => {
		// console.log("Edit match detail");
		setEditMode(!editMode);
	};

	const handleOpenChooseLineup = (isHome: boolean) => {
		setModalData({
			matchId: matchDetail.id,
			isHome: isHome,
		});
		setOpenChooseLineup(true);
	};

	const handleOpenAddEvent = (isHome: boolean) => {
		setModalData({
			matchId: matchDetail.id,
			isHome: isHome,
		});
		setOpenAddEvent(true);
	};

	return (
		<>
			<ChooseLineupDialog
				data={modalData}
				open={openChooseLineup}
				onClose={setOpenChooseLineup}
			/>
			<AddMatchEventDialog data={modalData} open={openAddEvent} onClose={setOpenAddEvent} />
			<Dialog maxWidth={false} onClose={() => onClose(false)} open={open} scroll="paper">
				<DialogTitle>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
						}}
					>
						Chi tiết trận đấu
						{context.role === "manager" ? (
							<Button
								startIcon={
									editMode ? (
										<SaveRoundedIcon fontSize="small" />
									) : (
										<EditRoundedIcon fontSize="small" />
									)
								}
								color="primary"
								variant="contained"
								onClick={() => handleOpenEditModal(true)}
							>
								{editMode ? "Lưu" : "Sửa"}
							</Button>
						) : null}
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
									{editMode ? (
										<TextField
											label="Sân vận động"
											name="stadium"
											variant="outlined"
											value={matchDetail.stadium}
											onChange={handleOnChange}
										/>
									) : (
										<>
											<StadiumRoundedIcon
												sx={{ marginRight: "10px" }}
												color="primary"
												fontSize="medium"
											/>
											<Typography sx={{ color: "black" }} variant="subtitle2">
												{matchDetail.stadium}
											</Typography>
										</>
									)}
								</Box>
								<Box
									sx={{
										display: "flex",
										marginRight: "25px",
									}}
								>
									{editMode ? (
										<DateTimePicker
											label="Thời gian"
											value={matchDetail.date}
											onChange={handleChangeTime}
											renderInput={(params) => (
												<TextField
													label="Thời gian"
													variant="outlined"
													{...params}
												/>
											)}
										/>
									) : (
										<>
											<AccessTimeRoundedIcon
												sx={{ marginRight: "10px" }}
												color="primary"
												fontSize="medium"
											/>
											<Typography sx={{ color: "black" }} variant="subtitle2">
												{matchDetail.date instanceof Date
													? `${matchDetail.date.getDate()}/${
															matchDetail.date.getMonth() + 1
													  }/${matchDetail.date.getFullYear()} ${matchDetail.date.getHours()}:${matchDetail.date.getMinutes()}`
													: matchDetail.date}
											</Typography>
										</>
									)}
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
										{editMode ? (
											<TextField
												sx={{
													position: "absolute",
													right: "0",
													top: "50%",
													transform: "translateY(-50%)",
												}}
												label="Điểm số"
												name="home-point"
												variant="outlined"
												value={matchDetail.homeTeam.point}
												onChange={handleOnChange}
											/>
										) : (
											<>
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
													{matchDetail.homeTeam.point}
												</Typography>
											</>
										)}
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
										{editMode ? (
											<TextField
												sx={{
													position: "absolute",
													left: "0",
													top: "50%",
													transform: "translateY(-50%)",
												}}
												label="Điểm số"
												name="away-point"
												variant="outlined"
												value={matchDetail.awayTeam.point}
												onChange={handleOnChange}
											/>
										) : (
											<>
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
													{matchDetail.awayTeam.point}
												</Typography>
											</>
										)}
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
											{editMode && item.dataKey !== "name" ? ( // cannot change team name
												<TextField
													label={item.title}
													name={`home-${item.dataKey}`}
													variant="outlined"
													value={
														matchDetail.homeTeam[
															item.dataKey as keyof ITeamMatchDetailType
														]
													}
													onChange={handleOnChange}
												/>
											) : (
												<>
													<Typography variant="body1">
														{`${
															matchDetail.homeTeam[
																item.dataKey as keyof ITeamMatchDetailType
															]
														}${item.postfix || ""}`}
													</Typography>
												</>
											)}
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
											{editMode && item.dataKey !== "name" ? ( // cannot change team name
												<TextField
													label={item.title}
													name={`away-${item.dataKey}`}
													variant="outlined"
													value={
														matchDetail.awayTeam[
															item.dataKey as keyof ITeamMatchDetailType
														]
													}
													onChange={handleOnChange}
												/>
											) : (
												<>
													<Typography variant="body1">
														{`${
															matchDetail.awayTeam[
																item.dataKey as keyof ITeamMatchDetailType
															]
														}${item.postfix || ""}`}
													</Typography>
												</>
											)}
										</Box>
									</Box>
								</Box>
							))}
							<Divider></Divider>
							<MatchLineup
								matchDetail={matchDetail}
								editMode={editMode}
								openModal={handleOpenChooseLineup}
							/>
							<Divider></Divider>
							<MatchEvent
								matchEvent={matchEvent}
								setMatchEvent={setMatchEvent}
								editMode={editMode}
								openModal={handleOpenAddEvent}
							/>
						</Stack>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button color="primary" variant="contained" onClick={() => onClose(false)}>
						Đóng
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default ViewMatchDetail;
