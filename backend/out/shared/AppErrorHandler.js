"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerErrorHandler = void 0;
const Logger_1 = require("../utils/Logger");
class AppErrorHandler {
    constructor(_scope) {
        this._scope = _scope;
    }
}
exports.default = AppErrorHandler;
class ControllerErrorHandler extends AppErrorHandler {
    constructor(_name) {
        super("Controller");
        this._name = _name;
    }
    handle(message) {
        Logger_1.Logger.error({ message: { scope: this._scope, class: this._name, msg: message } });
    }
}
exports.ControllerErrorHandler = ControllerErrorHandler;
