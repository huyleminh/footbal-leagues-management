import HomeRounded from "@mui/icons-material/HomeRounded";
import { MenuItemType } from "../@types/ComponentInterfaces";

export default class NavigationList {
	static get NAV_LIST(): Array<MenuItemType> {
		return [
			{
				label: "Nav 1",
				icon: <HomeRounded />,
                role: "admin",
				path: "", // Should place the route after the pathname
			},
			{
				label: "Nav 4",
				icon: <HomeRounded />,
                role: "admin",
				subMenu: [
					{
						label: "Nav 5",
						icon: <HomeRounded />,
                        role: "admin",
						path: "/nav-5",
					},
					{
						label: "Nav 6",
						icon: <HomeRounded />,
                        role: "admin",
						path: "/nav-6",
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
