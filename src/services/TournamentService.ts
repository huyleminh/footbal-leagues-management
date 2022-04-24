import { IAPIResponse } from "../@types/AppInterfaces";
import HttpService from "./HttpService";

export default class TournamentService {
	static async getTournamentListAsync(query: string) {
		return HttpService.get<IAPIResponse<any | string>>(`/tournaments?${query}`);
	}
}
