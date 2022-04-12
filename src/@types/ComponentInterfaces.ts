export interface MenuItemType {
	key?: number;
	className?: string;
	icon?: JSX.Element;
	path?: string;
	role: "all" | "admin" | "manager";
	label: string;
	subMenu?: Array<MenuItemType>;
}

export interface MenuType {
	menuList: Array<MenuItemType>;
	role: "admin" | "manager";
	direction?: string;
}

export interface SidebarType {
	role: "admin" | "manager";
	isOpen: boolean;
}

export interface DashboardType {
	type: "admin" | "manager";
	children?: any;
}

export interface PrivateRouteType {
	role: "admin" | "manager" | "all";
	path: string;
	element?: JSX.Element;
};
