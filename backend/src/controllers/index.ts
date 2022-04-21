import AppController from "./AppController";
import AuthController from "./auth/AuthController";
import ManagerController from "./manager/ManagerController";
import TournamentController from "./tournament/TournamentController";

const ControllerList: AppController[] = [
    new AuthController(),
    new ManagerController(),
    new TournamentController(),
];
export default ControllerList;
