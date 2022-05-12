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
const moment = require("moment");
const AuthMiddlewares_1 = require("../../middlewares/AuthMiddlewares");
const UserModel_1 = require("../../models/UserModel");
const UserTokenModel_1 = require("../../models/UserTokenModel");
const AppResponse_1 = require("../../shared/AppResponse");
const BcryptUtil_1 = require("../../utils/BcryptUtil");
const Logger_1 = require("../../utils/Logger");
const TokenUtil_1 = require("../../utils/TokenUtil");
const AppController_1 = require("../AppController");
class AuthController extends AppController_1.default {
    constructor() {
        super("AuthController");
    }
    binding() {
        this.postLoginAsync = this.postLoginAsync.bind(this);
        this.postRefreshTokenAsync = this.postRefreshTokenAsync.bind(this);
        this.postLogoutAsync = this.postLogoutAsync.bind(this);
        this.postRefreshTokenAsync = this.postRefreshTokenAsync.bind(this);
    }
    init() {
        this._router.post("/auth/login", [AuthMiddlewares_1.default.validateLoginData], this.postLoginAsync);
        this._router.post("/auth/refresh", [AuthMiddlewares_1.default.validateRefreshTokenData], this.postRefreshTokenAsync);
        this._router.post("/auth/logout", this.postLogoutAsync);
        this._router.get("/verify-token", this.getVerifyTokenAsync);
    }
    postLoginAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = res.locals.payload;
            const apiResponse = new AppResponse_1.default(res);
            try {
                const user = yield UserModel_1.default.findOne({ username });
                if (user === null || !BcryptUtil_1.default.verifyHashedString(password, user.password)) {
                    return apiResponse.code(400).data("Tên đăng nhập hoặc mật khẩu không đúng").send();
                }
                const accessToken = TokenUtil_1.default.generateAccessToken({
                    scope: "leagues:all",
                    role: user.role,
                    userId: user._id,
                });
                const { refreshToken, iv } = TokenUtil_1.default.generateRefreshToken(JSON.stringify({
                    scope: "leagues:all",
                    role: user.role,
                    userId: user._id,
                }));
                const idToken = TokenUtil_1.default.generateIdToken(user._id.toString(), {
                    email: user.email,
                    fullname: user.fullname,
                });
                UserTokenModel_1.default.deleteMany({ userId: user._id })
                    .exec()
                    .catch((err) => {
                    Logger_1.Logger.error({
                        message: {
                            class: "AuthController",
                            method: "postLoginAsync",
                            msg: err.message,
                        },
                    });
                });
                UserTokenModel_1.default.create({
                    userId: user._id,
                    refreshToken,
                    initVector: iv,
                    expireDate: moment().add(7, "days").toDate(),
                }).catch((err) => {
                    Logger_1.Logger.error({
                        message: {
                            class: "AuthController",
                            method: "postLoginAsync",
                            msg: err.message,
                        },
                    });
                });
                apiResponse
                    .data({
                    token: {
                        accessToken,
                        refreshToken,
                        idToken,
                        expireIn: 60 * 60 * 1000,
                        expireAt: moment().add(60, "minutes").toISOString(),
                    },
                    user: {
                        fullname: user.fullname,
                    },
                })
                    .send();
            }
            catch (error) {
                this._errorHandler.handle(error.message);
                apiResponse.code(400).data("Không thể đăng nhập, vui lòng thử lại").send();
            }
        });
    }
    postRefreshTokenAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { refreshToken, idToken } = res.locals.payload;
            const apiRes = new AppResponse_1.default(res);
            try {
                const payload = yield TokenUtil_1.default.verifyToken(idToken, "id_token");
                const userToken = yield UserTokenModel_1.default.findOne({ userId: payload.sub });
                if (userToken === null) {
                    throw new Error(`User is not logged in or Invalid idToken: ${idToken}`);
                }
                if (refreshToken !== userToken.refreshToken ||
                    moment().isAfter(moment(userToken.expireDate))) {
                    yield UserTokenModel_1.default.findByIdAndRemove(userToken._id);
                    throw new Error(`Malicious refresh token: ${refreshToken}`);
                }
                const data = TokenUtil_1.default.decryptRefreshToken(userToken.refreshToken, userToken.initVector);
                const accessToken = TokenUtil_1.default.generateAccessToken(JSON.parse(data));
                const newRefreshToken = TokenUtil_1.default.generateRefreshToken(data);
                UserTokenModel_1.default.findByIdAndUpdate(userToken._id, {
                    refreshToken: newRefreshToken.refreshToken,
                    initVector: newRefreshToken.iv,
                    expireDate: moment().add(7, "days").toDate(),
                }).exec();
                apiRes
                    .code(200)
                    .data({
                    accessToken,
                    refreshToken: newRefreshToken.refreshToken,
                    idToken,
                    expireIn: 60 * 60 * 1000,
                    expireAt: moment().add(60, "minutes").toISOString(),
                })
                    .send();
            }
            catch (error) {
                this._errorHandler.handle(error.message);
                apiRes
                    .code(401)
                    .data("Không thể làm mới phiên đăng nhập, vui lòng đăng nhập lại")
                    .send();
            }
        });
    }
    postLogoutAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { authorization } = req.headers;
            const { refreshToken } = req.body;
            const apiRes = new AppResponse_1.default(res, 204);
            if (!authorization || !refreshToken) {
                return apiRes.send();
            }
            const idToken = authorization.split(" ")[1];
            if (!idToken) {
                return apiRes.send();
            }
            try {
                const payload = yield TokenUtil_1.default.verifyToken(idToken, "id_token");
                yield UserTokenModel_1.default.findOneAndRemove({ userId: payload.sub });
            }
            catch (error) {
                this._errorHandler.handle(error.message);
            }
            apiRes.send();
        });
    }
    getVerifyTokenAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tokenPayload } = res.locals;
            new AppResponse_1.default(res, 200, {
                scope: tokenPayload.scope,
                role: tokenPayload.role,
            }).send();
        });
    }
}
exports.default = AuthController;
