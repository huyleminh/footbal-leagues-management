import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import { Button, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { IBaseComponentProps } from "../../../../../@types/ComponentInterfaces";

export interface ITournamentInfoForm {
	name: string;
	image: File | null;
	sponsorName: string;
}

export interface IInformationFormProps extends IBaseComponentProps {
	onNext?: (data: any) => void | undefined;
	onPrevious?: () => void | undefined;
	disabled?: boolean;
	data?: ITournamentInfoForm;
}

function InformationForm(props: IInformationFormProps) {
	const { onNext, onPrevious, disabled, data } = props;
	const [info, setInfo] = useState<ITournamentInfoForm>(() => {
		if (data === undefined) {
			return {
				name: "",
				sponsorName: "",
				image: null,
			};
		}
		return data;
	});

	const handleChangeField = (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.target;
		setInfo({ ...info, [target.name]: target.value });
	};

	const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.target;
		setInfo({ ...info, image: target.files && target.files[0] });
	};

	const handleSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault();
		if (!onNext) {
			return;
		}
		onNext(info);
	};

	return (
		<form onSubmit={handleSubmit}>
			<Stack spacing={2}>
				<Typography variant="h5">Thông tin cơ bản giải đấu</Typography>
				<Stack direction="row" spacing={3} sx={{ width: "100%", alignItems: "center" }}>
					<Typography
						sx={{
							display: "inline-flex",
							fontWeight: "500",
							fontSize: "15px",
							minWidth: 250,
							justifyContent: "flex-end",
						}}
					>
						Tên giải đấu <span style={{ color: "#F85166" }}>*</span>
					</Typography>
					<TextField
						variant="outlined"
						placeholder="Nhập tên giải đấu"
						type="text"
						size="small"
						sx={{ flexGrow: 1 }}
						value={info.name}
						name="name"
						onChange={handleChangeField}
						required
						disabled={disabled}
					/>
				</Stack>
				<Stack direction="row" spacing={3} sx={{ width: "100%", alignItems: "center" }}>
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
							style={{ position: "absolute", left: 0, width: "10px", zIndex: "-1" }}
							name="image"
							onChange={handleChangeImage}
							required
							disabled={disabled}
						/>
						<Button
							variant="contained"
							startIcon={<AddPhotoAlternateRoundedIcon />}
							component="span"
							disabled={disabled}
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
						{info.image ? info.image.name : "Không có tệp nào được chọn"}
					</Typography>
				</Stack>
				<Stack direction="row" spacing={3} sx={{ width: "100%", alignItems: "center" }}>
					<Typography
						sx={{
							display: "inline-flex",
							fontWeight: "500",
							fontSize: "15px",
							minWidth: 250,
							justifyContent: "flex-end",
						}}
					>
						Tên nhà tài trợ <span style={{ color: "#F85166" }}>*</span>
					</Typography>
					<TextField
						variant="outlined"
						placeholder="Mỗi nhà tài trợ được ngăn cách bởi dấu phẩy"
						type="text"
						size="small"
						sx={{ flexGrow: 1 }}
						value={info.sponsorName}
						name="sponsorName"
						onChange={handleChangeField}
						required
						disabled={disabled}
					/>
				</Stack>
				<Stack
					direction="row"
					sx={{ display: "flex", justifyContent: "center" }}
					spacing={2}
				>
					{!disabled && (
						<>
							<Button
								variant="outlined"
								type="button"
								onClick={() => onPrevious && onPrevious()}
							>
								Quay lại
							</Button>
							<Button variant="contained" type="submit">
								Tiếp tục
							</Button>
						</>
					)}
				</Stack>
			</Stack>
		</form>
	);
}

export default InformationForm;
