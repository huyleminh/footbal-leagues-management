import * as mongoose from "mongoose";
import { IAPIPaginationMetadata, IAppRequest, IAppResponse } from "../../@types/AppBase";
import AuthMiddlewares from "../../middlewares/AuthMiddlewares";
import DiskUploadMiddleware from "../../middlewares/MulterUploadMiddlewares";
import TeamMiddlewares from "../../middlewares/TeamMiddlewares";
import PlayerModel from "../../models/PlayerModel";
import TeamModel from "../../models/TeamModel";
import TournamentModel from "../../models/TournamentModel";
import TournamentParticipantModel from "../../models/TournamentParticipantModel";
import ImgBBService from "../../services/ImgBBService";
import AppResponse from "../../shared/AppResponse";
import { Logger } from "../../utils/Logger";
import AppController from "../AppController";

export default class TeamController extends AppController {
	constructor() {
		super();
	}

	init(): void {
		this._router.get("/teams/:id", this.getTeamDetailByIdAsync);
		this._router.get("/teams", [TeamMiddlewares.validateGetParams], this.getTeamListAsync);

		this._router.post(
			"/teams",
			[
				AuthMiddlewares.verifyManagerRole,
				DiskUploadMiddleware.single("logo"),
				TeamMiddlewares.validateCreateTeamData,
			],
			this.postCreateTeamAsync,
		);
	}

	async getTeamListAsync(req: IAppRequest, res: IAppResponse) {
		const apiRes = new AppResponse(res);
		const {
			payload: { page, limit, tournamentId },
		} = res.locals;
		try {
			let resultSet;
			let totalRecord = 0;

			if (tournamentId === undefined) {
				resultSet = await TeamModel.find()
					.select(["-__v", "-players", "-teamStaff"])
					.limit(limit)
					.skip(limit * (page - 1))
					.exec();
				totalRecord = await TeamModel.countDocuments().exec();
			} else {
				const participant = await TournamentParticipantModel.findOne({
					tournamentId,
				}).exec();
				if (participant === null) {
					return apiRes
						.code(400)
						.message("Bad Request")
						.data("Không tìm thấy giải đấu")
						.send();
				}
				const idList = participant.teams.map((item) => item.teamId);
				resultSet = await TeamModel.find({ _id: { $in: idList } })
					.select(["-__v", "-players", "-teamStaff"])
					.limit(limit)
					.skip(limit * (page - 1))
					.exec();
				totalRecord = await TeamModel.find({ _id: { $in: idList } })
					.countDocuments()
					.exec();
			}

			const metadata: IAPIPaginationMetadata = {
				createdDate: new Date(),
				pagination: {
					page: page,
					pageSize: resultSet.length,
					totalRecord,
				},
			};
			apiRes.data(resultSet).metadata(metadata).send();
		} catch (error) {
			Logger.error({
				message: {
					class: "TeamController",
					method: "getTeamListAsync",
					msg: error.message,
				},
			});
			apiRes.code(400).message("Bad Request").data("Không thể lấy danh sách đội bóng").send();
		}
	}

	async postCreateTeamAsync(req: IAppRequest, res: IAppResponse) {
		const apiRes = new AppResponse(res);
		if (!req.file) {
			return apiRes.code(400).message("Bad Request").data("Thiếu logo đội bóng").send();
		}
		const {
			payload: { tournamentId, name, playerList, staffList, coachName, totalForeign },
		} = res.locals;

		try {
			// Load tournament config
			const tournament = await TournamentModel.findById(tournamentId).exec();
			if (tournament === null) {
				return apiRes.code(400).message("Bad Request").data("Giải đấu không hợp lệ").send();
			}

			// Check max team
			const participant = await TournamentParticipantModel.findOne({ tournamentId });
			if (participant !== null && participant.teams.length >= tournament.config.maxTeam) {
				return apiRes
					.code(400)
					.message("Bad Request")
					.data("Số đội bóng đã đạt giới hạn")
					.send();
			}

			// Check max abroad players
			if (totalForeign > tournament.config.maxAbroardPlayer) {
				return apiRes
					.code(400)
					.message("Bad Request")
					.data("Số ngoại binh vượt quá giới hạn")
					.send();
			}

			const tempCode = new mongoose.Types.ObjectId(32);
			const playerInserted = await PlayerModel.insertMany(
				playerList.map((player) => {
					return {
						...player,
						teamId: tempCode,
					};
				}),
			);
			const playerIdList = playerInserted.map((player) => player._id);

			const logo = await ImgBBService.uploadImageNoExpireAsync(req.file.path);
			const team = await TeamModel.create({
				name,
				logo,
				coachName,
				teamStaff: staffList,
				totalMember: staffList.length + playerInserted.length,
				players: playerIdList,
			});

			// Update teamId in player
			await PlayerModel.updateMany({ teamId: tempCode }, { teamId: team._id }).exec();
			if (participant === null) {
				await TournamentParticipantModel.create({
					tournamentId,
					teams: [{ teamId: team._id, participatedAt: new Date() }],
				});
			} else {
				await TournamentParticipantModel.findByIdAndUpdate(participant._id, {
					teams: [...participant.teams, { teamId: team._id, participatedAt: new Date() }],
				});
			}

			// Update totalTeams in tournament
			await TournamentModel.findByIdAndUpdate(tournamentId, {
				totalTeam: participant === null ? 1 : participant.teams.length + 1,
			}).exec();

			apiRes.code(201).message("Created").send();
		} catch (error) {
			Logger.error({
				message: {
					class: "TeamController",
					method: "postCreateTeamAsync",
					msg: error.message,
				},
			});
			apiRes.code(400).message("Bad Request").data("Không thể tạo mới đội bóng").send();
		}
	}

	async getTeamDetailByIdAsync(req: IAppRequest, res: IAppResponse) {
		const { id } = req.params;
		const apiRes = new AppResponse(res);

		try {
			const teamPromise = TeamModel.findById(id).select(["-__v", "-players"]).exec();
			const playerPromise = PlayerModel.find({ teamId: id })
				.select(["-__v", "-teamId"])
				.exec();
			const [team, playerList] = await Promise.all([teamPromise, playerPromise]);
			if (!team || !playerList) {
				throw new Error("get_team_detail_failed");
			}
			apiRes.data({ team, playerList }).send();
		} catch (error) {
			Logger.error({
				message: {
					class: "TeamController",
					method: "getTeamDetailByIdAsync",
					msg: error.message,
				},
			});
			apiRes.code(400).message("Bad Request").data("Không thể lấy chi tiết đội bóng").send();
		}
	}
}
