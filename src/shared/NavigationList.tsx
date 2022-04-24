import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import HomeRounded from "@mui/icons-material/HomeRounded";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import { IMenuItemType } from "../@types/ComponentInterfaces";

export default class NavigationList {
	static get NAV_LIST(): Array<IMenuItemType> {
		return [
			{
				label: "Trang chủ",
				icon: <HomeRounded />,
				role: "all",
				path: "/",
			},
			{
				label: "Danh sách quản lý",
				icon: <GroupRoundedIcon />,
				role: "admin",
				path: "/managers",
			},
			{
				label: "Quản lý giải đấu",
				icon: <EmojiEventsRoundedIcon />,
				role: "all",
				subMenu: [
					{
						label: "Danh sách giải đấu",
						icon: <ListAltRoundedIcon />,
						role: "all",
						path: "/tournaments",
					},
					{
						label: "Tạo mới giải đấu",
						icon: <PlaylistAddRoundedIcon />,
						role: "manager",
						path: "/tournaments/create",
					},
				],
			},
		];
	}
}
