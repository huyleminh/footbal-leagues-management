"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLogStream = exports.Logger = exports.transport = void 0;
const moment = require("moment");
const winston = require("winston");
require("winston-daily-rotate-file");
const transport = new winston.transports.DailyRotateFile({
    filename: "log-%DATE%",
    extension: ".log",
    dirname: "logs",
    datePattern: "YYYY-MM-DD",
    maxSize: "20m",
});
exports.transport = transport;
const msgFormat = winston.format.printf(({ level, message, timestamp }) => {
    if (typeof message === "object") {
        return `[${timestamp}] : [${level}] : ${JSON.stringify(message)}\n`;
    }
    return `[${timestamp}] : [${level}] : ${message}`;
});
const Logger = winston.createLogger({
    transports: [transport, new winston.transports.Console()],
    format: winston.format.combine(winston.format.timestamp({
        format: () => {
            return moment(new Date()).format("YYYY-MM-DD HH:mm:ss.SSS ZZ");
        },
    }), msgFormat),
});
exports.Logger = Logger;
class AppLogStream {
    write(msg) {
        Logger.info(msg);
    }
}
exports.AppLogStream = AppLogStream;
