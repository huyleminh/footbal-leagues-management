"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const AppErrorHandler_1 = require("../shared/AppErrorHandler");
class AppController {
    constructor(_name) {
        this._name = _name;
        this._router = express.Router();
        this._errorHandler = new AppErrorHandler_1.ControllerErrorHandler(_name);
        this.binding();
        this.init();
    }
    get router() {
        return this._router;
    }
}
exports.default = AppController;
