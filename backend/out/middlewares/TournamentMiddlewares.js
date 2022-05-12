"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGetParams = exports.validateCreateTournamentData = void 0;
const TournamentModel_1 = require("../models/TournamentModel");
const AppResponse_1 = require("../shared/AppResponse");
const CommonConsts_1 = require("../shared/CommonConsts");
function validateCreateTournamentData(req, res, next) {
    const body = req.body;
    const apiRes = new AppResponse_1.default(res, 400);
    if (!body.name || !body.name.toString().trim()) {
        return apiRes.data("Thiếu tên giải đấu").send();
    }
    if (!body.sponsorName || !body.sponsorName.toString().trim()) {
        return apiRes.data("Thiếu tên nhà tài trợ").send();
    }
    let config = body.config;
    try {
        config = JSON.parse(config);
    }
    catch (error) {
        console.log(error);
        config = {};
    }
    if (Object.keys(body.config).length === 0) {
        return apiRes.data("Thiếu cấu hình giải đấu").send();
    }
    let status;
    let scheduledDate;
    if (TournamentModel_1.TOURNAMENT_STATUS_ENUM[body.status]) {
        status = body.status;
    }
    if (body.scheduledDate && status !== undefined) {
        scheduledDate = body.scheduledDate;
    }
    res.locals.payload = {
        name: body.name,
        sponsorName: body.sponsorName,
        config,
        status,
        scheduledDate,
    };
    next();
}
exports.validateCreateTournamentData = validateCreateTournamentData;
function validateGetParams(req, res, next) {
    const { page, limit, status, query, searchType, selfAssigned } = req.query;
    let limitItems = parseInt(limit);
    let currentPage = parseInt(page);
    let tournamentStatus = parseInt(status);
    let searchTypeNum = parseInt(searchType);
    let isSelfAssigned = selfAssigned && selfAssigned === "true" ? true : undefined;
    let searchQuery = query;
    if (isNaN(limitItems)) {
        limitItems = CommonConsts_1.MAX_ITEM_PER_PAGE;
    }
    if (isNaN(currentPage)) {
        currentPage = 1;
    }
    if (isNaN(tournamentStatus)) {
        tournamentStatus = undefined;
    }
    if (isNaN(searchTypeNum) || TournamentModel_1.TOURNAMENT_SEARCH_TYPE_ENUM[searchTypeNum] === undefined) {
        searchTypeNum = undefined;
        searchQuery = undefined;
    }
    if (query === undefined || query === null) {
        searchTypeNum = undefined;
        searchQuery = undefined;
    }
    res.locals.payload = {
        limitItems,
        currentPage,
        tournamentStatus,
        searchTypeNum,
        query: searchQuery,
        isSelfAssigned,
    };
    next();
}
exports.validateGetParams = validateGetParams;
exports.default = { validateCreateTournamentData, validateGetParams };
