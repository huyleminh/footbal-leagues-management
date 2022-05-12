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
const escape_string_regexp_1 = require("../../libs/escape-string-regexp");
const AuthMiddlewares_1 = require("../../middlewares/AuthMiddlewares");
const ManagerMiddlewares_1 = require("../../middlewares/ManagerMiddlewares");
const TournamentModel_1 = require("../../models/TournamentModel");
const UserModel_1 = require("../../models/UserModel");
const UserTokenModel_1 = require("../../models/UserTokenModel");
const EmailService_1 = require("../../services/EmailService");
const AppResponse_1 = require("../../shared/AppResponse");
const BcryptUtil_1 = require("../../utils/BcryptUtil");
const AppController_1 = require("../AppController");
class ManagerController extends AppController_1.default {
    constructor() {
        super("ManagerController");
    }
    binding() {
        this.getLocalManagerListAsync = this.getLocalManagerListAsync.bind(this);
        this.getLocalManagerByIdAsync = this.getLocalManagerByIdAsync.bind(this);
        this.postRegisterLocalManagerAsync = this.postRegisterLocalManagerAsync.bind(this);
        this.patchResetPasswordAsync = this.patchResetPasswordAsync.bind(this);
        this.deleteLocalManageAsync = this.deleteLocalManageAsync.bind(this);
    }
    init() {
        this._router.get("/managers", [AuthMiddlewares_1.default.verifyAdminRole, ManagerMiddlewares_1.default.verifyGetParams], this.getLocalManagerListAsync);
        this._router.get("/managers/:id", [AuthMiddlewares_1.default.verifyAdminRole], this.getLocalManagerByIdAsync);
        this._router.post("/managers", [AuthMiddlewares_1.default.verifyAdminRole, ManagerMiddlewares_1.default.validateRergisterData], this.postRegisterLocalManagerAsync);
        this._router.patch("/managers/:id/password", [AuthMiddlewares_1.default.verifyAdminRole], this.patchResetPasswordAsync);
        this._router.delete("/managers/:id", [AuthMiddlewares_1.default.verifyAdminRole], this.deleteLocalManageAsync);
    }
    getLocalManagerListAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { payload: { limitItems, currentPage, userStatus, searchTypeNum, query }, } = res.locals;
            const apiRes = new AppResponse_1.default(res);
            const filter = {
                role: UserModel_1.USER_ROLE_ENUM.LOCAL_MANAGER,
                status: userStatus,
            };
            if (userStatus === undefined) {
                delete filter.status;
            }
            if (searchTypeNum === UserModel_1.USER_SEARCH_TYPE_ENUM.FULLNAME) {
                filter["fullname"] = { $regex: (0, escape_string_regexp_1.default)(query) };
            }
            else if (searchTypeNum === UserModel_1.USER_SEARCH_TYPE_ENUM.EMAIL) {
                filter["email"] = { $regex: (0, escape_string_regexp_1.default)(query) };
            }
            try {
                const userList = yield UserModel_1.default.find(filter, null, {
                    limit: limitItems,
                    skip: limitItems * (currentPage - 1),
                })
                    .select(["-__v", "-password"])
                    .exec();
                const totalRecord = yield UserModel_1.default.find(filter).countDocuments();
                const metadata = {
                    createdDate: new Date(),
                    pagination: {
                        page: currentPage,
                        pageSize: userList.length,
                        totalRecord,
                    },
                };
                apiRes.code(200).data(userList).metadata(metadata).send();
            }
            catch (error) {
                this._errorHandler.handle(error.message);
                apiRes.code(400).data("Không thể lấy danh sách manager").send();
            }
        });
    }
    getLocalManagerByIdAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const apiRes = new AppResponse_1.default(res, 200, "OK");
            try {
                const user = yield UserModel_1.default.findById(id).select(["-__v", "-password"]).exec();
                if (user === null) {
                    return apiRes.code(400).data("Không tìm thấy quản lý").send();
                }
                const tournamentList = yield TournamentModel_1.default.find({ createdBy: user._id }).exec();
                apiRes.data({ user, tournamentList }).send();
            }
            catch (error) {
                this._errorHandler.handle(error.message);
                apiRes.code(400).data("Không thể lấy danh sách chi tiết manager").send();
            }
        });
    }
    postRegisterLocalManagerAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { payload } = res.locals;
            const apiRes = new AppResponse_1.default(res);
            try {
                const allRes = yield Promise.allSettled([
                    UserModel_1.default.findOne({ username: payload.username }),
                    UserModel_1.default.findOne({ email: payload.email }),
                ]);
                const allResMsg = ["Tên đăng nhập đã tồn tại", "Email đã tồn tại"];
                for (let i = 0; i < allRes.length; ++i) {
                    const result = allRes[i];
                    if (result.status === "rejected") {
                        throw new Error(result.reason);
                    }
                    else {
                        if (result.value !== null) {
                            return apiRes.code(400).data(allResMsg[i]).send();
                        }
                    }
                }
                yield UserModel_1.default.create(payload);
                EmailService_1.default.sendUsernamePassword(payload.email, payload.username, payload.password);
                apiRes.code(201).send();
            }
            catch (error) {
                this._errorHandler.handle(error.message);
                apiRes.code(400).data("Không thể tạo mới quản lý, vui lòng thử lại").send();
            }
        });
    }
    patchResetPasswordAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { password } = req.body;
            const apiRes = new AppResponse_1.default(res);
            if (!password || !password.toString().trim()) {
                return apiRes.code(400).data("Thiếu mật khẩu").send();
            }
            try {
                const queryResponse = yield UserModel_1.default.findByIdAndUpdate(id, {
                    password: BcryptUtil_1.default.generateHash(password.trim()),
                }).exec();
                if (queryResponse === null) {
                    return apiRes.code(400).data("Không tìm thấy quản lý").send();
                }
                UserTokenModel_1.default.findByIdAndRemove(id).exec();
                EmailService_1.default.sendResetPassword(queryResponse.email, password);
                apiRes.code(200).data("Cấp lại mật khẩu thành công").send();
            }
            catch (error) {
                this._errorHandler.handle(error.message);
                apiRes.code(400).data("Không thể cấp lại mật khẩu").send();
            }
        });
    }
    deleteLocalManageAsync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const apiRes = new AppResponse_1.default(res);
            try {
                const user = yield UserModel_1.default.findById(id).exec();
                if (user === null) {
                    return apiRes.code(400).data("Không tìm thấy quản lý").send();
                }
                let data = "";
                const tournamentList = yield TournamentModel_1.default.find({ createdBy: user._id }).exec();
                if (tournamentList !== null && tournamentList.length > 0) {
                    yield UserModel_1.default.findByIdAndUpdate(user._id, { status: UserModel_1.USER_STATUS.INACTIVE });
                    data = "Vô hiệu hóa quản lý thành công";
                }
                else {
                    yield UserModel_1.default.findByIdAndRemove(user._id);
                    data = "Xóa quản lý thành công";
                }
                yield UserTokenModel_1.default.findByIdAndRemove(user._id);
                apiRes.code(200).data(data).send();
            }
            catch (error) {
                this._errorHandler.handle(error.message);
                apiRes.code(400).data("Không thể xóa quản lý").send();
            }
        });
    }
}
exports.default = ManagerController;
