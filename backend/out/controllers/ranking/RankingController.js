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
const TeamModel_1 = require("../../models/TeamModel");
const TournamentParticipantModel_1 = require("../../models/TournamentParticipantModel");
const AppResponse_1 = require("../../shared/AppResponse");
const AppController_1 = require("../AppController");
class RankingController extends AppController_1.default {
    constructor() {
        super("RankingController");
    }
    binding() {
        this.getTournamentRankingAsync = this.getTournamentRankingAsync.bind(this);
    }
    init() {
        this._router.get("/ranking/:id", this.getTournamentRankingAsync);
    }
    getTournamentRankingAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiRes = new AppResponse_1.default(res);
            const { id } = req.params;
            try {
                const participantList = yield TournamentParticipantModel_1.default.find({ tournamentId: id })
                    .select(["-__v", "_id"])
                    .exec();
                if (participantList.length === 0) {
                    return apiRes.data([]).send();
                }
                const teams = participantList[0].teams;
                const teamIdList = teams.map((team) => team.teamId);
                const teamList = yield TeamModel_1.default.find({ _id: { $in: teamIdList } })
                    .select(["_id", "name", "logo"])
                    .exec();
                if (teamList.length === 0) {
                    return apiRes.code(400).data("Không thể xem bảng xếp hạng giải đấu").send();
                }
                const mappedData = teamList.map((team) => {
                    var _a, _b, _c, _d, _e;
                    const index = teams.findIndex((item) => item.teamId.equals(team._id));
                    const item = {
                        id: team._id,
                        name: team.name,
                        logo: team.logo,
                        participatedAt: (_a = teams[index]) === null || _a === void 0 ? void 0 : _a.participatedAt,
                        totalWon: (_b = teams[index]) === null || _b === void 0 ? void 0 : _b.totalWon,
                        totalLost: (_c = teams[index]) === null || _c === void 0 ? void 0 : _c.totalLost,
                        totalTied: (_d = teams[index]) === null || _d === void 0 ? void 0 : _d.totalTied,
                        totalPoint: (_e = teams[index]) === null || _e === void 0 ? void 0 : _e.totalPoint,
                    };
                    return item;
                });
                apiRes.data(mappedData).send();
            }
            catch (error) {
                this._errorHandler.handle(error.message);
                apiRes.code(400).data("Không thể xem bảng xếp hạng giải đấu").send();
            }
        });
    }
}
exports.default = RankingController;
