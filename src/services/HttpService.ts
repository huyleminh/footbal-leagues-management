import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import AppConfigs from "../shared/AppConfigs";
import AuthService from "./AuthService";

export const axiosInstance = axios.create({
	baseURL: AppConfigs.API_URL,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
	function (config) {
		// Do something before request is sent
		if (config.url?.match("/refresh")) {
			return config;
		}
		let cloneConfig = { ...config };
		const token = AuthService.getToken();
		if (token && token.accessToken) {
			cloneConfig.headers = {
				Authorization: `Bearer ${token.accessToken}`,
			};
		}
		return cloneConfig;
	},
	function (error: AxiosError) {
		// Do something with request error
		return Promise.reject(error);
	},
);

axiosInstance.interceptors.response.use(
	function (response) {
		return response;
	},
	function (error) {
		return Promise.reject(error);
	},
);

export default class HttpService {
	public static async get<T>(path: string, extraConfig?: AxiosRequestConfig): Promise<T> {
		return this.handleAPIResponse(await axiosInstance.get<T>(path, extraConfig));
	}

	public static async post<T>(
		path: string,
		payload: any,
		extraConfig?: AxiosRequestConfig,
	): Promise<T> {
		return this.handleAPIResponse(await axiosInstance.post<T>(path, payload, extraConfig));
	}

	public static async delete<T>(path: string, extraConfig?: AxiosRequestConfig): Promise<T> {
		return this.handleAPIResponse(await axiosInstance.delete<T>(path, extraConfig));
	}

	public static async put<T>(
		path: string,
		payload: any,
		extraConfig?: AxiosRequestConfig,
	): Promise<T> {
		return this.handleAPIResponse(await axiosInstance.put<T>(path, payload, extraConfig));
	}

	public static async patch<T>(
		path: string,
		payload: any,
		extraConfig?: AxiosRequestConfig,
	): Promise<T> {
		return this.handleAPIResponse(await axiosInstance.patch<T>(path, payload, extraConfig));
	}

	private static handleAPIResponse(response: AxiosResponse<any>): any {
		if (response.status !== 200) {
			return response;
		}

		const resData = response.data;
		if (resData.code === 401 && resData.data === "Token expired") {
			const token = AuthService.getToken();
			if (!token || !token.idToken || !token.refreshToken) {
				resData.data = {};
				return resData;
			}

			const config = response.config;
			return axiosInstance
				.post(
					"/auth/refresh",
					{ refreshToken: token.refreshToken },
					{
						headers: {
							Authorization: `Bearer ${token.idToken}`,
						},
					},
				)
				.then((res) => {
					if (res.status !== 200) {
						return res;
					}

					if (res.data.code === 200) {
						const token = res.data.data;
						AuthService.setLocalToken(token);
						config.headers = {
							Authorization: `Bearer ${token.accessToken}`,
						};
						return axiosInstance.request(config).then(this.handleAPIResponse);
					}
					return res.data;
				});
		}
		return resData;
	}

	private static handleRefreshToken() {}
}
