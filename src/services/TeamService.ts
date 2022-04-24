import { IAPIResponse } from "../@types/AppInterfaces";
import HttpService from "./HttpService";

export default class TeamService {
	static async postCreateTeamAsync(data: FormData) {
		return HttpService.post<IAPIResponse<any | string>>("/teams", data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}
}
