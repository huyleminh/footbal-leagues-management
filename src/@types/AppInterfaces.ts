export interface IAPIBaseMetadata {
	createdDate: Date;
}

export interface IAPIResponse<T> {
	code: number;
	message?: string;
	data?: T;
	metadata: IAPIBaseMetadata;
}
