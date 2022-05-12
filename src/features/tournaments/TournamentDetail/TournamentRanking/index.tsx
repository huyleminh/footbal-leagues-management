import {
	Box,
	Card,
	LinearProgress,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import { toast } from "material-react-toastify";
import { useEffect, useState } from "react";
import { Link, useMatch } from "react-router-dom";
import { IAPIResponse } from "../../../../@types/AppInterfaces";
import { IBaseComponentProps } from "../../../../@types/ComponentInterfaces";
import ToastMsg from "../../../../components/toast/ToastMsg";
import HttpService from "../../../../services/HttpService";

interface ITournamentRankingData {
	id?: string;
	name?: string;
	logo?: string;
	participatedAt?: string;
	totalWon?: number;
	totalLost?: number;
	totalTied?: number;
	totalPoint?: number;
}

function TournamentRanking(props: IBaseComponentProps) {
	const [data, setData] = useState<Array<ITournamentRankingData>>([]);
	const [isLoading, setIsLoading] = useState(false);

	const match = useMatch("tournaments/:id/*");

	useEffect(() => {
		const fetch = async () => {
			setIsLoading(true);
			try {
				const res = await HttpService.get<
					IAPIResponse<Array<ITournamentRankingData> | string>
				>(`ranking/${match ? match.params.id : ""}`);
				if (res.code === 200) {
					setData(res.data as Array<ITournamentRankingData>);
				} else {
					throw new Error(`Unexpected code ${res.code}`);
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
	}, [match]);

	return (
		<>
			{isLoading ? (
				<Box sx={{ width: "100%" }}>
					<LinearProgress />
				</Box>
			) : null}
			<TableContainer component={Card}>
				<Table sx={{ minWidth: 650 }}>
					<TableHead>
						<TableRow>
							<TableCell align="left" sx={{ width: "100px", minWidth: "100px" }}>
								Xếp hạng
							</TableCell>
							<TableCell align="left" sx={{ width: "100px" }}>
								Logo
							</TableCell>
							<TableCell align="left">Tên đội</TableCell>
							<TableCell align="left">Số trận đã đấu</TableCell>
							<TableCell align="left">Thắng - Thua - Hòa</TableCell>
							<TableCell align="left">Tổng điểm</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data.sort((item1, item2) => (item2.totalPoint ?? 1) - (item1.totalPoint ?? 0)).map((item, index) => (
							<TableRow
								key={index}
								sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
								hover
							>
								<TableCell
									component="th"
									scope="row"
									sx={{ width: "100px", minWidth: "100px" }}
								>
									{index + 1}
								</TableCell>
								<TableCell align="left" sx={{ width: "100px" }}>
									<Box
										sx={{
											width: "40px",
											height: "40px",
											display: "flex",
											alignItems: "center",
										}}
									>
										<img
											src={item.logo || ""}
											alt="logoTournament"
											style={{ width: "100%", height: "auto" }}
										/>
									</Box>
								</TableCell>
								<TableCell align="left">
									<Link
										style={{ color: "#000", textDecoration: "none" }}
										to={`../teams/${item.id}`}
									>
										{item.name}
									</Link>
								</TableCell>
								<TableCell align="left">
									{(item.totalLost || 0) +
										(item.totalTied || 0) +
										(item.totalWon || 0)}
								</TableCell>
								<TableCell align="left">{`${item.totalWon} - ${item.totalTied} - ${item.totalLost}`}</TableCell>
								<TableCell align="left">{item.totalPoint}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				{data.length === 0 && (
					<Typography
						variant="h6"
						sx={{
							textAlign: "center",
							width: "100%",
							fontSize: "0.875rem",
							padding: "1rem",
						}}
					>
						Không có dữ liệu phù hợp
					</Typography>
				)}
			</TableContainer>
		</>
	);
}

export default TournamentRanking;
