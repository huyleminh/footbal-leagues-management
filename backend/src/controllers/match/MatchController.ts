import { IAPIMetadata, IAppRequest, IAppResponse } from "../../@types/AppBase";
import AuthMiddlewares from "../../middlewares/AuthMiddlewares";
import MatchMiddlewares from "../../middlewares/MatchMiddlewares";
import MatchModel, { MATCH_COMPETITOR_ENUM } from "../../models/MatchModel";
import AppResponse from "../../shared/AppResponse";
import AppController from "../AppController";
import * as mongoose from "mongoose";
import TournamentModel from "../../models/TournamentModel";

export default class MatchController extends AppController {
	constructor() {
		super("MatchController");
	}

	binding(): void {
		this.getMatchListAsync = this.getMatchListAsync.bind(this);
		this.postCreateMatchAsync = this.postCreateMatchAsync.bind(this);
	}

	init(): void {
		this._router.get("/matches", [MatchMiddlewares.validateGetParams], this.getMatchListAsync);
		this._router.post(
			"/matches",
			[AuthMiddlewares.verifyManagerRole, MatchMiddlewares.validateCreateMatchData],
			this.postCreateMatchAsync,
		);
	}

	async getMatchListAsync(req: IAppRequest, res: IAppResponse) {
		const apiRes = new AppResponse(res);
		const {
			payload: { round, tournamentId },
		} = res.locals;

		try {
			const tournament = await TournamentModel.findById(tournamentId).exec();
			if (tournament === null) throw new Error("tournament_notfound");

			const { totalTeam } = tournament;
			const totalMatch = (totalTeam * (totalTeam - 1)) / 2;
			const matchPerRound = totalTeam / 2;
			const totalRound = totalMatch / matchPerRound;

			const pipeline: Array<any> = [
				{
					$lookup: {
						from: "teams",
						localField: "competitors.teamId",
						foreignField: "_id",
						as: "teamInfo",
					},
				},
				{
					$match: { round, tournamentId: new mongoose.Types.ObjectId(tournamentId) },
				},
				{
					$project: {
						_id: 1,
						scheduledDate: 1,
						stadiumName: 1,
						round: 1,
						competitors: { teamId: 1, teamType: 1, isWinner: 1, goal: 1 },
						teamInfo: { name: 1, logo: 1, _id: 1 },
					},
				},
			];
			const matchList = await MatchModel.aggregate(pipeline).exec();
			const mapped = matchList.map((match) => {
				return {
					_id: match._id,
					scheduledDate: match.scheduledDate,
					stadiumName: match.stadiumName,
					round: match.round,
					competitors: [
						{
							teamId: match.competitors[0].teamId,
							teamType: match.competitors[0].teamType,
							isWinner: match.competitors[0].isWinner,
							name: match.teamInfo[0].name,
							logo: match.teamInfo[0].logo,
						},
						{
							teamId: match.competitors[1].teamId,
							teamType: match.competitors[1].teamType,
							isWinner: match.competitors[1].isWinner,
							name: match.teamInfo[1].name,
							logo: match.teamInfo[1].logo,
						},
					],
				};
			});

			const metadata = {
				createdDate: new Date(),
				totalRound,
				round,
			};
			apiRes.data(mapped).metadata(metadata).send();
		} catch (error) {
			this._errorHandler.handle(error.message);
			apiRes.code(400).data("Không thể lấy danh sách trận đấu").send();
		}
	}

	async postCreateMatchAsync(req: IAppRequest, res: IAppResponse) {
		const {
			payload: { homeId, awayId, stadiumName, scheduledDate, round, tournamentId },
		} = res.locals;
		const apiRes = new AppResponse(res);

		try {
			const tournament = await TournamentModel.findById(tournamentId).exec();
			if (tournament === null) {
				throw new Error("tournament_notfound");
			}
			// Check whether each team played in current match or not
			const matchOfRound = await MatchModel.find({ round: round }).exec();

			for (let match of matchOfRound) {
				const competitors = match.competitors;
				if (competitors[0].teamId.equals(homeId) || competitors[1].teamId.equals(homeId)) {
					return apiRes
						.code(400)
						.data("Đội nhà đã tham gia thi đấu trong vòng này")
						.send();
				}

				if (competitors[0].teamId.equals(awayId) || competitors[1].teamId.equals(awayId)) {
					return apiRes
						.code(400)
						.data("Đội khách đã tham gia thi đấu trong vòng này")
						.send();
				}
			}

			// Check if two team have met before or not
			const pairMatch = await MatchModel.find({
				competitors: {
					$all: [
						{ $elemMatch: { teamId: new mongoose.Types.ObjectId(homeId) } },
						{ $elemMatch: { teamId: new mongoose.Types.ObjectId(awayId) } },
					],
				},
			}).exec();

			if (pairMatch.length === 1) {
				const competitors = pairMatch[0].competitors;
				let isValid = true;
				for (let competitor of competitors) {
					if (
						(competitor.teamType === MATCH_COMPETITOR_ENUM.HOME &&
							competitor.teamId.equals(homeId)) ||
						(competitor.teamType === MATCH_COMPETITOR_ENUM.AWAY &&
							competitor.teamId.equals(awayId))
					) {
						isValid = false;
					}
				}

				if (!isValid) {
					return apiRes
						.code(400)
						.data("Cặp đấu này đã tồn tại, phải đổi vai trò cho nhau")
						.send();
				}
			}

			if (pairMatch.length === 2) {
				return apiRes.code(400).data("Cả 2 đội đã gặp nhau đủ số lần trong mùa này").send();
			}

			await MatchModel.create({
				tournamentId: tournament._id,
				scheduledDate,
				stadiumName,
				round,
				competitors: [
					{ teamId: homeId, teamType: MATCH_COMPETITOR_ENUM.HOME, isWinner: false },
					{ teamId: awayId, teamType: MATCH_COMPETITOR_ENUM.AWAY, isWinner: false },
				],
			});
			apiRes.code(201).send();
		} catch (error) {
			this._errorHandler.handle(error.message);
			apiRes.code(400).data("Không thể tạo mới trận đấu").send();
		}
	}
}
