import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
	Box,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { IBaseComponentProps } from "../../../../../@types/ComponentInterfaces";
import AuthContext from "../../../../../contexts/AuthContext";
import ViewMatchDetail from "../MatchDetail/ViewMatchDetail";
import MatchListItem, { MatchListItemType } from "./MatchListItem";

export interface IMatchListProps extends IBaseComponentProps {}

function MatchList(props: IMatchListProps) {
	const [totalRound, setTotalRound] = useState(30);
	const [searchString, setSearchString] = useState("");
	const [selectedRound, setSelectedRound] = useState("");
	const context = useContext(AuthContext);
	const [openDetailModal, setOpenDetailModal] = useState(false);
	const [targetMatchId, setTargetMatchId] = useState("");

	const [data, setData] = useState<Array<MatchListItemType>>([
		{
			id: "1",
			round: "1",
			homeTeam: {
				name: "Manchester City",
				point: 4,
				logo: "https://upload.wikimedia.org/wikipedia/vi/thumb/1/1d/Manchester_City_FC_logo.svg/1200px-Manchester_City_FC_logo.svg.png",
			},
			awayTeam: {
				name: "Manchester United",
				point: 1,
				logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png",
			},
			stadium: "City of Manchester Stadium",
		},
		{
			id: "2",
			round: "1",
			homeTeam: {
				name: "Manchester City",
				point: 4,
				logo: "https://upload.wikimedia.org/wikipedia/vi/thumb/1/1d/Manchester_City_FC_logo.svg/1200px-Manchester_City_FC_logo.svg.png",
			},
			awayTeam: {
				name: "Manchester United",
				point: 1,
				logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png",
			},
			stadium: "City of Manchester Stadium",
		},
		{
			id: "3",
			round: "1",
			homeTeam: {
				name: "Manchester City",
				point: 4,
				logo: "https://upload.wikimedia.org/wikipedia/vi/thumb/1/1d/Manchester_City_FC_logo.svg/1200px-Manchester_City_FC_logo.svg.png",
			},
			awayTeam: {
				name: "Manchester United",
				point: 1,
				logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png",
			},
			stadium: "City of Manchester Stadium",
		},
	]);

	const handleItemClick = (id: string) => {
		setTargetMatchId(id)
		setOpenDetailModal(true)
	}

	return (
		<>
			<ViewMatchDetail
				open={openDetailModal}
				matchId={targetMatchId}
				onClose={setOpenDetailModal}
			/>
			<Stack sx={{ height: "100%" }} spacing={1}>
				<Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
					<Stack
						spacing={2}
						sx={{ display: "flex", alignItems: "center" }}
						direction="row"
					>
						{context.role === "manager" ? (
							<Tooltip title="Tạo mới">
								<Button
									color="primary"
									variant="contained"
									size="small"
									// onClick={() => setOpenCreateModal(true)}
								>
									<AddRoundedIcon />
								</Button>
							</Tooltip>
						) : null}
						<Typography variant="h6">Lọc</Typography>

						<FormControl sx={{ m: 0, minWidth: 120 }} size="small">
							<InputLabel id="round">Vòng đấu</InputLabel>
							<Select
								id="roundSelect"
								label="Vòng đấu"
								labelId="round"
								value={selectedRound}
								onChange={(e) => {
									setSelectedRound(e.target.value);
								}}
							>
								{[...Array(totalRound)].map((item, index) => (
									<MenuItem key={index} value={index}>{`Vòng ${
										index + 1
									}`}</MenuItem>
								))}
							</Select>
						</FormControl>
					</Stack>
					<form>
						<Stack spacing={2} direction="row">
							<TextField
								variant="outlined"
								placeholder="Nhập tên đội bóng"
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
				<Box
					sx={{
						height: "53vh",
						overflow: "auto",
					}}
				>
					{data.map((item, index) => (
						<MatchListItem key={index} data={item} onClick={handleItemClick}/>
					))}
				</Box>
			</Stack>
		</>
	);
}

export default MatchList;