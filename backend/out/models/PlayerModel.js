"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PlayerSchema = new mongoose_1.Schema({
    teamId: { type: mongoose_1.Schema.Types.ObjectId },
    playerName: { type: String, required: true },
    idNumber: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    stripNumber: { type: Number, required: true },
    position: { type: String, required: true },
});
exports.default = (0, mongoose_1.model)("player", PlayerSchema);
