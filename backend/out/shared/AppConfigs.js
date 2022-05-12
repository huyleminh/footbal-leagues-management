"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailConfigs = exports.AppConfigs = void 0;
const dotenv = require("dotenv");
dotenv.config();
class AppConfigs {
    static get AUTH_CLIENT_URLS() {
        return process.env.AUTH_CLIENT_URLS ? process.env.AUTH_CLIENT_URLS.split(" ") : "*";
    }
    static get PORT() {
        return process.env.PORT ? +process.env.PORT : 5000;
    }
    static get APP_URL() {
        return process.env.APP_URL || "";
    }
    static get DB_CONNECTION() {
        return process.env.DB_CONNECTION || "";
    }
    static get SECRET_ACCESS_TOKEN() {
        return process.env.SECRET_ACCESS_TOKEN || "";
    }
    static get SECRET_REFRESH_TOKEN() {
        return process.env.SECRET_REFRESH_TOKEN || "";
    }
    static get SECRET_ID_TOKEN() {
        return process.env.SECRET_ID_TOKEN || "";
    }
    static get IMGBB_API_KEY() {
        return process.env.IMGBB_API_KEY || "";
    }
    static get IMGBB_API_URL() {
        return process.env.IMGBB_API_URL || "";
    }
}
exports.AppConfigs = AppConfigs;
class EmailConfigs {
    static get MAILTRAP_USER() {
        return process.env.MAILTRAP_USER || "";
    }
    static get MAILTRAP_PASSWORD() {
        return process.env.MAILTRAP_PASSWORD || "";
    }
    static get MAIL_HOST() {
        return process.env.MAIL_HOST || "";
    }
    static get MAIL_PORT() {
        return process.env.MAIL_PORT ? +process.env.MAIL_PORT : 2525;
    }
    static get MAIL_FROM_USER() {
        return process.env.MAIL_FROM_USER || "";
    }
}
exports.EmailConfigs = EmailConfigs;
