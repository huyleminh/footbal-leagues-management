import * as mongoose from "mongoose";
import { IAppRequest, IAppResponse } from "../../@types/AppBase";
import AuthMiddlewares from "../../middlewares/AuthMiddlewares";
import PlayerMiddlewares from "../../middlewares/PlayerMiddlewares";
import PlayerModel from "../../models/PlayerModel";
import TeamModel from "../../models/TeamModel";
import TournamentModel from "../../models/TournamentModel";
import TournamentParticipantModel from "../../models/TournamentParticipantModel";
import AppResponse from "../../shared/AppResponse";
import { Logger } from "../../utils/Logger";
import AppController from "../AppController";

export default class PlayerController extends AppController {
	constructor() {
		super();
	}
	init(): void {
		this._router.post(
			"/players",
			[AuthMiddlewares.verifyManagerRole, PlayerMiddlewares.validateCreatePlayerData],
			this.postCreatePlayerAsync,
		);
		this._router.put(
			"/players/:id/replace",
			[AuthMiddlewares.verifyManagerRole, PlayerMiddlewares.validateCreatePlayerData],
			this.putReplacePlayerAsync,
		);
	}

	async postCreatePlayerAsync(req: IAppRequest, res: IAppResponse) {
		const {
			payload: { playerName, teamId, idNumber, country, stripNumber, position, type },
		} = res.locals;
		const apiRes = new AppResponse(res);

		try {
			// Check config
			const participant = await TournamentParticipantModel.findOne({
				teams: { $elemMatch: { teamId: new mongoose.Types.ObjectId(teamId) } },
			}).exec();
			if (participant === null) {
				throw new Error("tournament_team_notfound");
			}

			const tournament = await TournamentModel.findById(participant.tournamentId).exec();
			if (tournament === null) {
				throw new Error("tournament_notfound");
			}

			const joinedTeam = participant.teams.find((team) => team.teamId.toString() === teamId);
			if (joinedTeam.usedConfig.addedPlayer === tournament.config.maxAdditionalPlayer) {
				return apiRes
					.code(400)
					.message("Bad Request")
					.data("Lượng cầu thủ thêm mới đã đạt giới hạn");
			}

			if (
				type === 1 &&
				joinedTeam.usedConfig.abroadPlayer === tournament.config.maxAbroardPlayer
			) {
				return apiRes
					.code(400)
					.message("Bad Request")
					.data("Lượng ngoại binh đã đạt giới hạn");
			}

			const playerInserted = await PlayerModel.create({
				teamId,
				playerName,
				idNumber,
				country,
				stripNumber,
				position,
			});

			await TeamModel.updateOne({ _id: teamId }, [
				{ $set: { totalMember: { $add: ["$totalMember", 1] } } },
				{ $set: { players: { $concatArrays: ["$players", [playerInserted._id]] } } },
			]).exec();

			++joinedTeam.usedConfig.addedPlayer;
			type === 1 && ++joinedTeam.usedConfig.abroadPlayer;
			await TournamentParticipantModel.findByIdAndUpdate(participant._id, participant);

			apiRes.code(201).message("Created").send();
		} catch (error) {
			Logger.error({
				message: {
					class: "PlayerController",
					method: "postCreatePlayerAsync",
					msg: error.message,
				},
			});
			apiRes.code(400).message("Bad Request").data("Không thể tạo mới cầu thủ").send();
		}
	}

	async putReplacePlayerAsync(req: IAppRequest, res: IAppResponse) {
		const {
			payload: { playerName, teamId, idNumber, country, stripNumber, position, type },
		} = res.locals;
		const { id } = req.params;
		const apiRes = new AppResponse(res);

		try {
			// Check config
			const participant = await TournamentParticipantModel.findOne({
				teams: { $elemMatch: { teamId: new mongoose.Types.ObjectId(teamId) } },
			}).exec();
			if (participant === null) {
				throw new Error("tournament_team_notfound");
			}

			const tournament = await TournamentModel.findById(participant.tournamentId).exec();
			if (tournament === null) {
				throw new Error("tournament_notfound");
			}

			const joinedTeam = participant.teams.find((team) => team.teamId.toString() === teamId);
			if (joinedTeam.usedConfig.changedPlayer === tournament.config.maxChangingPlayer) {
				return apiRes
					.code(400)
					.message("Bad Request")
					.data("Lượng cầu thủ thay thế đã đạt giới hạn");
			}

			if (
				type === 1 &&
				joinedTeam.usedConfig.abroadPlayer === tournament.config.maxAbroardPlayer
			) {
				return apiRes
					.code(400)
					.message("Bad Request")
					.data("Lượng ngoại binh đã đạt giới hạn");
			}

			const playerInserted = await PlayerModel.create({
				teamId,
				playerName,
				idNumber,
				country,
				stripNumber,
				position,
			});

			await Promise.all([
				TeamModel.findByIdAndUpdate(teamId, {
					$pull: { players: { $in: [new mongoose.Types.ObjectId(id)] } },
				}).exec(),
				TeamModel.updateOne({ _id: teamId }, [
					{ $set: { players: { $concatArrays: ["$players", [playerInserted._id]] } } },
				]).exec(),
			]);

			++joinedTeam.usedConfig.changedPlayer;
			type === 1 && ++joinedTeam.usedConfig.abroadPlayer;
			await TournamentParticipantModel.findByIdAndUpdate(participant._id, participant);

			apiRes.code(201).message("Created").send();
		} catch (error) {
			Logger.error({
				message: {
					class: "PlayerController",
					method: "putReplacePlayerAsync",
					msg: error.message,
				},
			});
			console.log(error);
			apiRes.code(400).message("Bad Request").data("Không thể thay thế cầu thủ").send();
		}
	}
}
