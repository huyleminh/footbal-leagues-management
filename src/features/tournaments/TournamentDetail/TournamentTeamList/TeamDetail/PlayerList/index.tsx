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
import { IPlayerListDetail } from "..";
import { IBaseComponentProps } from "../../../../../../@types/ComponentInterfaces";
import ActionMenu, { IActionList } from "../../../../../../components/actionmenu/ActionMenu";
import AuthContext from "../../../../../../contexts/AuthContext";
import PlayerFormDialog from "../PlayerFormDialog";

export interface IPlayerList extends IBaseComponentProps {
	data?: Array<IPlayerListDetail>;
}

function PlayerList(props: IPlayerList) {
	const { data } = props;
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

			<TableContainer sx={{ maxHeight: "45vh", overflow: "auto" }} component={Card}>
				<Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
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
								<TableCell align="left">{item.playerName}</TableCell>
								<TableCell align="left">{item.idNumber}</TableCell>
								<TableCell align="left">{item.stripNumber}</TableCell>
								<TableCell align="left">{item.position}</TableCell>
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
