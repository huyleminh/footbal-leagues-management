import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { IBaseComponentProps } from "../../../@types/ComponentInterfaces";
import CustomPagination from "../../../components/pagination";
import ManagerDetail from "../ManagerDetail";
import ActionMenu, { IActionList } from "../../../components/actionmenu/ActionMenu";
import ResetManagerPassword from "../ResetManagerPassword";
import CreateManager from "../CreateManager";

export interface ManagerListProps extends IBaseComponentProps {}

export interface IManagerTableRow {
	id: string;
	name: string;
	username: string;
	email: string;
	status: number;
	lastLockedDate: string;
}

function ManagerList(props: ManagerListProps) {
	const [managerStatus, setManagerStatus] = useState("");
	const [searchType, setSearchType] = useState("0");
	const [openDetailModal, setOpenDetailModal] = useState(false);
	const [openResetPWModal, setOpenResetPWModal] = useState(false);
	const [openCreateModal, setOpenCreateModal] = useState(false);
	const [selectedManagerId, setSelectedManagerId] = useState<string | undefined>()

	const data: Array<IManagerTableRow> = [
		{
			id: "1",
			name: "Huy Le",
			username: "testuser",
			email: "huyle@gmail.com",
			status: 0,
			lastLockedDate: "15/04/2022"
		},
		{
			id: "2",
			name: "Huy Le",
			username: "testuser",
			email: "huyle@gmail.com",
			status: 0,
			lastLockedDate: "N/A"
		},
		{
			id: "3",
			name: "Huy Le",
			username: "testuser",
			email: "huyle@gmail.com",
			status: 0,
			lastLockedDate: "15/04/2021"
		}
	]

	const handleOpenDetailModal = (id: string) => {
		setSelectedManagerId(id)
		setOpenDetailModal(true)
	}

	const handleOpenResetPWModal = (id: string) => {
		setSelectedManagerId(id)
		setOpenResetPWModal(true)
	}

	const actionList: Array<IActionList> = [
		{
			title: "Xem chi tiết",
			icon: <OpenInNewRoundedIcon fontSize="small" />,
			action: handleOpenDetailModal
		},
		{
			title: "Cấp lại mật khẩu",
			icon: <ChangeCircleIcon fontSize="small" />,
			action: handleOpenResetPWModal
		},
	]

	return (
		<>
			<ManagerDetail
				open={openDetailModal}
				managerId={selectedManagerId}
				onClose={setOpenDetailModal}
			/>
			<ResetManagerPassword
				open={openResetPWModal}
				managerId={selectedManagerId}
				onClose={setOpenResetPWModal}
			/>
			<CreateManager
				open={openCreateModal}
				onClose={setOpenCreateModal}
			/>
			<Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
				<Stack spacing={2} sx={{ display: "flex", alignItems: "center" }} direction="row">
					<Tooltip title="Tạo mới">
						<Button
							color="primary"
							variant="contained"
							size="small"
							onClick={() => setOpenCreateModal(true)}
						>
							<AddRoundedIcon />
						</Button>
					</Tooltip>
					<Typography variant="h6">Lọc</Typography>

					<FormControl sx={{ m: 0, minWidth: 120 }} size="small">
						<InputLabel id="status">Trạng thái</InputLabel>
						<Select
							id="status"
							label="Trạng thái"
							label-id="status"
							value={managerStatus}
							onChange={(e) => setManagerStatus(e.target.value)}
						>
							<MenuItem value="" disabled>
								Trạng thái
							</MenuItem>
							<MenuItem value={0}>Tất cả</MenuItem>
							<MenuItem value={1}>Bị khóa</MenuItem>
						</Select>
					</FormControl>
				</Stack>

				<Stack spacing={2} direction="row">
					<FormControl sx={{ m: 0 }} size="small">
						<Select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
							<MenuItem value={0}>Tên quản lý</MenuItem>
							<MenuItem value={1}>Email</MenuItem>
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
								Tên
							</TableCell>
							<TableCell align="left">Tài khoản</TableCell>
							<TableCell align="left">Email</TableCell>
							<TableCell align="left">Trạng thái</TableCell>
							<TableCell align="left">Ngày khóa gần nhất</TableCell>
							<TableCell align="left" sx={{ minWidth: "150px", width: "150px" }}>
								Hành động
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data.map((row, index) => (
							<TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
								<TableCell component="th" scope="row" sx={{ width: "50px" }}>
									{index + 1}
								</TableCell>
								<TableCell align="left" sx={{ width: "100px" }}>
									{row.name}
								</TableCell>
								<TableCell align="left">{row.username}</TableCell>
								<TableCell align="left">{row.email}</TableCell>
								<TableCell align="left">{row.status}</TableCell>
								<TableCell align="left">{row.lastLockedDate}</TableCell>
								<TableCell align="left" sx={{ minWidth: "150px", width: "150px" }}>
									<ActionMenu id={row.id} actionList={actionList} />
								</TableCell>
							</TableRow>
						))}
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

export default ManagerList;
