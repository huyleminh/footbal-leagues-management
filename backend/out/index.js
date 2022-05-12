"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors = require("cors");
const express = require("express");
const helmet_1 = require("helmet");
const mongoose = require("mongoose");
const morgan = require("morgan");
const controllers_1 = require("./controllers");
const AuthMiddlewares_1 = require("./middlewares/AuthMiddlewares");
const AppConfigs_1 = require("./shared/AppConfigs");
const Logger_1 = require("./utils/Logger");
class Server {
    constructor() {
        this._app = express();
        this.PORT = AppConfigs_1.AppConfigs.PORT;
    }
    initializeGlobalMiddlewares() {
        this._app.use("/public", express.static("public"));
        this._app.use(express.json());
        this._app.use(express.urlencoded({ extended: true }));
        this._app.use((0, helmet_1.default)());
        this._app.use(cors({
            origin: AppConfigs_1.AppConfigs.AUTH_CLIENT_URLS,
            credentials: true,
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
            allowedHeaders: [
                "Origin",
                "X-Requested-With",
                "Content-Type",
                "Accept",
                "Authorization",
            ],
        }));
        this._app.use(morgan("combined", {
            stream: new Logger_1.AppLogStream(),
        }));
        this._app.use(AuthMiddlewares_1.default.verifyUserToken);
    }
    initializeControllers() {
        controllers_1.default.forEach((controller) => {
            this._app.use("/", controller.router);
        });
    }
    initializeErrorHandlerMiddlewares() {
        this._app.use((req, res, next) => {
            res.status(404).send("Not Found");
        });
        this._app.use((err, req, res, next) => {
            Logger_1.Logger.error(err.message);
            res.status(500).send("Internal Server Error");
        });
    }
    initializeDBConnectionAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mongoose.connect(AppConfigs_1.AppConfigs.DB_CONNECTION, {
                    autoIndex: true,
                    dbName: "football_leagues",
                });
                Logger_1.Logger.info("Connected to mongodb");
            }
            catch (error) {
                Logger_1.Logger.error("Failed to connect to mongodb: ", error);
                setTimeout(() => {
                    this.initializeDBConnectionAsync();
                }, 5000);
            }
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.initializeGlobalMiddlewares();
            this.initializeControllers();
            yield this.initializeDBConnectionAsync();
            this.initializeErrorHandlerMiddlewares();
            this._app.listen(this.PORT, () => {
                Logger_1.Logger.info(`Server is listening on port ${this.PORT}`);
            });
        });
    }
}
exports.default = Server;
const appServer = new Server();
appServer.start();
