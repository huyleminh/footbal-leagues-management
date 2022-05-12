"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRergisterData = exports.verifyGetParams = void 0;
const UserModel_1 = require("../models/UserModel");
const AppResponse_1 = require("../shared/AppResponse");
const CommonConsts_1 = require("../shared/CommonConsts");
function verifyGetParams(req, res, next) {
    const { limit, page, status, searchType, query } = req.query;
    let limitItems = parseInt(limit);
    let currentPage = parseInt(page);
    let userStatus = parseInt(status);
    let searchTypeNum = parseInt(searchType);
    if (isNaN(limitItems)) {
        limitItems = CommonConsts_1.MAX_ITEM_PER_PAGE;
    }
    if (isNaN(currentPage)) {
        currentPage = 1;
    }
    if (isNaN(userStatus)) {
        userStatus = undefined;
    }
    if (isNaN(searchTypeNum) || UserModel_1.USER_SEARCH_TYPE_ENUM[searchTypeNum] === undefined) {
        searchTypeNum = undefined;
    }
    res.locals.payload = {
        limitItems,
        currentPage,
        userStatus,
        searchTypeNum,
        query,
    };
    next();
}
exports.verifyGetParams = verifyGetParams;
function validateRergisterData(req, res, next) {
    var _a;
    const { body } = req;
    const apiResponse = new AppResponse_1.default(res, 400);
    let { username, password, email, fullname, address, status } = body;
    if (!username || !username.toString().trim()) {
        return apiResponse.data("Thiếu tên đăng nhập").send();
    }
    if (!password || !password.toString().trim()) {
        return apiResponse.data("Thiếu mật khẩu").send();
    }
    if (!email || !email.toString().trim()) {
        return apiResponse.data("Thiếu email").send();
    }
    if (!fullname || !fullname.toString().trim()) {
        return apiResponse.data("Thiếu họ tên").send();
    }
    if (status === null || status === undefined || UserModel_1.USER_STATUS[status] === undefined) {
        status = UserModel_1.USER_STATUS.ACTIVE;
    }
    res.locals.payload = {
        username: username.toString().trim(),
        password: password.toString().trim(),
        email: email.toString().trim(),
        fullname: fullname.toString().trim(),
        address: (_a = address === null || address === void 0 ? void 0 : address.toString()) === null || _a === void 0 ? void 0 : _a.trim(),
        status: status,
    };
    next();
}
exports.validateRergisterData = validateRergisterData;
exports.default = { verifyGetParams, validateRergisterData };
