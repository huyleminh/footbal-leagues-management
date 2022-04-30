import { Box, Typography } from "@mui/material";
import { IBaseComponentProps } from "../../../../../../@types/ComponentInterfaces";
import "./styles.scss";

export interface MatchListItemType {
	id: string;
	round: string;
	homeTeam: {
		name: string;
		point: number | null;
		logo: string;
	};
	awayTeam: {
		name: string;
		point: number | null;
		logo: string;
	};
	stadium: string;
}

export interface MatchListItemProps extends IBaseComponentProps {
	data: MatchListItemType;
	onClick: Function;
}

function MatchListItem(props: MatchListItemProps) {
	const { data, onClick } = props;

	const handleOnClick = () => {
		onClick(data.id);
	};

	return (
		<Box className="match-list-item" onClick={handleOnClick}>
			<Box
				sx={{
					display: "flex",
					padding: "0.75rem 1rem",
				}}
			>
				<Box sx={{ display: "flex", width: "44%" }}>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<Typography variant="subtitle2">{`Vòng ${data.round}`}</Typography>
					</Box>
					<Box
						sx={{
							display: "flex",
							justifyContent: "flex-end",
							flexGrow: "1",
							"& > *": { marginRight: "20px" },
						}}
					>
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<Typography sx={{ fontSize: "1rem", fontWeight: 500 }}>
								{data.homeTeam.name}
							</Typography>
						</Box>
						<Box sx={{ display: "flex", width: "65px", alignItems: "center" }}>
							<img
								style={{
									height: "65px",
									width: "65px",
									objectFit: "cover",
									borderRadius: "10px",
								}}
								src={data.homeTeam.logo}
								alt="home-team-logo"
							/>
						</Box>
					</Box>
				</Box>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						width: "12%",
					}}
				>
					<Typography color="primary" variant="h4">{`${data.homeTeam.point ?? ""} - ${
						data.awayTeam.point ?? ""
					}`}</Typography>
				</Box>
				<Box sx={{ display: "flex", width: "44%" }}>
					<Box sx={{ display: "flex", flexGrow: "1", "& > *": { marginLeft: "20px" } }}>
						<Box sx={{ display: "flex", width: "65px", alignItems: "center" }}>
							<img
								style={{
									height: "65px",
									width: "65px",
									objectFit: "cover",
									borderRadius: "10px",
								}}
								src={data.awayTeam.logo}
								alt="away-team-logo"
							/>
						</Box>
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<Typography sx={{ fontSize: "1rem", fontWeight: 500 }}>
								{data.awayTeam.name}
							</Typography>
						</Box>
					</Box>
					<Box sx={{ display: "flex", alignItems: "center", minWidth: "150px" }}>
						<Typography variant="subtitle2">{data.stadium}</Typography>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}

export default MatchListItem;
