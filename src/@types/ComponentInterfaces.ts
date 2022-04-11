export interface MenuItemType {
	key?: number;
	className?: string;
	icon?: JSX.Element;
	path?: string;
	label: string;
	subMenu?: Array<MenuItemType>;
}

export interface MenuType {
	menuList: Array<MenuItemType>;
	direction?: string;
}

export interface SidebarType {
	navigationList: Array<MenuItemType>;
	isOpen: boolean;
}

export interface DashboardType {
	navigationList: Array<MenuItemType>;
	userFullname?: string;
	children?: any;
}
