import { IAPIResponse } from "../@types/AppInterfaces";
import { ILoginResponse, IUserLogin } from "../@types/AuthInterfaces";
import HttpService from "./HttpService";

export default class AuthService {
	static async postLoginAsync(data: IUserLogin) {
		return HttpService.post<IAPIResponse<ILoginResponse | string>>("/auth/login", data);
	}

	static setLocalData(data: ILoginResponse): void {
		this.removeLocalData();
		localStorage.setItem("token", JSON.stringify(data.token));
		localStorage.setItem("user", JSON.stringify(data.user));
	}

	static setLocalToken(data: any): void {
		localStorage.setItem("token", JSON.stringify(data));
	}

	static removeLocalData() {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
	}

	static getToken() {
		const infoToken = localStorage.getItem("token");
		if (!infoToken) {
			return null;
		}

		try {
			const token = JSON.parse(infoToken);
			return token;
		} catch (error) {
			return null;
		}
	}
}
