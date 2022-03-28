import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import AppConfigs from "../shared/AppConfigs";

export const axiosInstance = axios.create({
	baseURL: AppConfigs.API_URL,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
	function (config) {
		// Do something before request is sent
		return config;
	},
	function (error: AxiosError) {
		// Do something with request error
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

	public static async delete<T>(path: string, extraConfig: AxiosRequestConfig): Promise<T> {
		return this.handleAPIResponse(await axiosInstance.delete<T>(path, extraConfig));
	}

	public static async put<T>(
		path: string,
		payload: any,
		extraConfig: AxiosRequestConfig,
	): Promise<T> {
		return this.handleAPIResponse(await axiosInstance.put<T>(path, payload, extraConfig));
	}

	public static async patch<T>(
		path: string,
		payload: any,
		extraConfig: AxiosRequestConfig,
	): Promise<T> {
		return this.handleAPIResponse(await axiosInstance.patch<T>(path, payload, extraConfig));
	}

	private static handleAPIResponse(response: AxiosResponse<any>) {
		if (response.status === 200) {
			return response.data;
		}

		return response;
	}
}
