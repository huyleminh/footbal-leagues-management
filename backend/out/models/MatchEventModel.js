"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PlayerModel_1 = require("./PlayerModel");
const GoalEventSchema = new mongoose_1.Schema({
    type: { type: String, required: true },
    assist: { type: mongoose_1.Schema.Types.ObjectId, ref: PlayerModel_1.default },
    player: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: PlayerModel_1.default },
});
const CardEventSchema = new mongoose_1.Schema({
    type: { type: String, required: true },
    player: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: PlayerModel_1.default },
});
const SubstitutionEventSchema = new mongoose_1.Schema({
    inPlayer: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: PlayerModel_1.default },
    outPlayer: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: PlayerModel_1.default },
});
const MatchEventShema = new mongoose_1.Schema({
    ocurringMinute: { type: String, required: true },
    isHome: { type: Boolean, required: true },
    goal: { type: GoalEventSchema, default: null },
    card: { type: CardEventSchema, default: null },
    substitution: { type: SubstitutionEventSchema, default: null },
});
exports.default = (0, mongoose_1.model)("match_event", MatchEventShema);
