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
const AuthMiddlewares_1 = require("../../middlewares/AuthMiddlewares");
const MulterUploadMiddlewares_1 = require("../../middlewares/MulterUploadMiddlewares");
const TeamMiddlewares_1 = require("../../middlewares/TeamMiddlewares");
const PlayerModel_1 = require("../../models/PlayerModel");
const TeamModel_1 = require("../../models/TeamModel");
const TournamentModel_1 = require("../../models/TournamentModel");
const TournamentParticipantModel_1 = require("../../models/TournamentParticipantModel");
const ImgBBService_1 = require("../../services/ImgBBService");
const AppResponse_1 = require("../../shared/AppResponse");
const AppController_1 = require("../AppController");
class TeamController extends AppController_1.default {
    constructor() {
        super("TeamController");
    }
    binding() {
        this.getPlayerListByTeamIdAsync = this.getPlayerListByTeamIdAsync.bind(this);
        this.getTeamDetailByIdAsync = this.getTeamDetailByIdAsync.bind(this);
        this.getTeamListAsync = this.getTeamListAsync.bind(this);
        this.postCreateTeamAsync = this.postCreateTeamAsync.bind(this);
        this.postCreateTeamStaffAsync = this.postCreateTeamStaffAsync.bind(this);
        this.putUpdateTeamStaffAsync = this.putUpdateTeamStaffAsync.bind(this);
        this.deleteTeamStaffAsync = this.deleteTeamStaffAsync.bind(this);
    }
    init() {
        this._router.get("/teams/:id/players", [AuthMiddlewares_1.default.verifyManagerRole], this.getPlayerListByTeamIdAsync);
        this._router.get("/teams/:id", this.getTeamDetailByIdAsync);
        this._router.get("/teams", [TeamMiddlewares_1.default.validateGetParams], this.getTeamListAsync);
        this._router.post("/teams/:id/staffs", [AuthMiddlewares_1.default.verifyManagerRole, TeamMiddlewares_1.default.validateCreateStaffData], this.postCreateTeamStaffAsync);
        this._router.post("/teams", [
            AuthMiddlewares_1.default.verifyManagerRole,
            MulterUploadMiddlewares_1.default.single("logo"),
            TeamMiddlewares_1.default.validateCreateTeamData,
        ], this.postCreateTeamAsync);
        this._router.put("/teams/:id/staffs/:staffId", [AuthMiddlewares_1.default.verifyManagerRole, TeamMiddlewares_1.default.validateCreateStaffData], this.putUpdateTeamStaffAsync);
        this._router.delete("/teams/:id/staffs/:staffId", [AuthMiddlewares_1.default.verifyManagerRole], this.deleteTeamStaffAsync);
    }
    getPlayerListByTeamIdAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const apiRes = new AppResponse_1.default(res);
            try {
                const team = yield TeamModel_1.default.findById(id).exec();
                if (team === null)
                    throw new Error("team_notfound");
                const playerIdList = team.players;
                const playerList = yield PlayerModel_1.default.find({ _id: { $in: playerIdList } })
                    .select(["-__v"])
                    .exec();
                apiRes.data(playerList).send();
            }
            catch (error) {
                this._errorHandler.handle(error.message);
                apiRes.code(400).data("Không thể lấy danh sách cầu thủ").send();
            }
        });
    }
    getTeamListAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiRes = new AppResponse_1.default(res);
            const { payload: { page, limit, tournamentId }, } = res.locals;
            try {
                let resultSet;
                let totalRecord = 0;
                const metadata = {
                    createdDate: new Date(),
                    pagination: {
                        page: page,
                        pageSize: 0,
                        totalRecord,
                    },
                };
                if (tournamentId === undefined) {
                    resultSet = yield TeamModel_1.default.find()
                        .select(["-__v", "-players", "-teamStaff"])
                        .limit(limit)
                        .skip(limit * (page - 1))
                        .exec();
                    totalRecord = yield TeamModel_1.default.countDocuments().exec();
                }
                else {
                    const participant = yield TournamentParticipantModel_1.default.findOne({
                        tournamentId,
                    }).exec();
                    if (participant === null) {
                        return apiRes.data([]).metadata(metadata).send();
                    }
                    const idList = participant.teams.map((item) => item.teamId);
                    resultSet = yield TeamModel_1.default.find({ _id: { $in: idList } })
                        .select(["-__v", "-players", "-teamStaff"])
                        .limit(limit)
                        .skip(limit * (page - 1))
                        .exec();
                    totalRecord = yield TeamModel_1.default.find({ _id: { $in: idList } })
                        .countDocuments()
                        .exec();
                }
                metadata.pagination = {
                    page: page,
                    pageSize: resultSet.length,
                    totalRecord,
                };
                apiRes.data(resultSet).metadata(metadata).send();
            }
            catch (error) {
                this._errorHandler.handle(error.message);
                apiRes.code(400).data("Không thể lấy danh sách đội bóng").send();
            }
        });
    }
    postCreateTeamStaffAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { payload } = res.locals;
            const apiRes = new AppResponse_1.default(res);
            if (payload.role === TeamModel_1.TEAM_STAFF_ROLE_ENUM.COACH) {
                payload.role = TeamModel_1.TEAM_STAFF_ROLE_ENUM.STAFF;
            }
            try {
                const team = yield TeamModel_1.default.findById(id).exec();
                if (team === null) {
                    return apiRes.code(400).data("Không tìm thấy đội bóng").send();
                }
                const teamStaff = team.teamStaff;
                teamStaff.push({
                    fullname: payload.fullname,
                    role: payload.role,
                    country: payload.country,
                });
                yield TeamModel_1.default.findByIdAndUpdate(id, {
                    totalMember: ++team.totalMember,
                    teamStaff: teamStaff,
                });
                apiRes.code(201).send();
            }
            catch (error) {
                this._errorHandler.handle(error.message);
                apiRes.code(400).data("Không thể tạo mới ban huấn luyện").send();
            }
        });
    }
    postCreateTeamAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiRes = new AppResponse_1.default(res);
            if (!req.file) {
                return apiRes.code(400).data("Thiếu logo đội bóng").send();
            }
            const { payload: { tournamentId, name, playerList, staffList, coachName, totalForeign }, } = res.locals;
            try {
                const tournament = yield TournamentModel_1.default.findById(tournamentId).exec();
                if (tournament === null) {
                    return apiRes.code(400).data("Giải đấu không hợp lệ").send();
                }
                const participant = yield TournamentParticipantModel_1.default.findOne({ tournamentId });
                if (participant !== null && participant.teams.length >= tournament.config.maxTeam) {
                    return apiRes.code(400).data("Số đội bóng đã đạt giới hạn").send();
                }
                if (totalForeign > tournament.config.maxAbroardPlayer) {
                    return apiRes.code(400).data("Số ngoại binh vượt quá giới hạn").send();
                }
                const tempCode = new mongoose.Types.ObjectId(32);
                const playerInserted = yield PlayerModel_1.default.insertMany(playerList.map((player) => {
                    return Object.assign(Object.assign({}, player), { teamId: tempCode });
                }));
                const playerIdList = playerInserted.map((player) => player._id);
                const logo = yield ImgBBService_1.default.uploadImageNoExpireAsync(req.file.path);
                const team = yield TeamModel_1.default.create({
                    name,
                    logo,
                    coachName,
                    teamStaff: staffList,
                    totalMember: staffList.length + playerInserted.length,
                    players: playerIdList,
                });
                yield PlayerModel_1.default.updateMany({ teamId: tempCode }, { teamId: team._id }).exec();
                if (participant === null) {
                    yield TournamentParticipantModel_1.default.create({
                        tournamentId,
                        teams: [
                            {
                                teamId: team._id,
                                participatedAt: new Date(),
                                usedConfig: { abroadPlayer: totalForeign },
                            },
                        ],
                    });
                }
                else {
                    yield TournamentParticipantModel_1.default.findByIdAndUpdate(participant._id, {
                        teams: [
                            ...participant.teams,
                            {
                                teamId: team._id,
                                participatedAt: new Date(),
                                usedConfig: { abroadPlayer: totalForeign },
                            },
                        ],
                    });
                }
                yield TournamentModel_1.default.findByIdAndUpdate(tournamentId, {
                    totalTeam: participant === null ? 1 : participant.teams.length + 1,
                }).exec();
                apiRes.code(201).send();
            }
            catch (error) {
                this._errorHandler.handle(error.message);
                apiRes.code(400).data("Không thể tạo mới đội bóng").send();
            }
        });
    }
    getTeamDetailByIdAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const apiRes = new AppResponse_1.default(res);
            try {
                const teamPromise = TeamModel_1.default.findById(id).select(["-__v", "-players"]).exec();
                const playerPromise = PlayerModel_1.default.find({ teamId: id })
                    .select(["-__v", "-teamId"])
                    .exec();
                const [team, playerList] = yield Promise.all([teamPromise, playerPromise]);
                if (!team || !playerList) {
                    throw new Error("get_team_detail_failed");
                }
                apiRes.data({ team, playerList }).send();
            }
            catch (error) {
                this._errorHandler.handle(error.message);
                apiRes.code(400).data("Không thể lấy chi tiết đội bóng").send();
            }
        });
    }
    putUpdateTeamStaffAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, staffId } = req.params;
            const { payload } = res.locals;
            const apiRes = new AppResponse_1.default(res);
            try {
                const team = yield TeamModel_1.default.findById(id).exec();
                if (team === null) {
                    return apiRes.code(400).data("Không tìm thấy đội bóng").send();
                }
                const teamStaff = team.teamStaff;
                const index = teamStaff.findIndex((staff) => staff._id.toString() === staffId);
                if (index === -1) {
                    return apiRes.code(400).data("Không tìm thấy thành viên").send();
                }
                const staff = teamStaff[index];
                if (staff.role === TeamModel_1.TEAM_STAFF_ROLE_ENUM.COACH &&
                    payload.role !== TeamModel_1.TEAM_STAFF_ROLE_ENUM.COACH) {
                    payload.role = TeamModel_1.TEAM_STAFF_ROLE_ENUM.COACH;
                }
                staff.fullname = payload.fullname;
                staff.country = payload.country;
                let coachName = team.coachName;
                if (staff.role !== TeamModel_1.TEAM_STAFF_ROLE_ENUM.COACH &&
                    payload.role === TeamModel_1.TEAM_STAFF_ROLE_ENUM.COACH) {
                    coachName = payload.fullname;
                    const coach = teamStaff.find((staff) => staff.role === TeamModel_1.TEAM_STAFF_ROLE_ENUM.COACH);
                    coach.role = TeamModel_1.TEAM_STAFF_ROLE_ENUM.STAFF;
                }
                staff.role = payload.role;
                yield TeamModel_1.default.findByIdAndUpdate(id, { coachName, teamStaff }).exec();
                apiRes.code(204).send();
            }
            catch (error) {
                this._errorHandler.handle(error.message);
                apiRes.code(400).data("Không thể cập nhật ban huấn luyện").send();
            }
        });
    }
    deleteTeamStaffAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, staffId } = req.params;
            const apiRes = new AppResponse_1.default(res);
            try {
                const team = yield TeamModel_1.default.findById(id).exec();
                if (team === null) {
                    return apiRes.code(400).data("Không tìm thấy đội bóng").send();
                }
                const teamStaff = team.teamStaff;
                const index = teamStaff.findIndex((staff) => staff._id.toString() === staffId);
                if (index === -1) {
                    throw new Error("team_staff_not_found");
                }
                const staff = teamStaff[index];
                if (staff.role === TeamModel_1.TEAM_STAFF_ROLE_ENUM.COACH) {
                    return apiRes.code(400).data("Không thể xóa huấn luyện viên trưởng").send();
                }
                yield TeamModel_1.default.findByIdAndUpdate(id, {
                    totalMember: --team.totalMember,
                    $pull: { teamStaff: { _id: new mongoose.Types.ObjectId(staffId) } },
                }).exec();
                apiRes.code(204).send();
            }
            catch (error) {
                this._errorHandler.handle(error.message);
                apiRes.code(400).data("Không thể xóa thành viên ban huấn luyện").send();
            }
        });
    }
}
exports.default = TeamController;
