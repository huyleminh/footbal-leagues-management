"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_SEARCH_TYPE_ENUM = exports.USER_STATUS = exports.USER_ROLE_ENUM = void 0;
const mongoose_1 = require("mongoose");
var USER_ROLE_ENUM;
(function (USER_ROLE_ENUM) {
    USER_ROLE_ENUM[USER_ROLE_ENUM["ADMIN"] = 0] = "ADMIN";
    USER_ROLE_ENUM[USER_ROLE_ENUM["LOCAL_MANAGER"] = 1] = "LOCAL_MANAGER";
})(USER_ROLE_ENUM = exports.USER_ROLE_ENUM || (exports.USER_ROLE_ENUM = {}));
var USER_STATUS;
(function (USER_STATUS) {
    USER_STATUS[USER_STATUS["INACTIVE"] = 0] = "INACTIVE";
    USER_STATUS[USER_STATUS["ACTIVE"] = 1] = "ACTIVE";
})(USER_STATUS = exports.USER_STATUS || (exports.USER_STATUS = {}));
var USER_SEARCH_TYPE_ENUM;
(function (USER_SEARCH_TYPE_ENUM) {
    USER_SEARCH_TYPE_ENUM[USER_SEARCH_TYPE_ENUM["FULLNAME"] = 0] = "FULLNAME";
    USER_SEARCH_TYPE_ENUM[USER_SEARCH_TYPE_ENUM["EMAIL"] = 1] = "EMAIL";
})(USER_SEARCH_TYPE_ENUM = exports.USER_SEARCH_TYPE_ENUM || (exports.USER_SEARCH_TYPE_ENUM = {}));
const UserSchema = new mongoose_1.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    fullname: { type: String, required: true },
    address: { type: String },
    role: {
        type: Number,
        enum: [USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.LOCAL_MANAGER],
        default: USER_ROLE_ENUM.LOCAL_MANAGER,
        required: true,
    },
    status: {
        type: Number,
        enum: [USER_STATUS.INACTIVE, USER_STATUS.ACTIVE],
        default: USER_STATUS.ACTIVE,
    },
    lastLockedDate: { type: Date },
    createdDate: {
        type: Date,
        default: function () {
            return new Date();
        },
    },
});
exports.default = (0, mongoose_1.model)("user", UserSchema);
