import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import HomeRounded from "@mui/icons-material/HomeRounded";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
import { MenuItemType } from "../@types/ComponentInterfaces";

export default class NavigationList {
	static get NAV_LIST(): Array<MenuItemType> {
		return [
			{
				label: "Trang chủ",
				icon: <HomeRounded />,
				role: "all",
				path: "/", // Should place the route after the pathname
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
			{
				label: "Nav 10",
				icon: <HomeRounded />,
				role: "manager",
				path: "", // Should place the route after the pathname
			},
			{
				label: "Nav 15",
				icon: <HomeRounded />,
				role: "all",
				path: "/nav-15", // Should place the route after the pathname
			},
			{
				label: "Nav 11",
				icon: <HomeRounded />,
				role: "manager",
				subMenu: [
					{
						label: "Nav 12",
						icon: <HomeRounded />,
						role: "manager",
						path: "/nav-12",
					},
					{
						label: "Nav 13",
						icon: <HomeRounded />,
						role: "manager",
						path: "/nav-13",
					},
				],
			},
		];
	}
}
