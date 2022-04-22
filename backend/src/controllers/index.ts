import AppController from "./AppController";
import AuthController from "./auth/AuthController";
import ManagerController from "./manager/ManagerController";
import TeamController from "./team/TeamController";
import TournamentController from "./tournament/TournamentController";

const ControllerList: AppController[] = [
    new AuthController(),
    new ManagerController(),
    new TournamentController(),
    new TeamController(),
];
export default ControllerList;
