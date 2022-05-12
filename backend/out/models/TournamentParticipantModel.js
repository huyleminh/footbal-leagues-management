"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TeamModel_1 = require("./TeamModel");
const TournamentModel_1 = require("./TournamentModel");
const TournamentParticipantSchema = new mongoose_1.Schema({
    tournamentId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: TournamentModel_1.default },
    teams: {
        type: [
            {
                teamId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: TeamModel_1.default },
                participatedAt: { type: Date, required: true },
                totalWon: { type: Number, default: 0 },
                totalLost: { type: Number, default: 0 },
                totalTied: { type: Number, default: 0 },
                totalPoint: { type: Number, default: 0 },
                usedConfig: {
                    type: {
                        addedPlayer: { type: Number, default: 0 },
                        changedPlayer: { type: Number, default: 0 },
                        abroadPlayer: { type: Number, require: true },
                    },
                },
            },
        ],
        minlength: 0,
        required: true,
    },
});
exports.default = (0, mongoose_1.model)("tournament_participant", TournamentParticipantSchema);
