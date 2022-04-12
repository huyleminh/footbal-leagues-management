import { Stack } from "@mui/material";
import { MenuType } from "../../@types/ComponentInterfaces";
import MenuItem from "./MenuItem";

function Menu(props: MenuType) {
	const { menuList, role } = props;

	return (
		<Stack
			sx={{
				flexGrow: "1",
			}}
		>
			{menuList.map((nav, index) => {
				if (nav.role === "all" || nav.role === role) {
					return (
						<MenuItem
							key={index}
							label={nav.label}
							icon={nav.icon}
							role={nav.role}
							path={nav.path}
							subMenu={nav.subMenu ? nav.subMenu : undefined}
						/>
					)
				}
				return null
			})}
		</Stack>
	);
}

export default Menu;
