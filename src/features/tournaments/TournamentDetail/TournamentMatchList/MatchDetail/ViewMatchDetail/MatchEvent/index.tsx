import { Box, Button, Stack, Typography } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { useState } from "react";
import { IBaseComponentProps } from "../../../../../../../@types/ComponentInterfaces";

export enum EVENT_TYPE {
	GOAL,
	OG,
	PEN,
	RED_CARD,
	YEL_CARD,
	SUBSTITUTION,
}

export interface IMatchEventType {
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

interface IMatchEventProps extends IBaseComponentProps {
    editMode: boolean;
    matchEvent: Array<IMatchEventType>;
    setMatchEvent: Function;
}

function MatchEvent(props: IMatchEventProps) {
	const { editMode, matchEvent, setMatchEvent } = props;

	const handleDelete = (element: IMatchEventType) => {
		setMatchEvent(matchEvent.filter((item) => item !== element));
	};

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
							// onClick={() => handleOpenEditModal(true)}
						>
							Thêm
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
							// onClick={() => handleOpenEditModal(true)}
						>
							Thêm
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
											{editMode ? (
												<Button onClick={() => handleDelete(element)}>
													<ClearRoundedIcon fontSize="small" />
												</Button>
											) : null}
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
											{editMode ? (
												<Button onClick={() => handleDelete(element)}>
													<ClearRoundedIcon fontSize="small" />
												</Button>
											) : null}
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
											{editMode ? (
												<Button onClick={() => handleDelete(element)}>
													<ClearRoundedIcon fontSize="small" />
												</Button>
											) : null}
											{`${element.mainPlayer.name} (${
												element.mainPlayer.stripNumber
											}) - ${
												element.eventType === EVENT_TYPE.YEL_CARD
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
												element.eventType === EVENT_TYPE.YEL_CARD
													? "Thẻ vàng"
													: "Thẻ đỏ"
											} - ${element.minute}'`}
											{editMode ? (
												<Button onClick={() => handleDelete(element)}>
													<ClearRoundedIcon fontSize="small" />
												</Button>
											) : null}
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
										item.eventType === EVENT_TYPE.SUBSTITUTION && item.isHome,
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
											{editMode ? (
												<Button onClick={() => handleDelete(element)}>
													<ClearRoundedIcon fontSize="small" />
												</Button>
											) : null}
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
										item.eventType === EVENT_TYPE.SUBSTITUTION && !item.isHome,
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
											{editMode ? (
												<Button onClick={() => handleDelete(element)}>
													<ClearRoundedIcon fontSize="small" />
												</Button>
											) : null}
										</Typography>
									);
								})}
						</Stack>
					</Box>
				</Box>
			</Box>
		</Stack>
	);
}

export default MatchEvent;
