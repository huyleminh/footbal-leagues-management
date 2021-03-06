import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { IBaseComponentProps } from "../../../../../../@types/ComponentInterfaces";
import { IPlayerExcelModel, IStaffExcelModel } from "../../../../../../@types/models/ExcelModels";
import {
	readPlayersTemplateUploadAsync,
	readStaffsTemplateUploadAsync,
} from "../../../../../../utils/ExcelUtil";
import CircularProgress from "@mui/material/CircularProgress";

export interface ICreateTeamDialog extends IBaseComponentProps {
	open: boolean;
	onCancel: () => void;
	onSubmit: (data: ICreateTeamDialogData) => void;
	loading: boolean;
}

export interface ICreateTeamDialogData {
	name: string;
	logo: File;
	playerList: Array<IPlayerExcelModel>;
	staffList: Array<IStaffExcelModel>;
}

function CreateTeamDialog(props: ICreateTeamDialog) {
	const { open, onCancel, onSubmit, loading } = props;
	const [logoImage, setLogoImage] = useState<File | null>(null);
	const [playerExcel, setPlayerExcel] = useState<any | null>(null);
	const [staffExcel, setStaffExcel] = useState<any | null>(null);
	const [name, setName] = useState("");

	const handleSubmit = () => {
		if (!name || !name.trim() || !logoImage || !playerExcel || !staffExcel) {
			return;
		}
		onSubmit({
			name: name.trim(),
			logo: logoImage,
			playerList: playerExcel.data,
			staffList: staffExcel.data,
		});
	};

	const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.target;
		setLogoImage(target.files && target.files[0]);
	};

	const handleChangePlayerExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.target;
		if (!target.files) return;
		try {
			const imported = await readPlayersTemplateUploadAsync(target.files[0]);
			if (imported.totalError > 0) {
				Swal.fire({
					title: "Nh???p c???u th???",
					text: `D??? li???u ???? nh???p c?? ${imported.totalError} d??ng b??? l???i, vui l??ng nh???p l???i`,
					confirmButtonText: "?????ng ??",
					icon: "warning",
				});
			} else {
				setPlayerExcel({
					name: target.files[0].name,
					data: imported.data,
				});
			}
		} catch (error) {
			console.log(error);
			Swal.fire({
				title: "Nh???p c???u th???",
				text: `File kh??ng ????ng ?????nh d???ng ho???c ???? c?? l???i x???y ra`,
				confirmButtonText: "?????ng ??",
				icon: "error",
			});
		}
	};

	const handleChangeStaffExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.target;
		if (!target.files) return;
		try {
			const imported = await readStaffsTemplateUploadAsync(target.files[0]);
			if (imported.totalError > 0) {
				Swal.fire({
					title: "Nh???p nh??n s???u",
					text: `D??? li???u ???? nh???p c?? ${imported.totalError} d??ng b??? l???i, vui l??ng nh???p l???i`,
					confirmButtonText: "?????ng ??",
					icon: "warning",
				});
			} else {
				setStaffExcel({
					name: target.files[0].name,
					data: imported.data,
				});
			}
		} catch (error) {
			console.log(error);
			Swal.fire({
				title: "Nh???p nh??n s???u",
				text: `File kh??ng ????ng ?????nh d???ng ho???c ???? c?? l???i x???y ra`,
				confirmButtonText: "?????ng ??",
				icon: "error",
			});
		}
	};

	return (
		<Dialog
			open={open}
			aria-labelledby="create-team-dialog-title"
			maxWidth="md"
			fullWidth
			disableEscapeKeyDown
		>
			<DialogTitle id="create-team-dialog-title">Th??m m???i ?????i b??ng</DialogTitle>

			<DialogContent>
				<Stack spacing={2}>
					<Stack direction="row" spacing={2} sx={{ width: "100%", alignItems: "center" }}>
						<Typography
							sx={{
								display: "inline-flex",
								fontWeight: "500",
								fontSize: "15px",
								minWidth: 250,
								justifyContent: "flex-end",
							}}
						>
							T??n ?????i b??ng <span style={{ color: "#F85166" }}>*</span>
						</Typography>
						<TextField
							variant="outlined"
							placeholder="Nh???p t??n ?????i b??ng"
							type="text"
							size="small"
							sx={{ flexGrow: 1 }}
							name="name"
							required
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</Stack>

					<Stack direction="row" spacing={2} sx={{ width: "100%", alignItems: "center" }}>
						<Typography
							sx={{
								display: "inline-flex",
								fontWeight: "500",
								fontSize: "15px",
								minWidth: 250,
								justifyContent: "flex-end",
							}}
						>
							Logo gi???i ?????u <span style={{ color: "#F85166" }}>*</span>
						</Typography>
						<label htmlFor="logo-upload" style={{ position: "relative" }}>
							<input
								type="file"
								accept="image/*"
								id="logo-upload"
								style={{
									position: "absolute",
									left: 0,
									width: "10px",
									zIndex: "-1",
								}}
								required
								onChange={handleChangeImage}
							/>
							<Button
								variant="contained"
								startIcon={<AddPhotoAlternateRoundedIcon />}
								component="span"
							>
								T???i ???nh l??n
							</Button>
						</label>
						<Typography
							sx={{
								fontWeight: "500",
								fontSize: "14px",
								overflow: "hidder",
								textOverflow: "ellipsis",
							}}
						>
							{logoImage && logoImage.name}
						</Typography>
					</Stack>

					<Stack direction="row" spacing={2} sx={{ width: "100%", alignItems: "center" }}>
						<Typography
							sx={{
								display: "inline-flex",
								fontWeight: "500",
								fontSize: "15px",
								minWidth: 250,
								justifyContent: "flex-end",
							}}
						>
							Danh s??ch c???u th??? <span style={{ color: "#F85166" }}>*</span>
						</Typography>
						<label htmlFor="player-file-upload" style={{ position: "relative" }}>
							<input
								type="file"
								accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
								id="player-file-upload"
								style={{
									position: "absolute",
									left: 0,
									width: "10px",
									zIndex: "-1",
								}}
								required
								onChange={handleChangePlayerExcel}
							/>
							<Button
								variant="contained"
								startIcon={<UploadFileRoundedIcon />}
								component="span"
							>
								Nh???p danh s??ch
							</Button>
						</label>
						<Link
							to="/templates/add_players_template.xlsx"
							download
							target="_blank"
							style={{ textDecoration: "none" }}
						>
							<Button variant="outlined" startIcon={<FileDownloadRoundedIcon />}>
								T???i t???p tin m???u
							</Button>
						</Link>
						<Typography
							sx={{
								fontWeight: "500",
								fontSize: "14px",
								overflow: "hidder",
								textOverflow: "ellipsis",
							}}
						>
							{playerExcel && playerExcel.name}
						</Typography>
					</Stack>

					<Stack direction="row" spacing={2} sx={{ width: "100%", alignItems: "center" }}>
						<Typography
							sx={{
								display: "inline-flex",
								fontWeight: "500",
								fontSize: "15px",
								minWidth: 250,
								justifyContent: "flex-end",
							}}
						>
							Danh s??ch nh??n s??? <span style={{ color: "#F85166" }}>*</span>
						</Typography>
						<label htmlFor="staff-file-upload" style={{ position: "relative" }}>
							<input
								type="file"
								accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
								id="staff-file-upload"
								style={{
									position: "absolute",
									left: 0,
									width: "10px",
									zIndex: "-1",
								}}
								required
								onChange={handleChangeStaffExcel}
							/>
							<Button
								variant="contained"
								startIcon={<UploadFileRoundedIcon />}
								component="span"
							>
								Nh???p danh s??ch
							</Button>
						</label>
						<Link
							to="/templates/add_staffs_template.xlsx"
							download
							target="_blank"
							style={{ textDecoration: "none" }}
						>
							<Button variant="outlined" startIcon={<FileDownloadRoundedIcon />}>
								T???i t???p tin m???u
							</Button>
						</Link>
						<Typography
							sx={{
								fontWeight: "500",
								fontSize: "14px",
								overflow: "hidder",
								textOverflow: "ellipsis",
							}}
						>
							{staffExcel && staffExcel.name}
						</Typography>
					</Stack>
				</Stack>
			</DialogContent>

			<DialogActions>
				<Button disabled={loading} variant="text" onClick={() => onCancel()}>
					H???y
				</Button>
				<Button
					disabled={loading}
					variant="contained"
					onClick={handleSubmit}
					startIcon={loading ? <CircularProgress color="inherit" size={15} /> : <></>}
				>
					L??u
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default CreateTeamDialog;
