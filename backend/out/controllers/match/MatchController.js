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
const moment = require("moment");
const AuthMiddlewares_1 = require("../../middlewares/AuthMiddlewares");
const MatchMiddlewares_1 = require("../../middlewares/MatchMiddlewares");
const MatchModel_1 = require("../../models/MatchModel");
const TournamentModel_1 = require("../../models/TournamentModel");
const AppResponse_1 = require("../../shared/AppResponse");
const AppController_1 = require("../AppController");
const MatchEventModel_1 = require("../../models/MatchEventModel");
const TournamentParticipantModel_1 = require("../../models/TournamentParticipantModel");
class MatchController extends AppController_1.default {
    constructor() {
        super("MatchController");
    }
    binding() {
        this.getMatchEventById = this.getMatchEventById.bind(this);
        this.getMatchDetailById = this.getMatchDetailById.bind(this);
        this.getMatchListAsync = this.getMatchListAsync.bind(this);
        this.postCreateMatchAsync = this.postCreateMatchAsync.bind(this);
        this.putEditMatchResult = this.putEditMatchResult.bind(this);
    }
    init() {
        this._router.get("/matches/:id/events", [], this.getMatchEventById);
        this._router.get("/matches/:id", [], this.getMatchDetailById);
        this._router.get("/matches", [MatchMiddlewares_1.default.validateGetParams], this.getMatchListAsync);
        this._router.post("/matches", [AuthMiddlewares_1.default.verifyManagerRole, MatchMiddlewares_1.default.validateCreateMatchData], this.postCreateMatchAsync);
        this._router.put("/matches/:id", [AuthMiddlewares_1.default.verifyManagerRole, MatchMiddlewares_1.default.validateEditData], this.putEditMatchResult);
    }
    getMatchEventById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const apiRes = new AppResponse_1.default(res);
            try {
                const match = yield MatchModel_1.default.findById(id).exec();
                if (match === null)
                    throw new Error("match_notfound");
                const { events } = match;
                const eventList = yield MatchEventModel_1.default.aggregate([
                    {
                        $lookup: {
                            from: "players",
                            localField: "goal.player",
                            foreignField: "_id",
                            as: "goal_players",
                        },
                    },
                    {
                        $lookup: {
                            from: "players",
                            localField: "goal.assist",
                            foreignField: "_id",
                            as: "goal_assist_players",
                        },
                    },
                    {
                        $lookup: {
                            from: "players",
                            localField: "card.player",
                            foreignField: "_id",
                            as: "card_players",
                        },
                    },
                    {
                        $lookup: {
                            from: "players",
                            localField: "substitution.inPlayer",
                            foreignField: "_id",
                            as: "sub_in_players",
                        },
                    },
                    {
                        $lookup: {
                            from: "players",
                            localField: "substitution.outPlayer",
                            foreignField: "_id",
                            as: "sub_out_players",
                        },
                    },
                    { $match: { _id: { $in: events } } },
                ]).exec();
                const mapped = eventList.map((event) => {
                    const { _id, ocurringMinute, isHome, goal, card, substitution } = event;
                    const result = {
                        _id,
                        ocurringMinute,
                        isHome,
                        goal,
                        card,
                        substitution,
                    };
                    if (event.card_players.length > 0) {
                        result.card.playerName = event.card_players[0].playerName;
                        result.card.playerStrip = event.card_players[0].stripNumber;
                    }
                    if (event.goal_players.length > 0) {
                        result.goal.playerName = event.goal_players[0].playerName;
                        result.goal.playerStrip = event.goal_players[0].stripNumber;
                    }
                    if (event.goal_assist_players.length > 0) {
                        result.goal.assistName = event.goal_assist_players[0].playerName;
                        result.goal.assistStrip = event.goal_assist_players[0].stripNumber;
                    }
                    if (event.sub_in_players.length > 0) {
                        result.substitution.inName = event.sub_in_players[0].playerName;
                        result.substitution.inStrip = event.sub_in_players[0].stripNumber;
                    }
                    if (event.sub_out_players.length > 0) {
                        result.substitution.outName = event.sub_out_players[0].playerName;
                        result.substitution.outStrip = event.sub_out_players[0].stripNumber;
                    }
                    return result;
                });
                apiRes.data(mapped).send();
            }
            catch (error) {
                this._errorHandler.handle(error.message);
                apiRes.code(400).data("Không thể lấy chi tiết sự kiện trận đấu").send();
            }
        });
    }
    getMatchDetailById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const apiRes = new AppResponse_1.default(res);
            try {
                const [match] = yield MatchModel_1.default.aggregate([
                    { $match: { _id: { $eq: new mongoose.Types.ObjectId(id) } } },
                    {
                        $lookup: {
                            from: "players",
                            localField: "competitors.lineup.playerId",
                            foreignField: "_id",
                            as: "lineup_players",
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            scheduledDate: 1,
                            stadiumName: 1,
                            round: 1,
                            competitors: 1,
                            kickedOffDate: 1,
                            lineup_players: 1,
                        },
                    },
                ]).exec();
                if (match === undefined)
                    throw new Error("match_detail_get_error");
                const [home] = match.competitors.filter((team) => team.teamType === MatchModel_1.MATCH_COMPETITOR_ENUM.HOME);
                if (home) {
                    const lineup = home.lineup.map((player) => {
                        const playerMatchLineup = match.lineup_players.find((item) => item._id.equals(player.playerId));
                        return {
                            playerId: player.playerId,
                            playerType: player.playerType,
                            inMatchPosition: player.inMatchPosition,
                            stripNumber: playerMatchLineup ? playerMatchLineup.stripNumber : NaN,
                            playerName: playerMatchLineup
                                ? playerMatchLineup.playerName
                                : "Không xác định",
                        };
                    });
                    home.lineup = lineup;
                    delete home._id;
                }
                const [away] = match.competitors.filter((team) => team.teamType === MatchModel_1.MATCH_COMPETITOR_ENUM.AWAY);
                if (away) {
                    const lineup = away.lineup.map((player) => {
                        const playerMatchLineup = match.lineup_players.find((item) => item._id.equals(player.playerId));
                        return {
                            playerId: player.playerId,
                            playerType: player.playerType,
                            inMatchPosition: player.inMatchPosition,
                            stripNumber: playerMatchLineup ? playerMatchLineup.stripNumber : NaN,
                            playerName: playerMatchLineup
                                ? playerMatchLineup.playerName
                                : "Không xác định",
                        };
                    });
                    away.lineup = lineup;
                    delete away._id;
                }
                delete match.lineup_players;
                apiRes.data(match).send();
            }
            catch (error) {
                this._errorHandler.handle(error.message);
                apiRes.code(400).data("Không thể lấy chi tiết trận đấu").send();
            }
        });
    }
    getMatchListAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiRes = new AppResponse_1.default(res);
            const { payload: { round, tournamentId }, } = res.locals;
            try {
                const tournament = yield TournamentModel_1.default.findById(tournamentId).exec();
                if (tournament === null)
                    throw new Error("tournament_notfound");
                const { totalTeam } = tournament;
                const totalMatch = (totalTeam * (totalTeam - 1)) / 2;
                const matchPerRound = totalTeam / 2;
                const totalRound = totalMatch / matchPerRound;
                const pipeline = [
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
                const matchList = yield MatchModel_1.default.aggregate(pipeline).exec();
                const mapped = matchList.map((match) => {
                    const home = match.competitors.find((item) => item.teamType === MatchModel_1.MATCH_COMPETITOR_ENUM.HOME);
                    const away = match.competitors.find((item) => item.teamType === MatchModel_1.MATCH_COMPETITOR_ENUM.AWAY);
                    const homeInfo = match.teamInfo.find((item) => item._id.equals(home.teamId));
                    const awayInfo = match.teamInfo.find((item) => item._id.equals(away.teamId));
                    return {
                        _id: match._id,
                        scheduledDate: match.scheduledDate,
                        stadiumName: match.stadiumName,
                        round: match.round,
                        competitors: [
                            {
                                teamId: home.teamId,
                                teamType: home.teamType,
                                isWinner: home.isWinner,
                                name: homeInfo.name,
                                logo: homeInfo.logo,
                                goal: home.goal === undefined ? null : home.goal,
                            },
                            {
                                teamId: away.teamId,
                                teamType: away.teamType,
                                isWinner: away.isWinner,
                                name: awayInfo.name,
                                logo: awayInfo.logo,
                                goal: away.goal === undefined ? null : away.goal,
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
            }
            catch (error) {
                this._errorHandler.handle(error.message);
                apiRes.code(400).data("Không thể lấy danh sách trận đấu").send();
            }
        });
    }
    postCreateMatchAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { payload: { homeId, awayId, stadiumName, scheduledDate, round, tournamentId }, } = res.locals;
            const apiRes = new AppResponse_1.default(res);
            try {
                const tournament = yield TournamentModel_1.default.findById(tournamentId).exec();
                if (tournament === null) {
                    throw new Error("tournament_notfound");
                }
                const matchOfRound = yield MatchModel_1.default.find({ round: round }).exec();
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
                const pairMatch = yield MatchModel_1.default.find({
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
                        if ((competitor.teamType === MatchModel_1.MATCH_COMPETITOR_ENUM.HOME &&
                            competitor.teamId.equals(homeId)) ||
                            (competitor.teamType === MatchModel_1.MATCH_COMPETITOR_ENUM.AWAY &&
                                competitor.teamId.equals(awayId))) {
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
                yield MatchModel_1.default.create({
                    tournamentId: tournament._id,
                    scheduledDate,
                    stadiumName,
                    round,
                    competitors: [
                        { teamId: homeId, teamType: MatchModel_1.MATCH_COMPETITOR_ENUM.HOME, isWinner: false },
                        { teamId: awayId, teamType: MatchModel_1.MATCH_COMPETITOR_ENUM.AWAY, isWinner: false },
                    ],
                });
                apiRes.code(201).send();
            }
            catch (error) {
                this._errorHandler.handle(error.message);
                apiRes.code(400).data("Không thể tạo mới trận đấu").send();
            }
        });
    }
    putEditMatchResult(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { payload: { scheduledDate, stadiumName, events, competitors }, } = res.locals;
            const apiRes = new AppResponse_1.default(res);
            try {
                const match = yield MatchModel_1.default.findById(id).exec();
                if (match === null) {
                    return apiRes.code(400).data("Trận đấu không tồn tại").send();
                }
                const { kickedOffDate, tournamentId } = match;
                if (kickedOffDate && moment(kickedOffDate).diff(moment(), "seconds") < -3600) {
                    return apiRes.code(400).data("Thời gian cho phép sửa kết quả đã quá hạn").send();
                }
                let updateObj = {};
                if (!kickedOffDate) {
                    updateObj = { stadiumName, scheduledDate };
                }
                if (events !== null) {
                    if (!kickedOffDate) {
                        updateObj.kickedOffDate = moment().toISOString();
                    }
                    const oldEventIdList = match.events;
                    yield MatchEventModel_1.default.deleteMany({ _id: { $in: oldEventIdList } }).exec();
                    const sortedEvents = events.sort((a, b) => {
                        const left = a.ocurringMinute;
                        const right = b.ocurringMinute;
                        if (left < right) {
                            return -1;
                        }
                        if (left > right) {
                            return 1;
                        }
                        return 0;
                    });
                    const newEventList = yield MatchEventModel_1.default.insertMany(sortedEvents);
                    const newEventIdList = newEventList.map((event) => event._id);
                    updateObj.events = newEventIdList;
                }
                if (competitors !== null) {
                    if (!kickedOffDate) {
                        updateObj.kickedOffDate = moment().toISOString();
                    }
                    const home = match.competitors.find((team) => team.teamType === MatchModel_1.MATCH_COMPETITOR_ENUM.HOME);
                    const away = match.competitors.find((team) => team.teamType === MatchModel_1.MATCH_COMPETITOR_ENUM.AWAY);
                    const tournamentParticipants = yield TournamentParticipantModel_1.default.findOne({
                        tournamentId,
                    }).exec();
                    if (tournamentParticipants === null) {
                        throw new Error("tournament_participant_not_found");
                    }
                    let homeParticipant = tournamentParticipants.teams.find((team) => team.teamId.equals(home.teamId));
                    let awayParticipant = tournamentParticipants.teams.find((team) => team.teamId.equals(away.teamId));
                    if (home.goal !== undefined && away.goal !== undefined) {
                        if (home.goal === away.goal) {
                            homeParticipant.totalPoint--;
                            homeParticipant.totalTied--;
                            awayParticipant.totalTied--;
                            awayParticipant.totalPoint--;
                        }
                        if (home.goal > away.goal) {
                            homeParticipant.totalPoint -= 3;
                            homeParticipant.totalWon--;
                            awayParticipant.totalLost--;
                        }
                        if (home.goal < away.goal) {
                            homeParticipant.totalLost--;
                            awayParticipant.totalWon--;
                            awayParticipant.totalPoint -= 3;
                        }
                    }
                    let newHome = competitors.find((team) => team.teamType === MatchModel_1.MATCH_COMPETITOR_ENUM.HOME);
                    let newAway = competitors.find((team) => team.teamType === MatchModel_1.MATCH_COMPETITOR_ENUM.AWAY);
                    newHome.goal = parseInt(newHome.goal);
                    newAway.goal = parseInt(newAway.goal);
                    if (newHome.goal === newAway.goal) {
                        homeParticipant.totalPoint++;
                        homeParticipant.totalTied++;
                        awayParticipant.totalTied++;
                        awayParticipant.totalPoint++;
                    }
                    if (newHome.goal > newAway.goal) {
                        homeParticipant.totalPoint += 3;
                        homeParticipant.totalWon++;
                        awayParticipant.totalLost++;
                    }
                    if (newHome.goal < newAway.goal) {
                        homeParticipant.totalLost++;
                        awayParticipant.totalWon++;
                        awayParticipant.totalPoint += 3;
                    }
                    yield TournamentParticipantModel_1.default.findByIdAndUpdate(tournamentParticipants._id, { teams: tournamentParticipants.teams }).exec();
                    updateObj.competitors = competitors;
                }
                yield MatchModel_1.default.findByIdAndUpdate(id, updateObj).exec();
                apiRes.code(204).send();
            }
            catch (error) {
                this._errorHandler.handle(error.message);
                apiRes.code(400).data("Không thể cập nhật kết quả trận đấu").send();
            }
        });
    }
}
exports.default = MatchController;
