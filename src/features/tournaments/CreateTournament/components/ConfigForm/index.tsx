import { Button, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { IBaseComponentProps } from "../../../../../@types/ComponentInterfaces";

export interface ITournamentConfigForm {
	maxAdditionalPlayer: number;
	maxChangingPlayer: number;
	maxPlayerAge: number;
	maxAbroardPlayer: number;
	maxTeam: number;
	maxPlayerPerMatch: number;
}

export interface IConfigFormProps extends IBaseComponentProps {
	onNext?: (data: any) => void | undefined;
	onPrevious?: () => void | undefined;
	disabled?: boolean;
	data?: ITournamentConfigForm;
}

function ConfigForm(props: IConfigFormProps) {
	const { onNext, onPrevious, disabled, data } = props;
	const [config, setConfig] = useState<ITournamentConfigForm>(() => {
		if (data === undefined) {
			return {
				maxAdditionalPlayer: 0,
				maxChangingPlayer: 0,
				maxPlayerAge: 0,
				maxAbroardPlayer: 0,
				maxTeam: 0,
				maxPlayerPerMatch: 0,
			};
		}
		return data;
	});

	const handleChangeField = (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.target;
		setConfig({ ...config, [target.name]: +target.value });
	};

	const handleSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault();
		if (!onNext) {
			return;
		}
		onNext(config);
	};

	return (
		<form onSubmit={handleSubmit}>
			<Stack spacing={2}>
				<Typography variant="h5">Quy định giải đấu</Typography>
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
						Số cầu thủ được thay tối đa <span style={{ color: "#F85166" }}>*</span>
					</Typography>
					<TextField
						variant="outlined"
						placeholder="Nhập số cầu thủ được thay tối đa"
						type="number"
						size="small"
						sx={{ flexGrow: 1 }}
						name="maxChangingPlayer"
						value={config.maxChangingPlayer}
						onChange={handleChangeField}
						required
						disabled={disabled}
						inputProps={{
							min: "0",
						}}
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
						Số cầu thủ được thêm tối đa <span style={{ color: "#F85166" }}>*</span>
					</Typography>
					<TextField
						variant="outlined"
						placeholder="Nhập số cầu thủ được thêm tối đa"
						type="number"
						size="small"
						sx={{ flexGrow: 1 }}
						name="maxAdditionalPlayer"
						value={config.maxAdditionalPlayer}
						onChange={handleChangeField}
						required
						disabled={disabled}
						inputProps={{
							min: "0",
						}}
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
						Độ tuổi tham gia tối đa <span style={{ color: "#F85166" }}>*</span>
					</Typography>
					<TextField
						variant="outlined"
						placeholder="Nhập độ tuổi tham gia tối đa"
						type="number"
						size="small"
						sx={{ flexGrow: 1 }}
						name="maxPlayerAge"
						value={config.maxPlayerAge}
						onChange={handleChangeField}
						required
						disabled={disabled}
						inputProps={{
							min: "0",
						}}
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
						Số ngoại binh mỗi đội tối đa <span style={{ color: "#F85166" }}>*</span>
					</Typography>
					<TextField
						variant="outlined"
						placeholder="Nhập số ngoại binh mỗi đội tối đa"
						type="number"
						size="small"
						sx={{ flexGrow: 1 }}
						name="maxAbroardPlayer"
						value={config.maxAbroardPlayer}
						onChange={handleChangeField}
						required
						disabled={disabled}
						inputProps={{
							min: "0",
						}}
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
						Số đội tối đa <span style={{ color: "#F85166" }}>*</span>
					</Typography>
					<TextField
						variant="outlined"
						placeholder="Nhập số đội tối đa"
						type="number"
						size="small"
						sx={{ flexGrow: 1 }}
						name="maxTeam"
						value={config.maxTeam}
						onChange={handleChangeField}
						required
						disabled={disabled}
						inputProps={{
							min: "0",
						}}
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
						Số cầu thủ tối đa mỗi trận <span style={{ color: "#F85166" }}>*</span>
					</Typography>
					<TextField
						variant="outlined"
						placeholder="Nhập số cầu thủ tối đa mỗi trận"
						type="number"
						size="small"
						sx={{ flexGrow: 1 }}
						name="maxPlayerPerMatch"
						value={config.maxPlayerPerMatch}
						onChange={handleChangeField}
						required
						disabled={disabled}
						inputProps={{
							min: "0",
						}}
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

export default ConfigForm;
