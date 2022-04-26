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
					title: "Nhập cầu thủ",
					text: `Dữ liệu đã nhập có ${imported.totalError} dòng bị lỗi, vui lòng nhập lại`,
					confirmButtonText: "Đồng ý",
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
				title: "Nhập cầu thủ",
				text: `File không đúng định dạng hoặc đã có lỗi xảy ra`,
				confirmButtonText: "Đồng ý",
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
					title: "Nhập nhân sựu",
					text: `Dữ liệu đã nhập có ${imported.totalError} dòng bị lỗi, vui lòng nhập lại`,
					confirmButtonText: "Đồng ý",
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
				title: "Nhập nhân sựu",
				text: `File không đúng định dạng hoặc đã có lỗi xảy ra`,
				confirmButtonText: "Đồng ý",
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
			<DialogTitle id="create-team-dialog-title">Thêm mới đội bóng</DialogTitle>

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
							Tên đội bóng <span style={{ color: "#F85166" }}>*</span>
						</Typography>
						<TextField
							variant="outlined"
							placeholder="Nhập tên đội bóng"
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
							Logo giải đấu <span style={{ color: "#F85166" }}>*</span>
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
								Tải ảnh lên
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
							Danh sách cầu thủ <span style={{ color: "#F85166" }}>*</span>
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
								Nhập danh sách
							</Button>
						</label>
						<Link
							to="/templates/add_players_template.xlsx"
							download
							target="_blank"
							style={{ textDecoration: "none" }}
						>
							<Button variant="outlined" startIcon={<FileDownloadRoundedIcon />}>
								Tải tập tin mẫu
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
							Danh sách nhân sự <span style={{ color: "#F85166" }}>*</span>
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
								Nhập danh sách
							</Button>
						</label>
						<Link
							to="/templates/add_staffs_template.xlsx"
							download
							target="_blank"
							style={{ textDecoration: "none" }}
						>
							<Button variant="outlined" startIcon={<FileDownloadRoundedIcon />}>
								Tải tập tin mẫu
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
					Hủy
				</Button>
				<Button
					disabled={loading}
					variant="contained"
					onClick={handleSubmit}
					startIcon={loading ? <CircularProgress color="inherit" size={15} /> : <></>}
				>
					Lưu
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default CreateTeamDialog;
