"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const multer = require("multer");
const Logger_1 = require("../utils/Logger");
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        try {
            const uploadPath = __dirname.replace("src", "public").replace("middlewares", "uploads");
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath);
            }
            cb(null, uploadPath);
        }
        catch (error) {
            Logger_1.Logger.error("Upload image error:", error);
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + Math.round(Math.random() * 1e9) + `.${file.mimetype.split("/")[1]}`);
    },
});
const DiskUploadMiddleware = multer({
    storage: diskStorage,
    fileFilter: function (req, file, cb) {
        try {
            if ([...file.mimetype.matchAll(/^(image\/)\w*/g)].length !== 0) {
                cb(null, true);
            }
            else {
                cb(null, false);
            }
        }
        catch (error) {
            Logger_1.Logger.error(error);
        }
    },
});
exports.default = DiskUploadMiddleware;
