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
import React from "react";
import { toast } from "material-react-toastify";
import ToastMsg from "../../../../../../components/toast/ToastMsg";
import { useMatch } from "react-router-dom";
import Swal from "sweetalert2";
import { ITeamStaff } from "..";
import { IAPIResponse } from "../../../../../../@types/AppInterfaces";
import { IBaseComponentProps } from "../../../../../../@types/ComponentInterfaces";
import ActionMenu, {
	IActionList,
	IActionMenuItem,
} from "../../../../../../components/actionmenu/ActionMenu";
import AuthContext from "../../../../../../contexts/AuthContext";
import HttpService from "../../../../../../services/HttpService";
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
	const match = useMatch("tournaments/:tournamentId/teams/:id");
	const [initData, setInitData] = React.useState<IStaffFormDialogData>({
		fullname: "",
		country: "",
		role: 2,
	});

	const handleSubmitDialog = async (data: IStaffFormDialogData) => {
		try {
			const res =
				dialog.mode === "create"
					? await HttpService.post<IAPIResponse<string>>(
							`/teams/${match?.params.id || ""}/staffs`,
							data,
					  )
					: await HttpService.put<IAPIResponse<string>>(
							`/teams/${match?.params.id || ""}/staffs/${data.id}`,
							data,
					  );
			if ((dialog.mode === "create" && res.code === 201) || (dialog.mode === "edit" && res.code === 204)) {
				window.location.reload();
			} else {
				toast(<ToastMsg title={res?.data as string} type="error" />, {
					type: toast.TYPE.ERROR,
				});
			}
		} catch (err) {
			console.log(err);
			toast(<ToastMsg title="C?? l???i x???y ra, vui l??ng th??? l???i sau!" type="error" />, {
				type: toast.TYPE.ERROR,
			});
		}
		setDialog({ ...dialog, open: false });
	};

	const openEdit = (item: IActionMenuItem) => {
		setInitData({
			id: item.id,
			fullname: item?.fullname,
			country: item?.country,
			role: item?.role,
		});
		setDialog({ open: true, mode: "edit" });
	};

	const openCreate = () => {
		setDialog({ open: true, mode: "create" });
	};

	const handleDeleteAsync = async (item: IActionMenuItem) => {
		const result = await Swal.fire({
			title: "X??a th??nh vi??n",
			text: "B???n c?? ch???c ch???n mu???n x??a ng?????i n??y",
			confirmButtonText: "?????ng ??",
			cancelButtonText: "H???y",
			showCancelButton: true,
			icon: "warning",
		});

		if (result.isConfirmed) {
			try {
				const res = await HttpService.delete<IAPIResponse<string>>(
					`/teams/${match?.params.id || ""}/staffs/${item.id}`,
				);
				if (res.code === 204) {
					window.location.reload();
				} else {
					toast(<ToastMsg title={`${res.data}!`} type="error" />, {
						type: toast.TYPE.ERROR,
					});
				}
			} catch (err) {
				console.log(err);
				toast(<ToastMsg title="C?? l???i x???y ra, vui l??ng th??? l???i sau!" type="error" />, {
					type: toast.TYPE.ERROR,
				});
			}
		}
	};

	const actionList: IActionList[] = [
		{ title: "Ch???nh s???a", action: openEdit, icon: <EditRoundedIcon fontSize="small" /> },
		{ title: "X??a", action: handleDeleteAsync, icon: <DeleteRoundedIcon fontSize="small" /> },
	];

	return (
		<Stack spacing={2}>
			<Stack direction="row" justifyContent="space-between">
				<Typography variant="h6">Danh s??ch ban hu???n luy???n</Typography>
				{authContext.role === "manager" && (
					<Button
						variant="contained"
						startIcon={<AddRoundedIcon sx={{ color: "#fff" }} />}
						onClick={openCreate}
					>
						Th??m m???i
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
							<TableCell align="left">H??? T??n</TableCell>
							<TableCell align="left">Ch???c v???</TableCell>
							<TableCell align="left">Qu???c t???ch</TableCell>
							{authContext.role === "manager" && (
								<TableCell align="left" sx={{ width: "120px" }}>
									H??nh ?????ng
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
										? "HLV Tr?????ng"
										: item.role === TEAM_STAFF_ROLE_ENUM.COACH_ASSISTANT
										? "Tr??? l?? HLV"
										: "Nh??n vi??n"}
								</TableCell>
								<TableCell align="left">{item.country}</TableCell>
								{authContext.role === "manager" && (
									<TableCell align="left" sx={{ width: "120px" }}>
										<ActionMenu
											actionList={actionList}
											item={{ id: item._id ?? index.toString(), ...item }}
										/>
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
