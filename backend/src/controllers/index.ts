import AppController from "./AppController";
import AuthController from "./auth/AuthController";
import ManagerController from "./manager/ManagerController";

const ControllerList: AppController[] = [
    new AuthController(),
    new ManagerController(),
];
export default ControllerList;
