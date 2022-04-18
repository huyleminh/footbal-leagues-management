import { Grid, Stack, Card, Tooltip, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { IBaseComponentProps } from "../../../../../@types/ComponentInterfaces";
import CustomPagination from "../../../../../components/pagination";
import AuthContext from "../../../../../contexts/AuthContext";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import "./styles.scss";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import CreateTeamDialog, { ICreateTeamDialogData } from "./CreateTeamDialog";

export interface ITeamListProps extends IBaseComponentProps {}

function TeamList(props: ITeamListProps) {
	const authContext = useContext(AuthContext);
	const [isCreateOpen, setIsCreateOpen] = useState(false);

	const teamList = Array.from(Array(5)).map((_, index) => {
		return {
			_id: index,
			name: "Manchester city",
			logo: "https://givetour.s3.amazonaws.com/UploadFiles/Competitors/170397.png",
			coachName: "Pep guardiola",
		};
	});

	const handleSubmitCreate = (data: ICreateTeamDialogData) => {
		console.log(data);
		setIsCreateOpen(false)
	}

	return (
		<Stack spacing={2} className="teams">
			<CreateTeamDialog
				open={isCreateOpen}
				onCancel={() => setIsCreateOpen(false)}
				onSubmit={handleSubmitCreate}
			/>
			<Grid container spacing={2}>
				{authContext.role === "manager" && (
					<Grid
						item
						xl={2}
						lg={3}
						md={4}
						xs={6}
						sx={{ display: "flex", justifyContent: "center" }}
					>
						<Tooltip title="Thêm đội bóng" placement="right">
							<Card className="team-card-add" onClick={() => setIsCreateOpen(true)}>
								<AddRoundedIcon sx={{ fontSize: "4rem" }} />
							</Card>
						</Tooltip>
					</Grid>
				)}
				{teamList.map((team, index) => {
					return (
						<Grid
							item
							xl={2}
							lg={3}
							md={4}
							xs={6}
							key={index}
							sx={{ display: "flex", justifyContent: "center" }}
						>
							<Card className="team-card">
								<Box
									sx={{ width: "100%", height: "100px" }}
									className="team-card-image"
								>
									<img
										src={`${team.logo}`}
										alt="logoTeam"
										style={{ width: "100%", height: "100%" }}
									/>
								</Box>
								<Stack spacing={1} className="team-card-content">
									<Typography
										variant="h6"
										sx={{ textTransform: "uppercase", color: "#fff" }}
									>
										{team.name}
									</Typography>

									<Typography
										sx={{
											textTransform: "uppercase",
											color: "#fff",
											fontSize: "0.875rem",
										}}
									>
										{team.coachName}
									</Typography>

									<Typography
										sx={{
											color: "#fff",
											fontSize: "0.5rem",
											textAlign: "right",
										}}
									>
										<Link
											to={`./${team._id}`}
											className="team-card-content-link"
										>
											Chi tiết
										</Link>
									</Typography>
								</Stack>
							</Card>
						</Grid>
					);
				})}
			</Grid>

			<Stack direction="row-reverse" sx={{ width: "100%" }}>
				<CustomPagination
					page={1}
					totalPage={10}
					onChange={() => {}}
					allowChangeMax
					maxItemList={[5, 10, 15, 20]}
					maxItem={5}
					onChangeMaxItem={() => {}}
				/>
			</Stack>
		</Stack>
	);
}

export default TeamList;
