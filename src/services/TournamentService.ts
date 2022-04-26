import { IAPIResponse } from "../@types/AppInterfaces";
import HttpService from "./HttpService";

export default class TournamentService {
	static async getTournamentListAsync(query: string) {
		return HttpService.get<IAPIResponse<any | string>>(`/tournaments?${query}`);
	}

	static async deleteTournamentAsync(id: string) {
		return HttpService.delete<IAPIResponse<any | string>>(`/tournaments/${id}`);
	}

	static async changeStatusAsync(id: string, newStatus: number) {
		return HttpService.patch<IAPIResponse<any | string>>(`/tournaments/${id}/status`, {
			status: newStatus,
		});
	}
}
