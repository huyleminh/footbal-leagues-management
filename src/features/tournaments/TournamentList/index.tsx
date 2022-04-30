import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
	Box,
	Button,
	Card,
	Chip,
	FormControl,
	InputLabel,
	LinearProgress,
	MenuItem,
	Select,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { toast } from "material-react-toastify";
import moment from "moment";
import * as queryString from "query-string";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { IAPIPagination, IAPIPagingMetadata } from "../../../@types/AppInterfaces";
import { IBaseComponentProps } from "../../../@types/ComponentInterfaces";
import ActionMenu, {
	IActionList,
	IActionMenuItem,
} from "../../../components/actionmenu/ActionMenu";
import CustomPagination from "../../../components/pagination";
import ToastMsg from "../../../components/toast/ToastMsg";
import AuthContext from "../../../contexts/AuthContext";
import TournamentService from "../../../services/TournamentService";
import ChangeStatusDialog, { IChangeStatusDialogData } from "./ChangeStatusDialog";

export interface ITournamentListProps extends IBaseComponentProps {}

export enum TOURNAMENT_SEARCH_TYPE_ENUM {
	NAME,
	MANAGER_NAME,
}

function TournamentList(props: ITournamentListProps) {
	const navigate = useNavigate();
	const authContext = useContext(AuthContext);
	const [pagination, setPagination] = useState<IAPIPagination>({
		page: 1,
		pageSize: 0,
		totalRecord: 0,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState([]);
	const [filter, setFilter] = useState(() => {
		const params = queryString.parse(window.location.search);
		return {
			page: 1,
			limit: 5,
			status: -1,
			query: params.q ? params.q : "",
			searchType: params.q
				? TOURNAMENT_SEARCH_TYPE_ENUM.MANAGER_NAME
				: TOURNAMENT_SEARCH_TYPE_ENUM.NAME,
			selfAssigned: false,
		};
	});

	const [searchType, setSearchType] = useState(`${filter.searchType}`);
	const [dialog, setDialog] = useState({
		open: false,
		loading: false,
		subtitle: "",
		previousStatus: -1,
		id: "",
	});

	const handleSubmitSearch = (e: React.SyntheticEvent) => {
		e.preventDefault();
		const target = e.target as typeof e.target & {
			query: {
				value: string;
			};
		};
		setFilter({
			...filter,
			page: 1,
			limit: 5,
			query: target.query.value.trim(),
			searchType: +searchType,
		});
	};

	const handleDelete = (item: any) => {
		if (item.totalTeam > 0) {
			toast(<ToastMsg title="Không thể xóa giải đã có đội tham dự" type="warning" />, {
				type: toast.TYPE.WARNING,
			});
			return;
		}

		Swal.fire({
			title: "Xóa giải đấu",
			text: "Bạn không thể khôi phục giải đã xóa",
			showCancelButton: true,
			confirmButtonText: "Xóa",
			cancelButtonText: "Hủy",
			showLoaderOnConfirm: true,
			icon: "warning",
			preConfirm: () => {
				TournamentService.deleteTournamentAsync(item._id)
					.then((response) => {
						if (response.code === 200) {
							toast(<ToastMsg title="Xóa thành công" type="success" />, {
								type: toast.TYPE.SUCCESS,
							});
						} else if (response.code === 400) {
							toast(<ToastMsg title={response.data as string} type="error" />, {
								type: toast.TYPE.ERROR,
							});
						} else throw new Error("unexpected_code");
					})
					.catch((error) => {
						console.log(error);
						toast(
							<ToastMsg title="Có lỗi xảy ra, vui lòng thử lại sau!" type="error" />,
							{
								type: toast.TYPE.ERROR,
							},
						);
					});
			},
			allowOutsideClick: () => !Swal.isLoading(),
		}).then((result) => {
			if (result.isConfirmed) {
				setTimeout(() => {
					navigate(0);
				}, 1500);
			}
		});
	};

	const handleChangeStatus = async (data: IChangeStatusDialogData) => {
		setDialog({ ...dialog, loading: true });
		try {
			const res = await TournamentService.changeStatusAsync(data.id, data.value);
			setDialog({ ...dialog, loading: false, open: false });

			if (res.code === 204) {
				toast(<ToastMsg title="Chuyển trạng thái thành công" type="success" />, {
					type: toast.TYPE.SUCCESS,
				});

				setTimeout(() => {
					navigate(0);
				}, 1500);
			} else if (res.code === 400) {
				toast(<ToastMsg title={res.data as string} type="error" />, {
					type: toast.TYPE.ERROR,
				});
			} else throw new Error("unexpected_code");
		} catch (error) {
			console.log(error);
			setDialog({ ...dialog, loading: false });
			toast(<ToastMsg title="Có lỗi xảy ra, vui lòng thử lại sau!" type="error" />, {
				type: toast.TYPE.ERROR,
			});
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const clone: Record<string, any> = { ...filter };
				clone.status === -1 && delete clone.status;
				clone.query === "" && delete clone.query;

				const res = await TournamentService.getTournamentListAsync(
					queryString.stringify(clone),
				);
				setIsLoading(false);

				if (res.code === 200) {
					const data = res.data as any;
					const metadata = res.metadata as IAPIPagingMetadata;
					setData(data);
					setPagination(metadata.pagination);
				} else if (res.code === 400) {
					toast(<ToastMsg title={res.data as string} type="error" />, {
						type: toast.TYPE.ERROR,
					});
				} else throw new Error("unexpected_code");
			} catch (error) {
				console.log(error);
				setIsLoading(false);
				toast(<ToastMsg title="Có lỗi xảy ra, vui lòng thử lại sau!" type="error" />, {
					type: toast.TYPE.ERROR,
				});
			}
		};
		fetchData();
	}, [filter]);

	const mappedData = data.map((item: any) => {
		return {
			_id: item._id,
			logoUrl: item.logoUrl,
			name: item.name,
			manager: item.manager[0].fullname,
			totalTeam: item.totalTeam,
			status: item.status,
			scheduledDate: moment(item.scheduledDate).format("DD/MM/YYYY HH:mm:ss "),
		};
	});

	const actionList: Array<IActionList> = [
		{
			title: "Xem chi tiết",
			icon: <OpenInNewRoundedIcon fontSize="small" />,
			action: (item: IActionMenuItem) => navigate(`./${item.id}`),
		},
		{
			title: "Chuyển trạng thái",
			icon: <AutorenewRoundedIcon fontSize="small" />,
			action: (item: IActionMenuItem) =>
				setDialog({
					...dialog,
					open: true,
					subtitle: item["name"],
					previousStatus: item["status"],
					id: item.id,
				}),
		},
		{
			title: "Xóa",
			icon: <DeleteRoundedIcon fontSize="small" />,
			action: (item: IActionMenuItem) => handleDelete(item),
			color: "#FF4842",
		},
	];

	return (
		<>
			<Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
				<Stack spacing={2} sx={{ display: "flex", alignItems: "center" }} direction="row">
					<Typography variant="h6">Lọc</Typography>

					<FormControl sx={{ m: 0, minWidth: 120 }} size="small">
						<InputLabel id="status">Trạng thái</InputLabel>
						<Select
							id="status"
							label="Trạng thái"
							label-id="status"
							onChange={(e) =>
								setFilter({ ...filter, status: parseInt(e.target.value as any) })
							}
							value={filter.status}
						>
							<MenuItem value={-1}>Tất cả</MenuItem>
							<MenuItem value={0}>Sắp diễn ra</MenuItem>
							<MenuItem value={1}>Đang diễn ra</MenuItem>
							<MenuItem value={2}>Sắp kết thúc</MenuItem>
							<MenuItem value={3}>Kết thúc</MenuItem>
						</Select>
					</FormControl>

					{authContext.role === "manager" && (
						<FormControl size="small">
							<FormControlLabel
								control={
									<Checkbox
										sx={{ padding: 0 }}
										checked={filter.selfAssigned}
										onChange={(event) =>
											setFilter({
												...filter,
												selfAssigned: event.target.checked,
											})
										}
									/>
								}
								label={
									<Typography sx={{ fontSize: "0.875rem" }}>
										Tôi quản lý
									</Typography>
								}
							/>
						</FormControl>
					)}
				</Stack>

				<form onSubmit={handleSubmitSearch}>
					<Stack spacing={2} direction="row">
						<FormControl sx={{ m: 0 }} size="small">
							<Select
								value={searchType}
								onChange={(e) => setSearchType(e.target.value)}
							>
								<MenuItem value={TOURNAMENT_SEARCH_TYPE_ENUM.NAME}>
									Tên giải đấu
								</MenuItem>
								<MenuItem value={TOURNAMENT_SEARCH_TYPE_ENUM.MANAGER_NAME}>
									Tên quản lý
								</MenuItem>
							</Select>
						</FormControl>
						<TextField
							variant="outlined"
							placeholder="Nhập từ khóa"
							size="small"
							name="query"
							defaultValue={filter.query}
						/>
						<Button
							color="primary"
							variant="contained"
							size="small"
							type="submit"
							startIcon={<SearchRoundedIcon />}
						>
							Tìm kiếm
						</Button>
					</Stack>
				</form>
			</Box>

			{isLoading ? (
				<Box sx={{ width: "100%" }}>
					<LinearProgress />
				</Box>
			) : null}

			<TableContainer component={Card}>
				<Table sx={{ minWidth: 650 }} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell align="left" sx={{ width: "50px", minWidth: "50px" }}>
								STT
							</TableCell>
							<TableCell align="left" sx={{}}>
								Logo
							</TableCell>
							<TableCell align="left">Tên giải</TableCell>
							<TableCell align="left">Người quản lý</TableCell>
							<TableCell align="left">Số đội tham gia</TableCell>
							<TableCell align="left">Ngày bắt đầu</TableCell>
							<TableCell align="left">Trạng thái</TableCell>
							<TableCell align="left" sx={{ minWidth: "150px", width: "150px" }}>
								Hành động
							</TableCell>
						</TableRow>
					</TableHead>
					{!isLoading && (
						<TableBody>
							{mappedData.map((row, index) => {
								return (
									<TableRow
										key={index}
										sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
										hover
									>
										<TableCell
											component="th"
											scope="row"
											sx={{ width: "50px" }}
										>
											{index +
												1 +
												(pagination.page - 1) * pagination.pageSize}
										</TableCell>
										<TableCell align="left" sx={{}}>
											<Box
												sx={{
													width: "80px",
													height: "80px",
													display: "flex",
													alignItems: "center",
												}}
											>
												<img
													src={row.logoUrl}
													alt="logoTournament"
													style={{ width: "100%", height: "auto" }}
												/>
											</Box>
										</TableCell>
										<TableCell align="left">{row.name}</TableCell>
										<TableCell align="left">{row.manager}</TableCell>
										<TableCell align="left">{row.totalTeam}</TableCell>
										<TableCell align="left">{row.scheduledDate}</TableCell>
										<TableCell align="left">{mapStatus(row.status)}</TableCell>
										<TableCell
											align="left"
											sx={{ minWidth: "150px", width: "150px" }}
										>
											<ActionMenu
												item={{ ...row, id: row._id }}
												actionList={actionList}
											/>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					)}
				</Table>
				{mappedData.length === 0 && (
					<Typography
						variant="h6"
						sx={{
							textAlign: "center",
							width: "100%",
							fontSize: "0.875rem",
							padding: "1rem",
						}}
					>
						Không có dữ liệu phù hợp
					</Typography>
				)}
			</TableContainer>

			<CustomPagination
				page={pagination.page}
				totalPage={
					pagination.totalRecord !== undefined
						? Math.ceil(pagination.totalRecord / filter.limit)
						: 0
				}
				onChange={(value) => setFilter({ ...filter, page: value })}
				allowChangeMax
				maxItem={filter.limit}
				maxItemList={[5, 10, 15, 20, 25]}
				onChangeMaxItem={(value) => setFilter({ ...filter, limit: value })}
				sx={{ mt: 3, display: "inline-flex", justifyContent: "flex-end", width: "100%" }}
			/>

			<ChangeStatusDialog
				open={dialog.open}
				loading={dialog.loading}
				onCancel={() => setDialog({ ...dialog, open: false, loading: false })}
				onSubmit={handleChangeStatus}
				subtitle={dialog.subtitle}
				previousStatus={mapStatus(dialog.previousStatus)}
				id={dialog.id}
			/>
		</>
	);
}

export default TournamentList;

function mapStatus(status: number): JSX.Element {
	switch (status) {
		case 0:
			return <Chip label="Sắp diễn ra" color="info" />;
		case 1:
			return <Chip label="Đang diễn ra" color="success" />;
		case 2:
			return <Chip label="Sắp kết thúc" color="warning" />;
		case 3:
			return <Chip label="Kết thúc" color="error" />;
		default:
			return <Chip label="Không xác định" color="default" />;
	}
}
