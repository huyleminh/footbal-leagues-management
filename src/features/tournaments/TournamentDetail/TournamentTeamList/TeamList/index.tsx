import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Box, Card, Grid, LinearProgress, Stack, Tooltip, Typography } from "@mui/material";
import { toast } from "material-react-toastify";
import QueryString from "query-string";
import React, { useContext, useEffect, useState } from "react";
import { Link, useMatch, useNavigate } from "react-router-dom";
import { IAPIResponse } from "../../../../../@types/AppInterfaces";
import { IBaseComponentProps } from "../../../../../@types/ComponentInterfaces";
import CustomPagination from "../../../../../components/pagination";
import ToastMsg from "../../../../../components/toast/ToastMsg";
import AuthContext from "../../../../../contexts/AuthContext";
import HttpService from "../../../../../services/HttpService";
import TeamService from "../../../../../services/TeamService";
import { IPagination } from "../../../../admin/ManagerList";
import CreateTeamDialog, { ICreateTeamDialogData } from "./CreateTeamDialog";
import "./styles.scss";

export interface ITeamListProps extends IBaseComponentProps {}

export interface ITeamListData {
	_id?: string;
	name?: string;
	logo?: string;
	coachName?: string;
	totalMember?: number;
}

function TeamList(props: ITeamListProps) {
	const navigate = useNavigate();
	const authContext = useContext(AuthContext);
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [isSubmiting, setIsSubmiting] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [totalPage, setTotalPage] = useState(1);
	const [pagination, setPagination] = useState({
		page: 1,
		maxItem: 15,
	});
	const match = useMatch("/tournaments/:id/teams");

	const [teamList, setTeamList] = useState<Array<ITeamListData>>([]);

	useEffect(() => {
		const fetch = async () => {
			setIsLoading(true);
			const param = {
				page: pagination.page,
				limit: pagination.maxItem,
				tournamentId: match?.params.id,
			};
			try {
				const res = await HttpService.get<IAPIResponse<Array<ITeamListData> | string>>(
					`/teams?${QueryString.stringify(param)}`,
				);
				if (res.code === 200) {
					setTeamList(res.data as Array<ITeamListData>);
					const metadata = res.metadata as IPagination;
					setTotalPage(Math.ceil(metadata.pagination.totalRecord / pagination.maxItem));
				} else {
					toast(<ToastMsg title={res?.data as string} type="error" />, {
						type: toast.TYPE.ERROR,
					});
				}
			} catch (e) {
				console.log(e);
				toast(<ToastMsg title="Có lỗi xảy ra, vui lòng thử lại sau!" type="error" />, {
					type: toast.TYPE.ERROR,
				});
			}
			setIsLoading(false);
		};
		fetch();
	}, [pagination, match?.params.id]);

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
					navigate(0);
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
			{isLoading ? (
				<Box sx={{ width: "100%" }}>
					<LinearProgress />
				</Box>
			) : (
				<Grid container spacing={2}>
					{authContext.role === "manager" && (
						<Grid
							item
							xl={2}
							lg={3}
							md={4}
							xs={6}
							sx={{ display: "flex", justifyContent: "center", minHeight: "200px" }}
						>
							<Tooltip title="Thêm đội bóng" placement="right">
								<Card
									className="team-card-add"
									onClick={() => setIsCreateOpen(true)}
								>
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
											style={{
												width: "100%",
												height: "100%",
												objectFit: "contain",
											}}
										/>
									</Box>
									<Stack spacing={1} className="team-card-content">
										<Stack spacing={1}>
											<Typography
												sx={{ textTransform: "uppercase", color: "#fff", fontSize: "1rem", fontWeight: 600 }}
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
										</Stack>
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
			)}

			<Stack direction="row-reverse" sx={{ width: "100%" }}>
				<CustomPagination
					page={pagination.page}
					totalPage={totalPage}
					onChange={(value) =>
						setPagination({
							...pagination,
							page: value,
						})
					}
					allowChangeMax
					maxItem={pagination.maxItem}
					maxItemList={[5, 10, 15, 20, 25]}
					onChangeMaxItem={(value) =>
						setPagination({
							page: 1,
							maxItem: value,
						})
					}
				/>
			</Stack>
		</Stack>
	);
}

export default TeamList;
