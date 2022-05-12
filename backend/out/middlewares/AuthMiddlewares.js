"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyManagerRole = exports.verifyAdminRole = exports.verifyUserToken = exports.validateRefreshTokenData = exports.validateLoginData = void 0;
const UserModel_1 = require("../models/UserModel");
const AppResponse_1 = require("../shared/AppResponse");
const TokenUtil_1 = require("../utils/TokenUtil");
function validateLoginData(req, res, next) {
    const { body } = req;
    const apiResponse = new AppResponse_1.default(res, 400);
    let { username, password } = body;
    if (!username || !username.toString().trim()) {
        return apiResponse.data("Thiếu tên đăng nhập").send();
    }
    if (!password || !password.toString().trim()) {
        return apiResponse.data("Thiếu mật khẩu").send();
    }
    res.locals.payload = {
        username,
        password,
    };
    next();
}
exports.validateLoginData = validateLoginData;
function validateRefreshTokenData(req, res, next) {
    const { authorization } = req.headers;
    const { refreshToken } = req.body;
    const apiRes = new AppResponse_1.default(res, 401);
    if (!authorization || !refreshToken) {
        return apiRes.send();
    }
    const idToken = authorization.split(" ")[1];
    if (!idToken) {
        return apiRes.send();
    }
    res.locals.payload = {
        refreshToken,
        idToken,
    };
    next();
}
exports.validateRefreshTokenData = validateRefreshTokenData;
function verifyUserToken(req, res, next) {
    const { path } = req;
    if (path && (path.match("/auth") || path.match("/public"))) {
        next();
        return;
    }
    const { authorization } = req.headers;
    const apiRes = new AppResponse_1.default(res, 401);
    if (!authorization) {
        return apiRes.send();
    }
    const accessToken = authorization.split(" ")[1];
    if (!accessToken) {
        return apiRes.send();
    }
    TokenUtil_1.default.verifyToken(accessToken, "access_token")
        .then((data) => {
        res.locals.tokenPayload = data;
        next();
    })
        .catch((err) => {
        if (err.message === "jwt expired") {
            apiRes.data("Token expired");
        }
        apiRes.send();
    });
}
exports.verifyUserToken = verifyUserToken;
function verifyAdminRole(req, res, next) {
    const { tokenPayload } = res.locals;
    if (tokenPayload.role === UserModel_1.USER_ROLE_ENUM.ADMIN) {
        res.locals.tokenPayload = tokenPayload;
        return next();
    }
    return new AppResponse_1.default(res, 403, "Bạn không có quyền truy cập chức năng này").send();
}
exports.verifyAdminRole = verifyAdminRole;
function verifyManagerRole(req, res, next) {
    const { tokenPayload } = res.locals;
    if (tokenPayload.role === UserModel_1.USER_ROLE_ENUM.LOCAL_MANAGER) {
        res.locals.tokenPayload = tokenPayload;
        return next();
    }
    return new AppResponse_1.default(res, 403, "Bạn không có quyền truy cập chức năng này").send();
}
exports.verifyManagerRole = verifyManagerRole;
exports.default = {
    validateLoginData,
    validateRefreshTokenData,
    verifyUserToken,
    verifyAdminRole,
    verifyManagerRole,
};
