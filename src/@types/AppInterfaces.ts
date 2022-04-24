export interface IAPIBaseMetadata {
	createdDate: Date;
}

export interface IAPIResponse<T> {
	code: number;
	message?: string;
	data?: T;
	metadata: IAPIBaseMetadata;
}

export interface IAuthContext {
	role: string;
}

export interface IAPIPagination {
	page: number;
	pageSize: number;
	totalRecord: number;
}

export interface IAPIPagingMetadata extends IAPIBaseMetadata {
	pagination: IAPIPagination;
}
