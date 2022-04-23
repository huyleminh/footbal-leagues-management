export interface IPlayerExcelModel {
	playerName: string;
	idNumber: string;
	country: string;
	stripNumber: number;
	position: string;
	type: number; // determine foreign player
}

export interface IPlayerExcelResult {
	data: Array<IPlayerExcelModel>;
	totalImported: number;
	totalError: number;
}

export enum STAFF_ROLE_ENUM {
	COACH,
	COACH_ASSISTANT,
	STAFF,
}

export interface IStaffExcelModel {
	fullname: string;
	country: string;
	role: STAFF_ROLE_ENUM;
}

export interface IStaffExcelResult {
	data: Array<IStaffExcelModel>;
	totalImported: number;
	totalError: number;
}
