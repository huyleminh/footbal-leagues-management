import {
	Box, Paper, Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow
} from "@mui/material";
import React from "react";
import { IBaseComponentProps } from "../../../../@types/ComponentInterfaces";

function TournamentRanking(props: IBaseComponentProps) {
	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} aria-label="simple table">
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
					<TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
						<TableCell component="th" scope="row" sx={{ width: "100px", minWidth: "100px" }}>
							1
						</TableCell>
						<TableCell align="left" sx={{ width: "100px" }}>
							<Box sx={{ width: "100px", height: "100px" }}>
								<img
									src="https://givetour.s3.amazonaws.com/UploadFiles/Competitors/170397.png"
									alt="logoTournament"
									style={{ width: "100%", height: "100%" }}
								/>
							</Box>
						</TableCell>
						<TableCell align="left">Manchester City</TableCell>
						<TableCell align="left">31</TableCell>
						<TableCell align="left">23 - 5 - 3</TableCell>
						<TableCell align="left">74</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default TournamentRanking;
