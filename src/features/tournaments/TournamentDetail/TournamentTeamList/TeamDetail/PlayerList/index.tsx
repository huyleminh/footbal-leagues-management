import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
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
import { toast } from "material-react-toastify";
import React from "react";
import { useMatch } from "react-router-dom";
import { IPlayerListDetail } from "..";
import { IAPIResponse } from "../../../../../../@types/AppInterfaces";
import { IBaseComponentProps } from "../../../../../../@types/ComponentInterfaces";
import ActionMenu, {
	IActionList,
	IActionMenuItem,
} from "../../../../../../components/actionmenu/ActionMenu";
import ToastMsg from "../../../../../../components/toast/ToastMsg";
import AuthContext from "../../../../../../contexts/AuthContext";
import HttpService from "../../../../../../services/HttpService";
import PlayerFormDialog, { IPlayerFormDialogData } from "../PlayerFormDialog";

export interface IPlayerList extends IBaseComponentProps {
	data?: Array<IPlayerListDetail>;
}

function PlayerList(props: IPlayerList) {
	const { data } = props;
	const authContext = React.useContext(AuthContext);
	const match = useMatch("tournaments/:tournamentId/teams/:id");
	const [dialog, setDialog] = React.useState<{
		open: boolean;
		mode: "create" | "edit" | "replace";
	}>({
		open: false,
		mode: "create",
	});
	const [initData, setInitData] = React.useState<IPlayerFormDialogData>({
		playerName: "",
		idNumber: "",
		country: "",
		stripNumber: 0,
		position: "",
		type: 0,
	});

	const handleSubmitDialog = async (data: IPlayerFormDialogData) => {
		const playerId = data.id;
		const payload = { ...data, id: undefined, teamId: match?.params.id };
		console.log(payload);

		try {
			const res =
				dialog.mode === "create"
					? await HttpService.post<IAPIResponse<string | undefined>>("/players", payload)
					: await HttpService.put<IAPIResponse<string | undefined>>(
							`/players/${playerId}/replace`,
							payload,
					  );
			if (res.code === 201) {
				window.location.reload()
			} else {
				toast(<ToastMsg title={res?.data as string} type="error" />, {
					type: toast.TYPE.ERROR,
				});
			}
		} catch (err) {
			console.log(err);
			toast(<ToastMsg title="Có lỗi xảy ra, vui lòng thử lại sau!" type="error" />, {
				type: toast.TYPE.ERROR,
			});
		}
		setDialog({ ...dialog, open: false });
	};

	const openCreate = () => {
		setInitData({
			playerName: "",
			idNumber: "",
			country: "",
			stripNumber: 0,
			position: "",
			type: 0,
		});
		setDialog({ open: true, mode: "create" });
	};

	const openReplace = (item: IActionMenuItem) => {
		setInitData({
			id: item?.id,
			playerName: item?.name,
			idNumber: "",
			country: "",
			stripNumber: 0,
			position: "",
			type: 0,
		});
		setDialog({ open: true, mode: "replace" });
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
										<ActionMenu
											actionList={actionList}
											item={{ id: item._id ?? index.toString(), name: item.playerName }}
										/>
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
