import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
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
	Tooltip,
	Typography,
} from "@mui/material";
import { toast } from "material-react-toastify";
import moment from "moment";
import QueryString from "query-string";
import React, { useEffect, useRef, useState } from "react";
import { IAPIBaseMetadata, IAPIResponse } from "../../../@types/AppInterfaces";
import { IBaseComponentProps } from "../../../@types/ComponentInterfaces";
import ActionMenu, {
	IActionList,
	IActionMenuItem,
} from "../../../components/actionmenu/ActionMenu";
import CustomPagination from "../../../components/pagination";
import ToastMsg from "../../../components/toast/ToastMsg";
import HttpService from "../../../services/HttpService";
import CreateManager from "../CreateManager";
import ManagerDetail from "../ManagerDetail";
import ResetManagerPassword from "../ResetManagerPassword";

export interface IManagerListProps extends IBaseComponentProps {}

export interface IManagerTableRow {
	id: string;
	name: string;
	username: string;
	email: string;
	status: number;
	lastLockedDate: string;
}

interface IPagination extends IAPIBaseMetadata {
	pagination: {
		page: number;
		pageSize: number;
		totalRecord: number;
	};
}

function ManagerList(props: IManagerListProps) {
	const [managerStatus, setManagerStatus] = useState("1");
	const [searchString, setSearchString] = useState("");
	const [openDetailModal, setOpenDetailModal] = useState(false);
	const [openResetPWModal, setOpenResetPWModal] = useState(false);
	const [openCreateModal, setOpenCreateModal] = useState(false);
	const [selectedManagerId, setSelectedManagerId] = useState<string | undefined>();
	const [selectedManagerName, setSelectedManagerName] = useState<string | undefined>();
	const [totalPage, setTotalPage] = useState(1);
	const [pagination, setPagination] = useState({
		page: 1,
		maxItem: 5,
	});
	const [isLoading, setIsLoading] = useState(false);

	const [data, setData] = useState<Array<IManagerTableRow>>([]);

	const selectRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		const fetch = async () => {
			const searchType = selectRef.current
				? (selectRef.current.childNodes[1] as HTMLInputElement).value
				: undefined;
			setIsLoading(true);
			try {
				const param = {
					page: pagination.page,
					limit: pagination.maxItem,
					status: managerStatus,
					searchType: searchString === "" ? undefined : searchType,
					query: searchString,
				};

				const res = await HttpService.get<IAPIResponse<Array<any> | string>>(
					`/managers?${QueryString.stringify(param)}`,
				);

				if (res.code === 200) {
					const data = res.data as any
					setData(
						data?.map((item: any) => {
							return {
								id: item._id,
								name: item.fullname,
								username: item.username,
								email: item.email,
								status: item.status,
								lastLockedDate: !item.lastLockedDate
									? "Không có"
									: moment(item.lastLockedDate)
											.format("DD/MM/YYYY HH:mm:ss")
											.toString(),
							} as IManagerTableRow;
						}) || [],
					);
					const metadata = res.metadata as IPagination;
					setTotalPage(Math.ceil(metadata.pagination.totalRecord / pagination.maxItem));
				} else if (res.code === 400) {
					toast(<ToastMsg title={res?.data as string} type="error" />, {
						type: toast.TYPE.ERROR,
					});
				} else {
					throw new Error("Unexpected http code.");
				}
			} catch (err) {
				console.log(err);
				toast(<ToastMsg title="Có lỗi xảy ra, vui lòng thử lại sau!" type="error" />, {
					type: toast.TYPE.ERROR,
				});
			}
			setIsLoading(false);
		};
		fetch();
	}, [managerStatus, pagination, searchString]);

	const handleOpenDetailModal = (item: IActionMenuItem) => {
		setSelectedManagerId(item.id);
		setOpenDetailModal(true);
	};

	const handleOpenResetPWModal = (item: IActionMenuItem) => {
		setSelectedManagerId(item.id);
		setSelectedManagerName(item.name);
		setOpenResetPWModal(true);
	};

	const handleCloseCreateModalWithResult = (reload: boolean) => {
		setOpenCreateModal(false);
		if (reload) {
			setPagination({
				...pagination,
			});
		}
	};

	const handleSearch = (e: React.SyntheticEvent) => {
		e.preventDefault();
		const target = e.target as typeof e.target & {
			searchString: {
				value: string;
			};
		};
		const string = target.searchString.value.trim();
		if (string === "") return;
		setSearchString(string);
		setPagination({
			...pagination,
			page: 1,
		});
	};

	const actionList: Array<IActionList> = [
		{
			title: "Xem chi tiết",
			icon: <OpenInNewRoundedIcon fontSize="small" />,
			action: handleOpenDetailModal,
		},
		{
			title: "Cấp lại mật khẩu",
			icon: <ChangeCircleIcon fontSize="small" />,
			action: handleOpenResetPWModal,
		},
	];

	return (
		<>
			<ManagerDetail
				open={openDetailModal}
				managerId={selectedManagerId}
				onClose={setOpenDetailModal}
			/>
			<ResetManagerPassword
				open={openResetPWModal}
				managerId={selectedManagerId}
				managerName={selectedManagerName}
				onClose={setOpenResetPWModal}
			/>
			<CreateManager open={openCreateModal} onClose={handleCloseCreateModalWithResult} />
			<Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
				<Stack spacing={2} sx={{ display: "flex", alignItems: "center" }} direction="row">
					<Tooltip title="Tạo mới">
						<Button
							color="primary"
							variant="contained"
							size="small"
							onClick={() => setOpenCreateModal(true)}
						>
							<AddRoundedIcon />
						</Button>
					</Tooltip>
					<Typography variant="h6">Lọc</Typography>

					<FormControl sx={{ m: 0, minWidth: 120 }} size="small">
						<InputLabel id="status">Trạng thái</InputLabel>
						<Select
							id="status"
							label="Trạng thái"
							label-id="status"
							value={managerStatus}
							onChange={(e) => {
								setManagerStatus(e.target.value);
								setPagination({
									...pagination,
									page: 1,
								});
							}}
						>
							<MenuItem value="1">Hoạt động</MenuItem>
							<MenuItem value="0">Bị khóa</MenuItem>
						</Select>
					</FormControl>
				</Stack>
				<form onSubmit={handleSearch}>
					<Stack spacing={2} direction="row">
						<FormControl sx={{ m: 0 }} size="small">
							<Select defaultValue={0} ref={selectRef}>
								<MenuItem value={0}>Tên quản lý</MenuItem>
								<MenuItem value={1}>Email</MenuItem>
							</Select>
						</FormControl>

						<TextField
							variant="outlined"
							placeholder="Nhập từ khóa"
							size="small"
							name="searchString"
						></TextField>

						<Button
							color="primary"
							variant="contained"
							size="small"
							startIcon={<SearchRoundedIcon />}
							type="submit"
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
							<TableCell align="left" sx={{ minWidth: "200px" }}>
								Tên
							</TableCell>
							<TableCell align="left">Tài khoản</TableCell>
							<TableCell align="left">Email</TableCell>
							<TableCell align="left">Trạng thái</TableCell>
							<TableCell align="left">Ngày khóa gần nhất</TableCell>
							<TableCell align="left" sx={{ minWidth: "150px", width: "150px" }}>
								Hành động
							</TableCell>
						</TableRow>
					</TableHead>
					{isLoading ? null : (
						<TableBody>
							{data.map((row, index) => (
								<TableRow
									key={index}
									sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
									hover
								>
									<TableCell component="th" scope="row" sx={{ width: "50px" }}>
										{index + 1 + (pagination.page - 1) * pagination.maxItem}
									</TableCell>
									<TableCell align="left" sx={{ width: "100px" }}>
										{row.name}
									</TableCell>
									<TableCell align="left">{row.username}</TableCell>
									<TableCell align="left">{row.email}</TableCell>
									<TableCell align="left">
										{row.status === 1 ? (
											<Chip label="Hoạt động" color="success" />
										) : (
											<Chip label="Bị khóa" color="error" />
										)}
									</TableCell>
									<TableCell align="left">{row.lastLockedDate}</TableCell>
									<TableCell
										align="left"
										sx={{ minWidth: "150px", width: "150px" }}
									>
										<ActionMenu
											item={{ id: row.id, name: row.name }}
											actionList={actionList}
										/>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					)}
				</Table>
			</TableContainer>

			<CustomPagination
				page={pagination.page}
				totalPage={totalPage}
				onChange={(value) =>
					setPagination({
						...pagination,
						page: value,
					})
				}
				allowChangeMax
				maxItem={pagination.maxItem}
				maxItemList={[5, 10, 15, 20, 25]}
				onChangeMaxItem={(value) =>
					setPagination({
						page: 1,
						maxItem: value,
					})
				}
				sx={{ mt: 3, display: "inline-flex", justifyContent: "flex-end", width: "100%" }}
			/>
		</>
	);
}

export default ManagerList;
