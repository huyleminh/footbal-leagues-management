import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { IBaseComponentProps } from "../../../../../@types/ComponentInterfaces";
import PlayerList from "./PlayerList";
import StaffList from "./StaffList";

export interface ITeamDetailProps extends IBaseComponentProps {}

function TeamDetail(props: ITeamDetailProps) {
	return (
		<Box>
			<Stack alignItems="center" sx={{ mb: 4 }}>
				<Box sx={{ width: "100px", height: "100px", mb: 1 }} className="team-card-image">
					<img
						src="https://givetour.s3.amazonaws.com/UploadFiles/Competitors/170397.png"
						alt="logoTeam"
						style={{ width: "100%", height: "100%" }}
					/>
				</Box>

				<Typography variant="h6" sx={{ textTransform: "uppercase" }}>
					Manchester city
				</Typography>

				<Typography
					variant="subtitle1"
					sx={{ textTransform: "uppercase", fontSize: "0.875rem" }}
				>
					Pep guardiola
				</Typography>

				<Link to="../../matches?teamKey=manchester city" style={{ textDecoration: "none" }}>
					<Button variant="contained" startIcon={<OpenInNewRoundedIcon />}>
						Danh sách trận đấu
					</Button>
				</Link>
			</Stack>

			<Box sx={{ mb: 6 }}>
				<StaffList />
			</Box>

			<Box sx={{ mb: 6 }}>
				<PlayerList />
			</Box>
		</Box>
	);
}

export default TeamDetail;
