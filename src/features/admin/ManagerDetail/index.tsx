import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { IBaseComponentProps } from "../../../@types/ComponentInterfaces";
import {
	Box,
	Button,
	DialogActions,
	DialogContent,
	Divider,
	FormControl,
	FormControlLabel,
	FormLabel,
	LinearProgress,
	Radio,
	RadioGroup,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HttpService from "../../../services/HttpService";
import { IAPIResponse } from "../../../@types/AppInterfaces";
import moment from "moment";
import Swal from "sweetalert2";

export interface IManagerDetailProps extends IBaseComponentProps {
	open: boolean;
	managerId?: string;
	onClose: (value: boolean) => void;
}

interface IManagerDetail {
	name?: string;
	username?: string;
	email?: string;
	lastLockedDate?: string;
	address?: string;
	status?: number;
}

function ManagerDetail(props: IManagerDetailProps) {
	const { open, onClose, managerId } = props;
	const navigate = useNavigate();
	const [data, setData] = useState<IManagerDetail>({});
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetch = async () => {
			setIsLoading(true);
			try {
				const res = await HttpService.get<IAPIResponse<any>>(`/managers/${managerId}`);
				if (res.code === 200) {
					setData({
						name: res.data.user.fullname,
						username: res.data.user.username,
						email: res.data.user.email,
						status: res.data.user.status,
						lastLockedDate: moment(res.data.user.lastLockedDate)
							.format("DD/MM/YYYY HH:mm:ss")
							.toString(),
						address: res.data.user.address,
					});
				} else if (res.code === 400) {
					Swal.fire({
						title: "Có lỗi xảy ra",
						text: "Có lỗi xảy ra trong quá trình tải dữ liệu, vui lòng thử lại sau!",
						icon: "error",
						confirmButtonText: "Đồng ý",
					});
				} else {
					throw new Error(`Unexpected code ${res.code}`);
				}
			} catch (err) {
				console.log(err);
				Swal.fire({
					title: "Có lỗi xảy ra",
					text: "Có lỗi xảy ra trong quá trình tải dữ liệu, vui lòng thử lại sau!",
					icon: "error",
					confirmButtonText: "Đồng ý",
				});
			}
			setIsLoading(false);
		};
		if (managerId !== undefined) {
			fetch();
		}
	}, [managerId]);

	const handleOnClose = () => {
		onClose(false);
	};

	const toTournamentList = () => {
		navigate(`/tournaments?q=${data.name}`);
	};

	return (
		<Dialog onClose={handleOnClose} open={open}>
			<DialogTitle>Thông tin quản lý</DialogTitle>
			{isLoading ? (
				<Box sx={{ minWidth: "450px" }}>
					<LinearProgress />
				</Box>
			) : (
				<DialogContent>
					<Box
						sx={{
							paddingTop: "10px",
							minWidth: "450px",
						}}
					>
						<Stack spacing={3}>
							<TextField
								label="Tên"
								variant="outlined"
								defaultValue={data.name}
								size="small"
								disabled
							/>
							<TextField
								label="Tên tài khoản"
								variant="outlined"
								defaultValue={data.username}
								size="small"
								disabled
							/>
							<TextField
								label="Email"
								variant="outlined"
								defaultValue={data.email}
								size="small"
								disabled
							/>
							<TextField
								label="Ngày khóa gần nhất"
								variant="outlined"
								defaultValue={data.lastLockedDate}
								size="small"
								disabled
							/>
							<TextField
								label="Địa chỉ"
								variant="outlined"
								defaultValue={data.address}
								size="small"
								disabled
							/>
							<FormControl>
								<FormLabel id="status-radio-button">Trạng thái</FormLabel>
								<RadioGroup
									row
									aria-labelledby="status-radio-button"
									name="row-radio-buttons-group"
									value={data.status}
								>
									<FormControlLabel
										value={1}
										control={<Radio />}
										label="Hoạt động"
										disabled
									/>
									<FormControlLabel
										value={0}
										control={<Radio />}
										label="Khóa"
										disabled
									/>
								</RadioGroup>
							</FormControl>
							<Divider></Divider>
							<Stack direction="row" spacing={3}>
								<Typography variant="subtitle1" color="black">
									Danh sách giải đấu đang quản lý:{" "}
								</Typography>
								<Button
									color="primary"
									variant="contained"
									size="small"
									onClick={toTournamentList}
									startIcon={<OpenInNewRoundedIcon fontSize="small" />}
								>
									Xem danh sách
								</Button>
							</Stack>
						</Stack>
					</Box>
				</DialogContent>
			)}
			<DialogActions>
				<Button color="primary" variant="contained" onClick={handleOnClose}>
					Đóng
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ManagerDetail;
