import { Stack } from "@mui/material";
import { MenuType } from "../../@types/ComponentInterfaces";
import MenuItem from "./MenuItem";

function Menu(props: MenuType) {
	const { menuList } = props;

	return (
		<Stack
			sx={{
				flexGrow: "1",
			}}
		>
			{menuList.map((nav, index) => (
				<MenuItem
					key={index}
					label={nav.label}
					icon={nav.icon}
					path={nav.path}
					subMenu={nav.subMenu ? nav.subMenu : undefined}
				/>
			))}
		</Stack>
	);
}

export default Menu;
