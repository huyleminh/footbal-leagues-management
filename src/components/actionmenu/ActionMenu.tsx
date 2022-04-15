import { Button, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import { IBaseComponentProps } from "../../@types/ComponentInterfaces";
import React from "react";

export interface IActionList {
	title: string;
	action?: Function;
	icon: JSX.Element;
}

export interface IActionMenuProps extends IBaseComponentProps {
	id: string;
	actionList: Array<IActionList>;
}

function ActionMenu(props: IActionMenuProps) {
	// Action menu
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleItemClick = (item: IActionList) => {
		if (item.action) item.action(props.id);
		setAnchorEl(null);
	};

	return (
		<>
			<Button
				id="basic-button"
				aria-controls={open ? "basic-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				onClick={(event) => setAnchorEl(event.currentTarget)}
				variant="contained"
				startIcon={<SettingsOutlinedIcon fontSize="large" />}
				endIcon={<ArrowDropDownRoundedIcon fontSize="large" />}
				size="large"
				sx={{
					"&>span": { margin: "0!important" },
					padding: "0.5rem 1rem!important",
				}}
			></Button>
			<Menu
				id="basic-button"
				anchorEl={anchorEl}
				open={open}
				onClose={() => setAnchorEl(null)}
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}
			>
				{props.actionList.map((item: IActionList, index: any) => {
					return (
						<MenuItem
							key={index}
							onClick={() => handleItemClick(item)}
							sx={{ padding: "0.25rem 0.5rem" }}
						>
							<ListItemIcon>{item.icon}</ListItemIcon>
							<ListItemText sx={{ "&>span": { fontSize: "15px" } }}>
								{item.title}
							</ListItemText>
						</MenuItem>
					);
				})}
			</Menu>
		</>
	);
}

export default ActionMenu;