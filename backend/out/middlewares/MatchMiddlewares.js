"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEditData = exports.validateGetParams = exports.validateCreateMatchData = void 0;
const moment = require("moment");
const AppResponse_1 = require("../shared/AppResponse");
function validateCreateMatchData(req, res, next) {
    const { body } = req;
    const apiRes = new AppResponse_1.default(res, 400);
    if (!body.tournamentId || !body.tournamentId.toString().trim()) {
        return apiRes.data("Thiếu thông tin giải đấu").send();
    }
    if (!body.homeId || !body.homeId.toString().trim()) {
        return apiRes.data("Thiếu thông tin đội nhà").send();
    }
    if (!body.awayId || !body.awayId.toString().trim()) {
        return apiRes.data("Thiếu thông tin đội khách").send();
    }
    if (!body.stadiumName || !body.stadiumName.toString().trim()) {
        return apiRes.data("Thiếu thông tin sân vận động").send();
    }
    let round = parseInt(body.round);
    if (isNaN(round)) {
        return apiRes.data("Thiếu thông tin vòng đấu").send();
    }
    let scheduledDate = moment(body.scheduledDate);
    if (!scheduledDate.isValid()) {
        return apiRes.data("Ngày lên lịch không hợp lệ").send();
    }
    res.locals.payload = {
        tournamentId: body.tournamentId,
        homeId: body.homeId,
        awayId: body.awayId,
        stadiumName: body.stadiumName,
        round,
        scheduledDate: scheduledDate.toISOString(),
    };
    next();
}
exports.validateCreateMatchData = validateCreateMatchData;
function validateGetParams(req, res, next) {
    const { query } = req;
    let round = parseInt(query.round);
    if (isNaN(round) || round < 0) {
        round = 1;
    }
    if (!query.tournamentId || !query.tournamentId.toString().trim()) {
        new AppResponse_1.default(res, 400, "Thiếu thông tin giải đấu").send();
    }
    res.locals.payload = { round, tournamentId: query.tournamentId };
    next();
}
exports.validateGetParams = validateGetParams;
function validateEditData(req, res, next) {
    const { body } = req;
    const apiRes = new AppResponse_1.default(res, 400);
    let { scheduledDate, stadiumName, events, competitors } = body;
    if (!stadiumName || !stadiumName.toString().trim()) {
        return apiRes.data("Thiếu thông tin sân thi đấu").send();
    }
    const scheduledDateConverted = moment(scheduledDate);
    if (!scheduledDateConverted.isValid()) {
        return apiRes.data("Ngày thi đấu không hợp lệ").send();
    }
    if (events !== null && !Array.isArray(events)) {
        return apiRes.data("Sự kiện trận đấu không hợp lệ").send();
    }
    if (competitors !== null && !Array.isArray(competitors)) {
        return apiRes.data("Kết quả trận đấu không hợp lệ").send();
    }
    res.locals.payload = {
        stadiumName,
        scheduledDate: scheduledDateConverted.toISOString(),
        events,
        competitors,
    };
    next();
}
exports.validateEditData = validateEditData;
exports.default = { validateCreateMatchData, validateGetParams, validateEditData };
