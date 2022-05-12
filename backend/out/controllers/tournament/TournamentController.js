"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const escape_string_regexp_1 = require("../../libs/escape-string-regexp");
const AuthMiddlewares_1 = require("../../middlewares/AuthMiddlewares");
const MulterUploadMiddlewares_1 = require("../../middlewares/MulterUploadMiddlewares");
const TournamentMiddlewares_1 = require("../../middlewares/TournamentMiddlewares");
const TeamModel_1 = require("../../models/TeamModel");
const TournamentModel_1 = require("../../models/TournamentModel");
const TournamentParticipantModel_1 = require("../../models/TournamentParticipantModel");
const UserModel_1 = require("../../models/UserModel");
const ImgBBService_1 = require("../../services/ImgBBService");
const AppResponse_1 = require("../../shared/AppResponse");
const AppController_1 = require("../AppController");
const moment = require("moment");
class TournamentController extends AppController_1.default {
    constructor() {
        super("TournamentController");
    }
    binding() {
        this.getTournamentConfigByIdAsync = this.getTournamentConfigByIdAsync.bind(this);
        this.getTournamentParticipantsByIdAsync =
            this.getTournamentParticipantsByIdAsync.bind(this);
        this.getTournamentByIdAsync = this.getTournamentByIdAsync.bind(this);
        this.getTournamentListAsync = this.getTournamentListAsync.bind(this);
        this.postCreateTournamentAsync = this.postCreateTournamentAsync.bind(this);
        this.patchChangeTournamentStatusAsync = this.patchChangeTournamentStatusAsync.bind(this);
        this.deleteTournamentAsync = this.deleteTournamentAsync.bind(this);
    }
    init() {
        this._router.get("/tournaments/:id/config", [AuthMiddlewares_1.default.verifyManagerRole], this.getTournamentConfigByIdAsync);
        this._router.get("/tournaments/:id/participants", [AuthMiddlewares_1.default.verifyManagerRole], this.getTournamentParticipantsByIdAsync);
        this._router.get("/tournaments/:id", this.getTournamentByIdAsync);
        this._router.get("/tournaments", [TournamentMiddlewares_1.default.validateGetParams], this.getTournamentListAsync);
        this._router.post("/tournaments", [
            AuthMiddlewares_1.default.verifyManagerRole,
            MulterUploadMiddlewares_1.default.single("logo"),
            TournamentMiddlewares_1.default.validateCreateTournamentData,
        ], this.postCreateTournamentAsync);
        this._router.patch("/tournaments/:id/status", [AuthMiddlewares_1.default.verifyManagerRole], this.patchChangeTournamentStatusAsync);
        this._router.delete("/tournaments/:id", [AuthMiddlewares_1.default.verifyManagerRole], this.deleteTournamentAsync);
    }
    getTournamentListAsync(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const apiRes = new AppResponse_1.default(res);
            const { payload, tokenPayload } = res.locals;
            const filter = [];
            let regexString = ".";
            if (payload.searchTypeNum === TournamentModel_1.TOURNAMENT_SEARCH_TYPE_ENUM.MANAGER_NAME) {
                regexString = (0, escape_string_regexp_1.default)(payload.query ? payload.query : "");
            }
            if (payload.tournamentStatus !== undefined) {
                filter.push({ status: payload.tournamentStatus });
            }
            if (payload.isSelfAssigned) {
                filter.push({ createdBy: { $eq: new mongoose.Types.ObjectId(tokenPayload.userId) } });
            }
            const pipeline = [
                {
                    $lookup: {
                        from: "users",
                        localField: "createdBy",
                        foreignField: "_id",
                        as: "manager",
                    },
                },
                {
                    $match: { "manager.fullname": { $regex: regexString } },
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
            payload.searchTypeNum === TournamentModel_1.TOURNAMENT_SEARCH_TYPE_ENUM.NAME &&
                pipeline.unshift({
                    $match: { $text: { $search: payload.query ? payload.query : "" } },
                });
            try {
                const dataSet = yield TournamentModel_1.default.aggregate(pipeline).exec();
                const metadata = {
                    createdDate: new Date(),
                    pagination: {
                        page: payload.currentPage,
                        pageSize: dataSet[0].data.length,
                        totalRecord: (_a = dataSet[0].total[0]) === null || _a === void 0 ? void 0 : _a.count,
                    },
                };
                apiRes.code(200).data(dataSet[0].data).metadata(metadata).send();
            }
            catch (error) {
                this._errorHandler.handle(error.message);
                apiRes.code(400).data("Không thể lấy danh sách giải đấu").send();
            }
        });
    }
    postCreateTournamentAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { payload, tokenPayload } = res.locals;
            const apiRes = new AppResponse_1.default(res);
            if (!req.file) {
                return apiRes.code(400).data("Thiếu logo giải đấu").send();
            }
            try {
                const user = yield UserModel_1.default.findById(tokenPayload.userId).exec();
                if (user === null) {
                    return apiRes.code(400).data("Không tìm thấy quản lý").send();
                }
                if (payload.scheduledDate !== undefined && payload.status !== undefined) {
                    const now = moment();
                    const scheduledDate = moment(payload.scheduledDate);
                    if (!scheduledDate.isValid()) {
                        return apiRes.code(400).data("Lịch bắt đầu không đúng định dạng").send();
                    }
                    if (now < scheduledDate && payload.status !== TournamentModel_1.TOURNAMENT_STATUS_ENUM.PENDING) {
                        payload.status = TournamentModel_1.TOURNAMENT_STATUS_ENUM.PENDING;
                    }
                    payload.scheduledDate = scheduledDate.toISOString();
                }
                payload.sponsorName = payload.sponsorName.split(",");
                Object.keys(payload).forEach((key) => {
                    payload[key] === undefined && delete payload[key];
                });
                const logoUrl = yield ImgBBService_1.default.uploadImageNoExpireAsync(req.file.path);
                yield TournamentModel_1.default.create(Object.assign({ createdBy: user._id, logoUrl }, payload));
                apiRes.code(201).data("Tạo mới giải đấu thành công").send();
            }
            catch (error) {
                this._errorHandler.handle(error.message);
                apiRes.code(400).data("Không thể tạo mới giải đấu").send();
            }
        });
    }
    getTournamentConfigByIdAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const apiRes = new AppResponse_1.default(res);
            try {
                const tournament = yield TournamentModel_1.default.findById(id).exec();
                if (tournament === null) {
                    throw new Error("tournament_config_notfound");
                }
                apiRes.data(tournament.config).send();
            }
            catch (error) {
                this._errorHandler.handle(error.message);
                apiRes.code(400).data("Không thể lấy cấu hình chi tiết giải đấu").send();
            }
        });
    }
    getTournamentParticipantsByIdAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiRes = new AppResponse_1.default(res);
            const { id } = req.params;
            try {
                const participant = yield TournamentParticipantModel_1.default.findOne({
                    tournamentId: id,
                }).exec();
                if (participant === null) {
                    throw new Error("participant_notfound");
                }
                const idList = participant.teams.map((item) => item.teamId);
                const resultSet = yield TeamModel_1.default.find({ _id: { $in: idList } })
                    .select(["-__v", "-players", "-teamStaff"])
                    .exec();
                apiRes.data(resultSet).send();
            }
            catch (error) {
                this._errorHandler.handle(error.message);
                apiRes.code(400).data("Không thể lấy danh sách đội bóng").send();
            }
        });
    }
    getTournamentByIdAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const apiRes = new AppResponse_1.default(res);
            try {
                const tournament = yield TournamentModel_1.default.findById(id)
                    .select(["-__v", "-config"])
                    .exec();
                if (tournament === null) {
                    return apiRes.code(400).data("Không tìm thấy giải đấu").send();
                }
                const manager = yield UserModel_1.default.findById(tournament.createdBy)
                    .select(["fullname"])
                    .exec();
                const ret = {
                    _id: tournament._id,
                    name: tournament.name,
                    logoUrl: tournament.logoUrl,
                    sponsorName: tournament.sponsorName,
                    totalTeam: tournament.totalTeam,
                    status: tournament.status,
                    scheduledDate: tournament.scheduledDate,
                    createdAt: tournament.createdAt,
                    updatedAt: tournament.updatedAt,
                    createdByName: manager !== null ? manager.fullname : "",
                };
                apiRes.data(ret).send();
            }
            catch (error) {
                this._errorHandler.handle(error.message);
                apiRes.code(400).data("Không thể lấy thông tin chi tiết giải đấu").send();
            }
        });
    }
    patchChangeTournamentStatusAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { body } = req;
            const { tokenPayload } = res.locals;
            let status = body.status;
            if (!TournamentModel_1.TOURNAMENT_STATUS_ENUM[status]) {
                return new AppResponse_1.default(res, 400, "Trạng thái không hợp lệ").send();
            }
            try {
                const tournament = yield TournamentModel_1.default.findById(id).exec();
                if (tournament === null)
                    throw new Error("tournament_notfound");
                if (!tournament.createdBy.equals(tokenPayload.userId)) {
                    return new AppResponse_1.default(res, 400, "Không có quyền thay đổi trạng thái").send();
                }
                const now = moment();
                const update = { status };
                if (now.isBefore(moment(tournament.scheduledDate))) {
                    if (status !== TournamentModel_1.TOURNAMENT_STATUS_ENUM.PENDING) {
                        update["scheduledDate"] = now.toISOString();
                    }
                }
                else {
                    if (status === TournamentModel_1.TOURNAMENT_STATUS_ENUM.PENDING) {
                        update["scheduledDate"] = now.add(1, "day").toISOString();
                    }
                }
                yield TournamentModel_1.default.findByIdAndUpdate(id, update).exec();
                new AppResponse_1.default(res, 204).send();
            }
            catch (error) {
                this._errorHandler.handle(error.message);
                new AppResponse_1.default(res, 400, "Không thể cập nhật trạng thái").send();
            }
        });
    }
    deleteTournamentAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { tokenPayload } = res.locals;
            try {
                const tournament = yield TournamentModel_1.default.findById(id).exec();
                if (tournament === null)
                    throw new Error("tournament_notfound");
                if (tournament.totalTeam > 0)
                    throw new Error("tournament_delete_denied");
                if (!tournament.createdBy.equals(tokenPayload.userId)) {
                    return new AppResponse_1.default(res, 400, "Không có quyền xóa giải đấu").send();
                }
                yield TournamentModel_1.default.findByIdAndRemove(id).exec();
                yield TournamentParticipantModel_1.default.findOneAndRemove({ tournamentId: id }).exec();
                new AppResponse_1.default(res, 200).send();
            }
            catch (error) {
                this._errorHandler.handle(error.message);
                new AppResponse_1.default(res, 400, "Không thể xóa giải đấu").send();
            }
        });
    }
}
exports.default = TournamentController;
