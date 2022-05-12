"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserModel_1 = require("./UserModel");
const UserTokenSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: UserModel_1.default },
    initVector: { type: String, required: true },
    refreshToken: { type: String, required: true },
    expireDate: { type: Date, required: true },
    createdDate: {
        type: Date,
        required: true,
        default: function () {
            return new Date();
        },
    },
});
exports.default = (0, mongoose_1.model)("user_token", UserTokenSchema);
