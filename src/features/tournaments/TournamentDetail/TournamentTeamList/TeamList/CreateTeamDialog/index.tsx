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
import { IBaseComponentProps } from "../../../../../../@types/ComponentInterfaces";
import { readPlayersTemplateUploadAsync, readStaffsTemplateUploadAsync } from "../../../../../../utils/ExcelUtil";

export interface ICreateTeamDialog extends IBaseComponentProps {
	open: boolean;
	onCancel: () => void;
	onSubmit: (data: ICreateTeamDialogData) => void;
}

export interface ICreateTeamDialogData {}

function CreateTeamDialog(props: ICreateTeamDialog) {
	const { open, onCancel, onSubmit } = props;
	const [logoImage, setLogoImage] = useState<File | null>(null);
	const [playerExcel, setPlayerExcel] = useState<File | null>(null);
	const [staffExcel, setStaffExcel] = useState<File | null>(null);

	const handleSubmit = () => {
		onSubmit({});
	};

	const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.target;
		setLogoImage(target.files && target.files[0]);
	};

	const handleChangePlayerExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.target;
		if (target.files)
			readPlayersTemplateUploadAsync(target.files[0]).then(console.log)
		// setPlayerExcel(target.files && target.files[0]);
	};

	const handleChangeStaffExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.target;
		if (target.files)
			readStaffsTemplateUploadAsync(target.files[0]).then(console.log)
		// setStaffExcel(target.files && target.files[0]);
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
							name="maxAdditionalPlayer"
							required
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
				<Button variant="outlined" onClick={() => onCancel()}>
					Hủy
				</Button>
				<Button variant="contained" onClick={handleSubmit}>
					Lưu
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default CreateTeamDialog;
