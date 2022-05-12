"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthController_1 = require("./auth/AuthController");
const ManagerController_1 = require("./manager/ManagerController");
const MatchController_1 = require("./match/MatchController");
const PlayerController_1 = require("./player/PlayerController");
const RankingController_1 = require("./ranking/RankingController");
const TeamController_1 = require("./team/TeamController");
const TournamentController_1 = require("./tournament/TournamentController");
const ControllerList = [
    new AuthController_1.default(),
    new ManagerController_1.default(),
    new TournamentController_1.default(),
    new TeamController_1.default(),
    new RankingController_1.default(),
    new PlayerController_1.default(),
    new MatchController_1.default(),
];
exports.default = ControllerList;
