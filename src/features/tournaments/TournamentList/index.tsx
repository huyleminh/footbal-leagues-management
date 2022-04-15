import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {
	Box,
	Button,
	FormControl,
	InputLabel,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Paper,
	Select,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IBaseComponentProps } from "../../../@types/ComponentInterfaces";
import CustomPagination from "../../../components/pagination";

export interface ITournamentListProps extends IBaseComponentProps {}

function TournamentList(props: ITournamentListProps) {
	const navigate = useNavigate();
	const [tournamentStatus, setTournamentStatus] = useState("");
	const [searchType, setSearchType] = useState("0");

	// Action menu
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	return (
		<>
			<Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
				<Stack spacing={2} sx={{ display: "flex", alignItems: "center" }} direction="row">
					<Typography variant="h6">Lọc</Typography>

					<FormControl sx={{ m: 0, minWidth: 120 }} size="small">
						<InputLabel id="status">Trạng thái</InputLabel>
						<Select
							id="status"
							label="Trạng thái"
							label-id="status"
							value={tournamentStatus}
							onChange={(e) => setTournamentStatus(e.target.value)}
						>
							<MenuItem value="" disabled>
								Trạng thái
							</MenuItem>
							<MenuItem value={0}>Tất cả</MenuItem>
							<MenuItem value={1}>Đang diễn ra</MenuItem>
						</Select>
					</FormControl>

					<FormControl size="small">
						<FormControlLabel
							control={<Checkbox defaultChecked sx={{ padding: 0 }} />}
							label={
								<Typography sx={{ fontSize: "0.875rem" }}>Tôi quản lý</Typography>
							}
						/>
					</FormControl>
				</Stack>

				<Stack spacing={2} direction="row">
					<FormControl sx={{ m: 0 }} size="small">
						<Select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
							<MenuItem value={0}>Tên giải đấu</MenuItem>
							<MenuItem value={1}>Tên quản lý</MenuItem>
						</Select>
					</FormControl>

					<TextField
						variant="outlined"
						placeholder="Nhập từ khóa"
						size="small"
					></TextField>

					<Button
						color="primary"
						variant="contained"
						size="small"
						startIcon={<SearchRoundedIcon />}
					>
						Tìm kiếm
					</Button>
				</Stack>
			</Box>

			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell align="left" sx={{ width: "50px", minWidth: "50px" }}>
								STT
							</TableCell>
							<TableCell align="left" sx={{ width: "100px" }}>
								Logo
							</TableCell>
							<TableCell align="left">Tên giải</TableCell>
							<TableCell align="left">Người quản lý</TableCell>
							<TableCell align="left">Số đội tham gia</TableCell>
							<TableCell align="left">Trạng thái</TableCell>
							<TableCell align="left" sx={{ minWidth: "150px", width: "150px" }}>
								Hành động
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
							<TableCell component="th" scope="row" sx={{ width: "50px" }}>
								1
							</TableCell>
							<TableCell align="left" sx={{ width: "100px" }}>
								<Box sx={{ width: "100px", height: "100px" }}>
									<img
										src="https://givetour.s3.amazonaws.com/UploadFiles/League/35675/Avatar.png"
										alt="logoTournament"
										style={{ width: "100%", height: "100%" }}
									/>
								</Box>
							</TableCell>
							<TableCell align="left">Premier League 2022</TableCell>
							<TableCell align="left">Huy Le</TableCell>
							<TableCell align="left">20</TableCell>
							<TableCell align="left">20</TableCell>
							<TableCell align="left" sx={{ minWidth: "150px", width: "150px" }}>
								<Button
									id="basic-button"
									aria-controls={open ? "basic-menu" : undefined}
									aria-haspopup="true"
									aria-expanded={open ? "true" : undefined}
									onClick={(event) => setAnchorEl(event.currentTarget)}
									variant="contained"
									startIcon={<SettingsOutlinedIcon fontSize="large" />}
									endIcon={<ArrowDropDownRoundedIcon fontSize="large" />}
									size="large"
									sx={{
										"&>span": { margin: "0!important" },
										padding: "0.5rem 1rem!important",
									}}
								></Button>
								<Menu
									id="basic-menu"
									anchorEl={anchorEl}
									open={open}
									onClose={() => setAnchorEl(null)}
									MenuListProps={{
										"aria-labelledby": "basic-button",
									}}
								>
									<MenuItem
										onClick={() => navigate("/tournaments/1")}
										sx={{ padding: "0.25rem 0.5rem" }}
									>
										<ListItemIcon>
											<OpenInNewRoundedIcon fontSize="small" />
										</ListItemIcon>
										<ListItemText sx={{ "&>span": { fontSize: "15px" } }}>
											Xem chi tiết
										</ListItemText>
									</MenuItem>
								</Menu>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>

			<CustomPagination
				page={1}
				totalPage={100}
				onChange={(value) => {
					console.log({ value });
				}}
				allowChangeMax
				maxItem={20}
				maxItemList={[5, 10, 15, 20, 25]}
				onChangeMaxItem={(value) => console.log(value)}
				sx={{ mt: 3, display: "inline-flex", justifyContent: "flex-end", width: "100%" }}
			/>
		</>
	);
}

export default TournamentList;
