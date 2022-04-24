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
} from "@mui/material";
import { toast } from "material-react-toastify";
import { useEffect, useState } from "react";
import { useMatch } from "react-router-dom";
import { IAPIResponse } from "../../../../@types/AppInterfaces";
import { IBaseComponentProps } from "../../../../@types/ComponentInterfaces";
import ToastMsg from "../../../../components/toast/ToastMsg";
import HttpService from "../../../../services/HttpService";

interface ITournamentRankingData {
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
	}, [match]);

	return (
		<>
			{isLoading ? (
				<Box sx={{ width: "100%" }}>
					<LinearProgress />
				</Box>
			) : null}
			<TableContainer sx={{ maxHeight: "58vh", overflow: "auto" }} component={Card}>
				<Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
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
						{data.map((item, index) => (
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
									<Box sx={{ width: "100px", height: "100px" }}>
										<img
											src={item.logo || ""}
											alt="logoTournament"
											style={{ width: "100%", height: "100%" }}
										/>
									</Box>
								</TableCell>
								<TableCell align="left">{item.name}</TableCell>
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
			</TableContainer>
		</>
	);
}

export default TournamentRanking;
