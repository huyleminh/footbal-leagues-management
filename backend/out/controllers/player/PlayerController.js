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
const PlayerMiddlewares_1 = require("../../middlewares/PlayerMiddlewares");
const PlayerModel_1 = require("../../models/PlayerModel");
const TeamModel_1 = require("../../models/TeamModel");
const TournamentModel_1 = require("../../models/TournamentModel");
const TournamentParticipantModel_1 = require("../../models/TournamentParticipantModel");
const AppResponse_1 = require("../../shared/AppResponse");
const AppController_1 = require("../AppController");
class PlayerController extends AppController_1.default {
    constructor() {
        super("PlayerController");
    }
    binding() {
        this.postCreatePlayerAsync = this.postCreatePlayerAsync.bind(this);
        this.putReplacePlayerAsync = this.putReplacePlayerAsync.bind(this);
    }
    init() {
        this._router.post("/players", [AuthMiddlewares_1.default.verifyManagerRole, PlayerMiddlewares_1.default.validateCreatePlayerData], this.postCreatePlayerAsync);
        this._router.put("/players/:id/replace", [AuthMiddlewares_1.default.verifyManagerRole, PlayerMiddlewares_1.default.validateCreatePlayerData], this.putReplacePlayerAsync);
    }
    postCreatePlayerAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { payload: { playerName, teamId, idNumber, country, stripNumber, position, type }, } = res.locals;
            const apiRes = new AppResponse_1.default(res);
            try {
                const participant = yield TournamentParticipantModel_1.default.findOne({
                    teams: { $elemMatch: { teamId: new mongoose.Types.ObjectId(teamId) } },
                }).exec();
                if (participant === null) {
                    throw new Error("tournament_team_notfound");
                }
                const tournament = yield TournamentModel_1.default.findById(participant.tournamentId).exec();
                if (tournament === null) {
                    throw new Error("tournament_notfound");
                }
                const joinedTeam = participant.teams.find((team) => team.teamId.toString() === teamId);
                if (joinedTeam.usedConfig.addedPlayer === tournament.config.maxAdditionalPlayer) {
                    return apiRes.code(400).data("Lượng cầu thủ thêm mới đã đạt giới hạn");
                }
                if (type === 1 &&
                    joinedTeam.usedConfig.abroadPlayer === tournament.config.maxAbroardPlayer) {
                    return apiRes.code(400).data("Lượng ngoại binh đã đạt giới hạn");
                }
                const playerInserted = yield PlayerModel_1.default.create({
                    teamId,
                    playerName,
                    idNumber,
                    country,
                    stripNumber,
                    position,
                });
                yield TeamModel_1.default.updateOne({ _id: teamId }, [
                    { $set: { totalMember: { $add: ["$totalMember", 1] } } },
                    { $set: { players: { $concatArrays: ["$players", [playerInserted._id]] } } },
                ]).exec();
                ++joinedTeam.usedConfig.addedPlayer;
                type === 1 && ++joinedTeam.usedConfig.abroadPlayer;
                yield TournamentParticipantModel_1.default.findByIdAndUpdate(participant._id, participant);
                apiRes.code(201).send();
            }
            catch (error) {
                this._errorHandler.handle(error.message);
                apiRes.code(400).data("Không thể tạo mới cầu thủ").send();
            }
        });
    }
    putReplacePlayerAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { payload: { playerName, teamId, idNumber, country, stripNumber, position, type }, } = res.locals;
            const { id } = req.params;
            const apiRes = new AppResponse_1.default(res);
            try {
                const participant = yield TournamentParticipantModel_1.default.findOne({
                    teams: { $elemMatch: { teamId: new mongoose.Types.ObjectId(teamId) } },
                }).exec();
                if (participant === null) {
                    throw new Error("tournament_team_notfound");
                }
                const tournament = yield TournamentModel_1.default.findById(participant.tournamentId).exec();
                if (tournament === null) {
                    throw new Error("tournament_notfound");
                }
                const joinedTeam = participant.teams.find((team) => team.teamId.toString() === teamId);
                if (joinedTeam.usedConfig.changedPlayer === tournament.config.maxChangingPlayer) {
                    return apiRes.code(400).data("Lượng cầu thủ thay thế đã đạt giới hạn");
                }
                if (type === 1 &&
                    joinedTeam.usedConfig.abroadPlayer === tournament.config.maxAbroardPlayer) {
                    return apiRes.code(400).data("Lượng ngoại binh đã đạt giới hạn");
                }
                const playerInserted = yield PlayerModel_1.default.create({
                    teamId,
                    playerName,
                    idNumber,
                    country,
                    stripNumber,
                    position,
                });
                yield TeamModel_1.default.findByIdAndUpdate(teamId, {
                    $pull: { players: { $eq: new mongoose.Types.ObjectId(id) } },
                }).exec();
                yield TeamModel_1.default.updateOne({ _id: teamId }, [
                    { $set: { players: { $concatArrays: ["$players", [playerInserted._id]] } } },
                ]).exec();
                yield PlayerModel_1.default.findByIdAndUpdate(id, { teamId: new mongoose.Types.ObjectId() });
                ++joinedTeam.usedConfig.changedPlayer;
                type === 1 && ++joinedTeam.usedConfig.abroadPlayer;
                yield TournamentParticipantModel_1.default.findByIdAndUpdate(participant._id, participant);
                apiRes.code(201).send();
            }
            catch (error) {
                this._errorHandler.handle(error.message);
                apiRes.code(400).data("Không thể thay thế cầu thủ").send();
            }
        });
    }
}
exports.default = PlayerController;
