export interface IUserLogin {
	username: string;
	password: string;
}

export interface ILoginResponse {
	token: {
		accessToken: string;
		refreshToken: string;
		idToken: string;
		expireIn: number;
		expireAt: string;
	};
	user: {
		fullname: string;
	};
}
