import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
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
import React, { useState } from "react";
import Swal from "sweetalert2";
import { ITeamStaff } from "..";
import { IBaseComponentProps } from "../../../../../../@types/ComponentInterfaces";
import ActionMenu, { IActionList } from "../../../../../../components/actionmenu/ActionMenu";
import AuthContext from "../../../../../../contexts/AuthContext";
import StaffFormDialog, { IStaffFormDialogData } from "../StaffFormDialog";

export interface IStaffList extends IBaseComponentProps {
	data?: Array<ITeamStaff>;
}

enum TEAM_STAFF_ROLE_ENUM {
	COACH,
	COACH_ASSISTANT,
	STAFF,
}

function StaffList(props: IStaffList) {
	const { data } = props;
	const authContext = React.useContext(AuthContext);
	const [dialog, setDialog] = React.useState<{ open: boolean; mode: "create" | "edit" }>({
		open: false,
		mode: "create",
	});
	// const [componentData, setComponentData] = React.useState(data);
	const [initData, setInitData] = React.useState({
		fullname: "",
		country: "",
		role: 2,
	});

	const handleSubmitDialog = (data: IStaffFormDialogData) => {
		console.log(data);
		setDialog({ ...dialog, open: false });
	};

	const openEdit = () => {
		setInitData({
			fullname: "Pep Guardiola",
			country: "Tây Ban Nha",
			role: 0,
		});
		setDialog({ open: true, mode: "edit" });
	};

	const openCreate = () => {
		setDialog({ open: true, mode: "create" });
	};

	const handleDeleteAsync = async () => {
		const result = await Swal.fire({
			title: "Xóa thành viên",
			text: "Bạn có chắc chắn muốn xóa người này",
			confirmButtonText: "Đồng ý",
			cancelButtonText: "Hủy",
			showCancelButton: true,
			icon: "warning",
		});
	};

	const actionList: IActionList[] = [
		{ title: "Chỉnh sửa", action: openEdit, icon: <EditRoundedIcon fontSize="small" /> },
		{ title: "Xóa", action: handleDeleteAsync, icon: <DeleteRoundedIcon fontSize="small" /> },
	];

	return (
		<Stack spacing={2}>
			<Stack direction="row" justifyContent="space-between">
				<Typography variant="h6">Danh sách ban huấn luyện</Typography>
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

			<TableContainer sx={{ maxHeight: "45vh", overflow: "auto" }} component={Card}>
				<Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							<TableCell align="left" sx={{ width: "50px", minWidth: "50px" }}>
								STT
							</TableCell>
							<TableCell align="left">Họ Tên</TableCell>
							<TableCell align="left">Chức vụ</TableCell>
							<TableCell align="left">Quốc tịch</TableCell>
							{authContext.role === "manager" && (
								<TableCell align="left" sx={{ width: "120px" }}>
									Hành động
								</TableCell>
							)}
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.map((item, index) => (
							<TableRow
								key={index}
								sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
								hover
							>
								<TableCell
									component="th"
									scope="row"
									sx={{ width: "50px", minWidth: "50px" }}
								>
									{index + 1}
								</TableCell>
								<TableCell align="left">{item.fullname}</TableCell>
								<TableCell align="left">
									{item.role === TEAM_STAFF_ROLE_ENUM.COACH
										? "HLV Trưởng"
										: item.role === TEAM_STAFF_ROLE_ENUM.COACH_ASSISTANT
										? "Trợ lý HLV"
										: "Nhân viên"}
								</TableCell>
								<TableCell align="left">{item.country}</TableCell>
								{authContext.role === "manager" && (
									<TableCell align="left" sx={{ width: "120px" }}>
										<ActionMenu actionList={actionList} item={{ id: "123" }} />
									</TableCell>
								)}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<StaffFormDialog
				mode={dialog.mode}
				open={dialog.open}
				onCancel={() => setDialog({ ...dialog, open: false })}
				onSubmit={handleSubmitDialog}
				data={initData}
			/>
		</Stack>
	);
}

export default StaffList;
