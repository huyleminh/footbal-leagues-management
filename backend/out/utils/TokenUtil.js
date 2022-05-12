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
exports.verifyToken = exports.decryptRefreshToken = exports.generateIdToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const AppConfigs_1 = require("../shared/AppConfigs");
function generateAccessToken(data) {
    return jwt.sign(data, AppConfigs_1.AppConfigs.SECRET_ACCESS_TOKEN, {
        algorithm: "HS256",
        expiresIn: "1 hours",
    });
}
exports.generateAccessToken = generateAccessToken;
function generateRefreshToken(data) {
    const algorithm = "aes-256-cbc";
    const initVector = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(AppConfigs_1.AppConfigs.SECRET_REFRESH_TOKEN, "hex"), initVector);
    let token = cipher.update(data);
    token = Buffer.concat([token, cipher.final()]);
    return { iv: initVector.toString("hex"), refreshToken: token.toString("hex") };
}
exports.generateRefreshToken = generateRefreshToken;
function generateIdToken(userId, data) {
    return jwt.sign(Object.assign({}, data), AppConfigs_1.AppConfigs.SECRET_ID_TOKEN, {
        algorithm: "HS256",
        expiresIn: "7 days",
        subject: userId,
        issuer: AppConfigs_1.AppConfigs.APP_URL,
    });
}
exports.generateIdToken = generateIdToken;
function decryptRefreshToken(token, iv) {
    const algorithm = "aes-256-cbc";
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(AppConfigs_1.AppConfigs.SECRET_REFRESH_TOKEN, "hex"), Buffer.from(iv, "hex"));
    let decrypted = decipher.update(token, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}
exports.decryptRefreshToken = decryptRefreshToken;
function verifyToken(token, type) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            const key = type === "access_token" ? AppConfigs_1.AppConfigs.SECRET_ACCESS_TOKEN : AppConfigs_1.AppConfigs.SECRET_ID_TOKEN;
            jwt.verify(token, key, function (err, payload) {
                if (err) {
                    return reject(err);
                }
                resolve(payload);
            });
        });
    });
}
exports.verifyToken = verifyToken;
exports.default = {
    generateAccessToken,
    generateRefreshToken,
    generateIdToken,
    decryptRefreshToken,
    verifyToken,
};
