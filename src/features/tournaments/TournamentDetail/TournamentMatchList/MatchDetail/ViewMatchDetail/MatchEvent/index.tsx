import { Box, Button, Stack, Typography } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { IBaseComponentProps } from "../../../../../../../@types/ComponentInterfaces";
import { CardType, GoalType } from "../MatchDetailInterfaces";

export enum EVENT_TYPE {
	GOAL,
	OG,
	PEN,
	RED_CARD,
	YEL_CARD,
	SUBSTITUTION,
}

export interface IMatchEventType {
	eventType: GoalType | CardType; // goal, OG, penalty, red card, yellow card, substitution
	isHome: boolean; // event of home team or away team
	mainPlayer: {
		id?: string;
		// main player of the event. Ex: scorer in goal event, player who received card, player who was substitute out
		name: string;
		stripNumber: number;
	};
	subPlayer?: {
		id?: string;
		// sub player of the event. Ex: assist (if exists) in goal related event, player who was substituted in
		name: string;
		stripNumber: number;
	};
	minute: string;
}

interface IMatchEventProps extends IBaseComponentProps {
	editMode: boolean;
	matchEvent: Array<IMatchEventType>;
	setMatchEvent: Function;
	openModal: Function;
}

function MatchEvent(props: IMatchEventProps) {
	const { editMode, matchEvent, setMatchEvent, openModal } = props;

	const handleDelete = (element: IMatchEventType) => {
		const deleted = matchEvent.filter((item) => item !== element);
		setMatchEvent(deleted);
	};

	return (
		<Stack spacing={2}>
			{editMode ? (
				<Stack justifyContent="space-between" direction="row">
					<Button
						startIcon={<EditRoundedIcon fontSize="small" />}
						color="primary"
						variant="contained"
						onClick={() => openModal(true)}
						size="small"
					>
						Thêm
					</Button>
					<Button
						startIcon={<EditRoundedIcon fontSize="small" />}
						color="primary"
						variant="contained"
						onClick={() => openModal(false)}
						size="small"
					>
						Thêm
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
					{matchEvent
						.filter(
							(item) =>
								(item.eventType === "normal" ||
									item.eventType === "og" ||
									item.eventType === "penalty") &&
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
									variant="body2"
								>
									{editMode ? (
										<Button onClick={() => handleDelete(element)}>
											<ClearRoundedIcon fontSize="small" />
										</Button>
									) : null}
									{element.subPlayer
										? `${element.mainPlayer.name} (${element.mainPlayer.stripNumber}) - Kiến tạo: ${element.subPlayer.name} (${element.subPlayer.stripNumber}) - ${element.minute}'`
										: `${
												element.eventType === "og"
													? "Phản lưới nhà: "
													: element.eventType === "penalty"
													? "Phạt đền: "
													: ""
										  }$${element.mainPlayer.name} (${
												element.mainPlayer.stripNumber
										  }) - ${element.minute}'`}
								</Typography>
							);
						})}
				</Stack>
				<Box sx={{ width: "18%" }}>
					<Typography
						sx={{ fontWeight: "700", textAlign: "center", width: "100%" }}
						variant="body2"
					>
						Ghi bàn
					</Typography>
				</Box>
				<Stack sx={{ width: "41%" }} spacing={2}>
					{matchEvent
						.filter(
							(item) =>
								(item.eventType === "normal" ||
									item.eventType === "og" ||
									item.eventType === "penalty") &&
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
									variant="body2"
								>
									{element.subPlayer
										? `${element.mainPlayer.name} (${element.mainPlayer.stripNumber}) - Kiến tạo: ${element.subPlayer.name} (${element.subPlayer.stripNumber}) - ${element.minute}'`
										: `${
												element.eventType === "og"
													? "Phản lưới nhà: "
													: element.eventType === "penalty"
													? "Phạt đền: "
													: ""
										  }${element.mainPlayer.name} (${
												element.mainPlayer.stripNumber
										  }) - ${element.minute}'`}
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
			<Box
				sx={{
					display: "flex",
					minHeight: "50px",
				}}
			>
				<Stack sx={{ width: "41%" }} spacing={2}>
					{matchEvent
						.filter(
							(item) =>
								(item.eventType === "yellow" || item.eventType === "red") &&
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
									variant="body2"
								>
									{editMode ? (
										<Button onClick={() => handleDelete(element)}>
											<ClearRoundedIcon fontSize="small" />
										</Button>
									) : null}
									{`${element.mainPlayer.name} (${
										element.mainPlayer.stripNumber
									}) - ${
										element.eventType === "yellow" ? "Thẻ vàng" : "Thẻ đỏ"
									} - ${element.minute}'`}
								</Typography>
							);
						})}
				</Stack>
				<Box sx={{ width: "18%" }}>
					<Typography
						sx={{ fontWeight: "700", width: "100%", textAlign: "center" }}
						variant="body2"
					>
						Thẻ
					</Typography>
				</Box>
				<Stack sx={{ width: "41%" }} spacing={2}>
					{matchEvent
						.filter(
							(item) =>
								(item.eventType === "yellow" || item.eventType === "red") &&
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
									variant="body2"
								>
									{`${element.mainPlayer.name} (${
										element.mainPlayer.stripNumber
									}) - ${
										element.eventType === "yellow" ? "Thẻ vàng" : "Thẻ đỏ"
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
								.filter((item) => item.eventType === null && item.isHome)
								.map((element, index) => {
									return (
										<Typography
											key={index}
											sx={{
												width: "100%",
												textAlign: "left",
											}}
											variant="body2"
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
				<Box sx={{ width: "18%" }}>
					<Typography
						sx={{ fontWeight: "700", width: "100%", textAlign: "center" }}
						variant="body2"
					>
						Thay người
					</Typography>
				</Box>
				<Stack sx={{ width: "41%" }} spacing={2}>
					{matchEvent
						.filter((item) => item.eventType === null && !item.isHome)
						.map((element, index) => {
							return (
								<Typography
									key={index}
									sx={{
										width: "100%",
										textAlign: "right",
									}}
									variant="body2"
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
		</Stack>
	);
}

export default MatchEvent;
