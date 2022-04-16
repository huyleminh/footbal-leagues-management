import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { AlertTitle, Stack, Typography } from "@mui/material";
import { toast, TypeOptions } from "material-react-toastify";
import React from "react";

export interface IToastMsg {
	type: TypeOptions;
	title: string;
	message?: string;
}

function ToastMsg(props: IToastMsg) {
	const { type, title, message } = props;
	let icon: JSX.Element = <></>;
	switch (type) {
		case toast.TYPE.ERROR:
			icon = <ErrorOutlineRoundedIcon />;
			break;
		case toast.TYPE.SUCCESS:
			icon = <CheckCircleOutlineRoundedIcon />;
			break;
		case toast.TYPE.WARNING:
			icon = <WarningAmberRoundedIcon />;
			break;
		case toast.TYPE.INFO:
			icon = <InfoOutlinedIcon />;
			break;
	}
	return (
		<Stack direction="row" spacing={1} sx={{ py: 1 }}>
			{icon}
			<Stack>
				<AlertTitle sx={{ fontSize: "16px" }}>{title}</AlertTitle>
				<Typography sx={{ fontSize: "14px" }}>{message}</Typography>
			</Stack>
		</Stack>
	);
}

export default ToastMsg;
