import moment = require("moment");
import * as mongoose from "mongoose";
import { IAppRequest, IAppResponse } from "../../@types/AppBase";
import escapeStringRegexp from "../../libs/escape-string-regexp";
import AuthMiddlewares from "../../middlewares/AuthMiddlewares";
import DiskUploadMiddleware from "../../middlewares/MulterUploadMiddlewares";
import TournamentMiddlewares from "../../middlewares/TournamentMiddlewares";
import TournamentModel, {
	TOURNAMENT_SEARCH_TYPE_ENUM,
	TOURNAMENT_STATUS_ENUM,
} from "../../models/TournamentModel";
import UserModel from "../../models/UserModel";
import ImgBBService from "../../services/ImgBBService";
import AppResponse from "../../shared/AppResponse";
import { Logger } from "../../utils/Logger";
import AppController from "../AppController";

export default class TournamentController extends AppController {
	constructor() {
		super();
	}

	init(): void {
		this._router.get(
			"/tournaments",
			[TournamentMiddlewares.validateGetParams],
			this.getTournamentListAsync,
		);

		this._router.post(
			"/tournaments",
			[
				AuthMiddlewares.verifyManagerRole,
				DiskUploadMiddleware.single("logo"),
				TournamentMiddlewares.validateCreateTournamentData,
			],
			this.postCreateTournamentAsync,
		);
	}

	async getTournamentListAsync(req: IAppRequest, res: IAppResponse) {
		const apiRes = new AppResponse(res);
		const { payload, tokenPayload } = res.locals;
		const filter = [];

		if (payload.searchTypeNum === TOURNAMENT_SEARCH_TYPE_ENUM.MANAGER_NAME) {
			filter.push({
				"manager.fullname": {
					$regex: escapeStringRegexp(payload.query ? payload.query : ""),
				},
			});
		}
		if (payload.tournamentStatus !== undefined) {
			filter.push({ status: payload.tournamentStatus });
		}
		if (payload.isSelfAssigned) {
			filter.push({ createdBy: { $in: [new mongoose.Types.ObjectId(tokenPayload.userId)] } });
		}

		const pipeline: Array<any> = [
			{
				$lookup: {
					from: "users",
					localField: "createdBy",
					foreignField: "_id",
					as: "manager",
				},
			},
			{
				$project: {
					_id: 1,
					createdBy: 1,
					name: 1,
					logoUrl: 1,
					sponsorName: 1,
					totalTeam: 1,
					status: 1,
					scheduledDate: 1,
					createdAt: 1,
					updatedAt: 1,
					"manager.fullname": 1,
					"manager._id": 1,
				},
			},
			{
				$facet: {
					data: [
						{ $skip: payload.limitItems * (payload.currentPage - 1) },
						{ $limit: payload.limitItems },
					],
					total: [{ $count: "count" }],
				},
			},
		];

		filter.length !== 0 && pipeline.splice(0, 0, { $match: { $and: filter } });
		payload.searchTypeNum === TOURNAMENT_SEARCH_TYPE_ENUM.NAME &&
			pipeline.unshift({
				$match: { $text: { $search: payload.query ? payload.query : "" } },
			});

		try {
			const dataSet = await TournamentModel.aggregate(pipeline).exec();
			const metadata = {
				createdDate: new Date(),
				pagination: {
					page: payload.currentPage,
					pageSize: dataSet[0].data.length,
					totalRecord: dataSet[0].total[0]?.count,
				},
			};
			apiRes.code(200).message("OK").data(dataSet[0].data).metadata(metadata).send();
		} catch (error) {
			Logger.error({
				message: {
					class: "TournamentController",
					method: "getTournamentListAsync",
					msg: error.message,
				},
			});
			apiRes.code(400).message("Bad Request").data("Không thể lấy danh sách giải đấu").send();
		}
	}

	async postCreateTournamentAsync(req: IAppRequest, res: IAppResponse) {
		const { payload, tokenPayload } = res.locals;
		const apiRes = new AppResponse(res);

		if (!req.file) {
			return apiRes.code(400).message("Bad Request").data("Thiếu logo giải đấu").send();
		}

		try {
			const user = await UserModel.findById(tokenPayload.userId).exec();
			if (user === null) {
				return apiRes
					.code(400)
					.message("Bad Request")
					.data("Không tìm thấy quản lý")
					.send();
			}

			if (payload.scheduledDate !== undefined && payload.status !== undefined) {
				const now = moment();
				const scheduledDate = moment(payload.scheduledDate);
				if (!scheduledDate.isValid()) {
					return apiRes
						.code(400)
						.message("Bad Request")
						.data("Lịch bắt đầu không đúng định dạng")
						.send();
				}
				if (now < scheduledDate && payload.status !== TOURNAMENT_STATUS_ENUM.PENDING) {
					payload.status = TOURNAMENT_STATUS_ENUM.PENDING;
				}
				payload.scheduledDate = scheduledDate.toISOString();
			}

			payload.sponsorName = payload.sponsorName.split(",");

			Object.keys(payload).forEach((key) => {
				payload[key] === undefined && delete payload[key];
			});

			const logoUrl = await ImgBBService.uploadImageNoExpireAsync(req.file.path);
			await TournamentModel.create({
				createdBy: user._id,
				logoUrl,
				...payload,
			});
			apiRes.code(201).message("Created").data("Tạo mới giải đấu thành công").send();
		} catch (error) {
			Logger.error({
				message: {
					class: "TournamentController",
					method: "postCreateTournamentAsync",
					msg: error.message,
				},
			});
			apiRes.code(400).message("Bad Request").data("Không thể tạo mới giải đấu").send();
		}
	}
}