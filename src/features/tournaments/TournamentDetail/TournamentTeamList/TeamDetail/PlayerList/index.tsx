import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import {
	Button,
	Card,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import React from "react";
import { IBaseComponentProps } from "../../../../../../@types/ComponentInterfaces";
import ActionMenu, { IActionList } from "../../../../../../components/actionmenu/ActionMenu";
import AuthContext from "../../../../../../contexts/AuthContext";
import PlayerFormDialog from "../PlayerFormDialog";

export interface IPlayerList extends IBaseComponentProps {}

function PlayerList(props: IPlayerList) {
	const authContext = React.useContext(AuthContext);
	const [dialog, setDialog] = React.useState<{
		open: boolean;
		mode: "create" | "edit" | "replace";
	}>({
		open: false,
		mode: "create",
	});
	const [initData, setInitData] = React.useState({
		playerName: "",
		idNumber: "",
		country: "",
		stripNumber: 0,
		position: "",
	});

	const handleSubmitDialog = (data: any) => {
		console.log(data);
		setDialog({ ...dialog, open: false });
	};

	const openEdit = () => {
		setDialog({ open: true, mode: "edit" });
		setInitData({
			playerName: "Phil Foden",
			idNumber: "123456789657",
			country: "Anh",
			stripNumber: 47,
			position: "Tiền đạo trái",
		});
	};

	const openCreate = () => {
		setDialog({ open: true, mode: "create" });
	};

	const openReplace = () => {
		setDialog({ open: true, mode: "replace" });
		setInitData({
			playerName: "Phil Foden",
			idNumber: "",
			country: "",
			stripNumber: 0,
			position: "",
		});
	};

	const actionList: IActionList[] = [
		{ title: "Chỉnh sửa", action: openEdit, icon: <EditRoundedIcon fontSize="small" /> },
		{ title: "Thay thế", action: openReplace, icon: <AutorenewRoundedIcon fontSize="small" /> },
	];

	return (
		<Stack spacing={2}>
			<Stack direction="row" justifyContent="space-between">
				<Typography variant="h6">Danh sách cầu thủ</Typography>
				{authContext.role === "manager" && (
					<Button
						variant="contained"
						startIcon={<AddRoundedIcon sx={{ color: "#fff" }} />}
						onClick={openCreate}
					>
						Thêm mới
					</Button>
				)}
			</Stack>

			<TableContainer component={Card}>
				<Table sx={{ minWidth: 650 }} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell align="left" sx={{ width: "50px", minWidth: "50px" }}>
								STT
							</TableCell>
							<TableCell align="left">Họ Tên</TableCell>
							<TableCell align="left">Số định danh</TableCell>
							<TableCell align="left">Số áo</TableCell>
							<TableCell align="left">Vị trí thi đấu</TableCell>
							<TableCell align="left">Quốc tịch</TableCell>
							{authContext.role === "manager" && (
								<TableCell align="left" sx={{ width: "120px" }}>
									Hành động
								</TableCell>
							)}
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }} hover>
							<TableCell
								component="th"
								scope="row"
								sx={{ width: "50px", minWidth: "50px" }}
							>
								1
							</TableCell>
							<TableCell align="left">Phil Foden</TableCell>
							<TableCell align="left">0123456789</TableCell>
							<TableCell align="left">Anh</TableCell>
							<TableCell align="left">47</TableCell>
							<TableCell align="left">Tiền đạo trái</TableCell>
							{authContext.role === "manager" && (
								<TableCell align="left" sx={{ width: "120px" }}>
									<ActionMenu actionList={actionList} item={{ id: "123" }} />
								</TableCell>
							)}
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>

			<PlayerFormDialog
				mode={dialog.mode}
				open={dialog.open}
				onCancel={() => setDialog({ ...dialog, open: false })}
				onSubmit={handleSubmitDialog}
				data={initData}
			/>
		</Stack>
	);
}

export default PlayerList;
