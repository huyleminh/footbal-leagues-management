"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEAM_STAFF_ROLE_ENUM = void 0;
const mongoose_1 = require("mongoose");
const PlayerModel_1 = require("./PlayerModel");
var TEAM_STAFF_ROLE_ENUM;
(function (TEAM_STAFF_ROLE_ENUM) {
    TEAM_STAFF_ROLE_ENUM[TEAM_STAFF_ROLE_ENUM["COACH"] = 0] = "COACH";
    TEAM_STAFF_ROLE_ENUM[TEAM_STAFF_ROLE_ENUM["COACH_ASSISTANT"] = 1] = "COACH_ASSISTANT";
    TEAM_STAFF_ROLE_ENUM[TEAM_STAFF_ROLE_ENUM["STAFF"] = 2] = "STAFF";
})(TEAM_STAFF_ROLE_ENUM = exports.TEAM_STAFF_ROLE_ENUM || (exports.TEAM_STAFF_ROLE_ENUM = {}));
const TeamStaffSchema = new mongoose_1.Schema({
    fullname: { type: String, required: true },
    country: { type: String, required: true },
    role: {
        type: Number,
        enum: [
            TEAM_STAFF_ROLE_ENUM.COACH,
            TEAM_STAFF_ROLE_ENUM.COACH_ASSISTANT,
            TEAM_STAFF_ROLE_ENUM.STAFF,
        ],
        required: true,
    },
});
const TeamSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    logo: { type: String, required: true },
    coachName: { type: String, required: true },
    teamStaff: { type: [TeamStaffSchema], required: true },
    totalMember: { type: Number },
    players: { type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: PlayerModel_1.default }], required: true },
});
exports.default = (0, mongoose_1.model)("team", TeamSchema);
