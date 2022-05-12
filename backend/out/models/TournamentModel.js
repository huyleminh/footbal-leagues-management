"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOURNAMENT_SEARCH_TYPE_ENUM = exports.TOURNAMENT_STATUS_ENUM = void 0;
const mongoose_1 = require("mongoose");
const UserModel_1 = require("./UserModel");
var TOURNAMENT_STATUS_ENUM;
(function (TOURNAMENT_STATUS_ENUM) {
    TOURNAMENT_STATUS_ENUM[TOURNAMENT_STATUS_ENUM["PENDING"] = 0] = "PENDING";
    TOURNAMENT_STATUS_ENUM[TOURNAMENT_STATUS_ENUM["INPROGRESS"] = 1] = "INPROGRESS";
    TOURNAMENT_STATUS_ENUM[TOURNAMENT_STATUS_ENUM["EXPIRE_SOON"] = 2] = "EXPIRE_SOON";
    TOURNAMENT_STATUS_ENUM[TOURNAMENT_STATUS_ENUM["ENDED"] = 3] = "ENDED";
})(TOURNAMENT_STATUS_ENUM = exports.TOURNAMENT_STATUS_ENUM || (exports.TOURNAMENT_STATUS_ENUM = {}));
var TOURNAMENT_SEARCH_TYPE_ENUM;
(function (TOURNAMENT_SEARCH_TYPE_ENUM) {
    TOURNAMENT_SEARCH_TYPE_ENUM[TOURNAMENT_SEARCH_TYPE_ENUM["NAME"] = 0] = "NAME";
    TOURNAMENT_SEARCH_TYPE_ENUM[TOURNAMENT_SEARCH_TYPE_ENUM["MANAGER_NAME"] = 1] = "MANAGER_NAME";
})(TOURNAMENT_SEARCH_TYPE_ENUM = exports.TOURNAMENT_SEARCH_TYPE_ENUM || (exports.TOURNAMENT_SEARCH_TYPE_ENUM = {}));
const TournamentSchema = new mongoose_1.Schema({
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: UserModel_1.default },
    name: { type: String, required: true, trim: true },
    logoUrl: { type: String, required: true },
    sponsorName: { type: [String], required: true },
    totalTeam: { type: Number, default: 0 },
    status: {
        type: Number,
        enum: [
            TOURNAMENT_STATUS_ENUM.INPROGRESS,
            TOURNAMENT_STATUS_ENUM.PENDING,
            TOURNAMENT_STATUS_ENUM.EXPIRE_SOON,
            TOURNAMENT_STATUS_ENUM.ENDED,
        ],
        default: TOURNAMENT_STATUS_ENUM.PENDING,
    },
    config: {
        maxAdditionalPlayer: { type: Number, required: true },
        maxChangingPlayer: { type: Number, required: true },
        maxPlayerAge: { type: Number, required: true },
        maxAbroardPlayer: { type: Number, required: true },
        maxTeam: { type: Number, required: true },
        maxPlayerPerMatch: { type: Number, required: true },
    },
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
    scheduledDate: { type: Date, default: () => new Date(new Date().getTime() + 86400000) },
});
TournamentSchema.index({ name: "text" });
exports.default = (0, mongoose_1.model)("tournament", TournamentSchema);
