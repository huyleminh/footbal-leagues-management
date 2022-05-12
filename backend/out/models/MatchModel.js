"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MATCH_COMPETITOR_PLAYER_TYPE_ENUM = exports.MATCH_COMPETITOR_ENUM = void 0;
const mongoose_1 = require("mongoose");
const MatchEventModel_1 = require("./MatchEventModel");
const PlayerModel_1 = require("./PlayerModel");
const TeamModel_1 = require("./TeamModel");
var MATCH_COMPETITOR_ENUM;
(function (MATCH_COMPETITOR_ENUM) {
    MATCH_COMPETITOR_ENUM[MATCH_COMPETITOR_ENUM["HOME"] = 0] = "HOME";
    MATCH_COMPETITOR_ENUM[MATCH_COMPETITOR_ENUM["AWAY"] = 1] = "AWAY";
})(MATCH_COMPETITOR_ENUM = exports.MATCH_COMPETITOR_ENUM || (exports.MATCH_COMPETITOR_ENUM = {}));
var MATCH_COMPETITOR_PLAYER_TYPE_ENUM;
(function (MATCH_COMPETITOR_PLAYER_TYPE_ENUM) {
    MATCH_COMPETITOR_PLAYER_TYPE_ENUM[MATCH_COMPETITOR_PLAYER_TYPE_ENUM["MAIN"] = 0] = "MAIN";
    MATCH_COMPETITOR_PLAYER_TYPE_ENUM[MATCH_COMPETITOR_PLAYER_TYPE_ENUM["SUB"] = 1] = "SUB";
})(MATCH_COMPETITOR_PLAYER_TYPE_ENUM = exports.MATCH_COMPETITOR_PLAYER_TYPE_ENUM || (exports.MATCH_COMPETITOR_PLAYER_TYPE_ENUM = {}));
const LineupSchema = new mongoose_1.Schema({
    playerId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: PlayerModel_1.default },
    playerType: {
        type: Number,
        default: MATCH_COMPETITOR_PLAYER_TYPE_ENUM.MAIN,
        enum: [MATCH_COMPETITOR_PLAYER_TYPE_ENUM.MAIN, MATCH_COMPETITOR_PLAYER_TYPE_ENUM.SUB],
        required: true,
    },
    inMatchPosition: { type: String, required: true },
});
const CompetitorModel = new mongoose_1.Schema({
    teamId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: TeamModel_1.default },
    teamType: {
        type: Number,
        enum: [MATCH_COMPETITOR_ENUM.HOME, MATCH_COMPETITOR_ENUM.AWAY],
        required: true,
    },
    isWinner: { type: Boolean, required: true },
    goal: { type: Number },
    totalShot: { type: Number },
    shotsOntarget: { type: Number },
    possessions: { type: Number },
    totalPass: { type: Number },
    passAccuracy: { type: Number },
    offsides: { type: Number },
    conners: { type: Number },
    fouls: { type: Number },
    lineup: { type: [LineupSchema], default: [] },
});
const MatchSchema = new mongoose_1.Schema({
    tournamentId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    scheduledDate: { type: Date, required: true },
    kickedOffDate: { type: Date },
    stadiumName: { type: String, required: true },
    round: { type: Number, required: true },
    events: { type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: MatchEventModel_1.default }], default: [] },
    competitors: { type: [CompetitorModel], required: true },
});
exports.default = (0, mongoose_1.model)("match", MatchSchema);
