import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Box, Card, Grid, Stack, Tooltip, Typography } from "@mui/material";
import { toast } from "material-react-toastify";
import React, { useContext, useState } from "react";
import { Link, useMatch } from "react-router-dom";
import { IBaseComponentProps } from "../../../../../@types/ComponentInterfaces";
import CustomPagination from "../../../../../components/pagination";
import ToastMsg from "../../../../../components/toast/ToastMsg";
import AuthContext from "../../../../../contexts/AuthContext";
import TeamService from "../../../../../services/TeamService";
import CreateTeamDialog, { ICreateTeamDialogData } from "./CreateTeamDialog";
import "./styles.scss";

export interface ITeamListProps extends IBaseComponentProps {}

function TeamList(props: ITeamListProps) {
	const authContext = useContext(AuthContext);
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [isSubmiting, setIsSubmiting] = useState(false);
	const match = useMatch("/tournaments/:id/teams");

	const teamList = Array.from(Array(5)).map((_, index) => {
		return {
			_id: index,
			name: "Manchester city",
			logo: "https://givetour.s3.amazonaws.com/UploadFiles/Competitors/170397.png",
			coachName: "Pep guardiola",
		};
	});

	const handleSubmitCreate = async (data: ICreateTeamDialogData) => {
		if (!match || !match.params.id) {
			return;
		}
		const formData = new FormData();
		formData.append("name", data.name);
		formData.append("tournamentId", match.params.id);
		formData.append("playerList", JSON.stringify(data.playerList));
		formData.append("staffList", JSON.stringify(data.staffList));
		formData.append("logo", data.logo);

		setIsSubmiting(true);
		try {
			const res = await TeamService.postCreateTeamAsync(formData);
			setIsSubmiting(false);
			if (res.code === 201) {
				toast(<ToastMsg title="Tạo mới thành công" type="success" />, {
					type: toast.TYPE.SUCCESS,
				});
				setTimeout(() => {
					window.location.reload();
				}, 1500);
			} else if (res.code === 400) {
				toast(<ToastMsg title={`${res.data as string}`} type="error" />, {
					type: toast.TYPE.ERROR,
				});
			} else throw new Error("unexpected_code");
		} catch (error) {
			setIsSubmiting(false);
			console.log(error);
			toast(<ToastMsg title="Có lỗi xảy ra, vui lòng thử lại sau!" type="error" />, {
				type: toast.TYPE.ERROR,
			});
		}
	};

	return (
		<Stack spacing={2} className="teams">
			<CreateTeamDialog
				open={isCreateOpen}
				onCancel={() => setIsCreateOpen(false)}
				onSubmit={handleSubmitCreate}
				loading={isSubmiting}
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
