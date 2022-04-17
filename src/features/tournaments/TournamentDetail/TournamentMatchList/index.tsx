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
import { useState } from "react";
import { IBaseComponentProps } from "../../../../@types/ComponentInterfaces";
import MatchListItem, { MatchListItemType } from "./MatchListItem";

export interface ITournamentMatchListProps extends IBaseComponentProps {}

function TournamentMatchList(props: ITournamentMatchListProps) {
	const [totalRound, setTotalRound] = useState(30);
	const [searchString, setSearchString] = useState("");
	const [selectedRound, setSelectedRound] = useState("");
	const [data, setData] = useState<Array<MatchListItemType>>([
		{
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

	return (
		<Stack sx={{ height: "100%" }} spacing={1}>
			<Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
				<Stack spacing={2} sx={{ display: "flex", alignItems: "center" }} direction="row">
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
								<MenuItem key={index} value={index}>{`Vòng ${index + 1}`}</MenuItem>
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
					<MatchListItem key={index} data={item} />
				))}
			</Box>
		</Stack>
	);
}

export default TournamentMatchList;
