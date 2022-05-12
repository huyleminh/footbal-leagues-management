"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLAYER_TYPE_ENUM = void 0;
const mongoose_1 = require("mongoose");
const PlayerModel_1 = require("./PlayerModel");
var PLAYER_TYPE_ENUM;
(function (PLAYER_TYPE_ENUM) {
    PLAYER_TYPE_ENUM[PLAYER_TYPE_ENUM["MAIN"] = 0] = "MAIN";
    PLAYER_TYPE_ENUM[PLAYER_TYPE_ENUM["SUB"] = 1] = "SUB";
})(PLAYER_TYPE_ENUM = exports.PLAYER_TYPE_ENUM || (exports.PLAYER_TYPE_ENUM = {}));
const InMatchPlayerSchema = new mongoose_1.Schema({
    playerId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: PlayerModel_1.default },
    playerType: {
        type: Number,
        default: PLAYER_TYPE_ENUM.MAIN,
        enum: [PLAYER_TYPE_ENUM.MAIN, PLAYER_TYPE_ENUM.SUB],
        required: true,
    },
    inMatchPosition: { type: String, required: true },
});
const LineupSchema = new mongoose_1.Schema({
    players: { type: [InMatchPlayerSchema], minlength: 0, required: true },
});
exports.default = (0, mongoose_1.model)("lineup", LineupSchema);
