import { Stack } from "@mui/material";
import { IMenuType } from "../../@types/ComponentInterfaces";
import MenuItem from "./MenuItem";

function Menu(props: IMenuType) {
	const { menuList, role } = props;

	const renderSubmenu = (submenu: any) => {
		if (!submenu) return undefined;
		return submenu.filter((item: any) => (item.role === "all" || item.role === role) && item);
	};

	const renderMenu = () => {
		return menuList.map((nav, index) => {
			if (nav.role === "all" || nav.role === role) {
				return (
					<MenuItem
						key={index}
						label={nav.label}
						icon={nav.icon}
						role={nav.role}
						path={nav.path}
						subMenu={renderSubmenu(nav.subMenu)}
					/>
				);
			}
			return null;
		});
	};

	return (
		<Stack
			sx={{
				flexGrow: "1",
			}}
		>
			{renderMenu().map((item) => item)}
		</Stack>
	);
}

export default Menu;
