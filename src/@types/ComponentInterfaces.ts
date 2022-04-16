export interface IMenuItemType {
	key?: number;
	className?: string;
	icon?: JSX.Element;
	path?: string;
	role: "all" | "admin" | "manager";
	label: string;
	subMenu?: Array<IMenuItemType>;
}

export interface IMenuType {
	menuList: Array<IMenuItemType>;
	role: "admin" | "manager";
	direction?: string;
}

export interface ISidebarType {
	role: "admin" | "manager";
	isOpen: boolean;
}

export interface IDashboardType {
	type: "admin" | "manager";
}

export interface IPrivateRouteType {
	role: "admin" | "manager" | "all";
	showChecking?: boolean;
	element?: JSX.Element;
};

export interface IBaseComponentProps {
	userRole?: "admin" | "manager";
}
