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
const axios_1 = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const AppConfigs_1 = require("../shared/AppConfigs");
const Logger_1 = require("../utils/Logger");
class ImgBBService {
    static readImageBase64(path) {
        const imageBuffer = fs.readFileSync(path);
        return Buffer.from(imageBuffer).toString("base64");
    }
    static uploadImageNoExpireAsync(imagePath) {
        return new Promise(function (resolve, reject) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const url = `${AppConfigs_1.AppConfigs.IMGBB_API_URL}?key=${AppConfigs_1.AppConfigs.IMGBB_API_KEY}`;
                    const image = ImgBBService.readImageBase64(imagePath);
                    const formData = new FormData();
                    formData.append("image", image);
                    Logger_1.Logger.info("ImgBBService-uploadImageNoExpireAsync-Start");
                    const res = yield axios_1.default.post(url, formData, {
                        headers: Object.assign({}, formData.getHeaders()),
                    });
                    Logger_1.Logger.info("ImgBBService-uploadImageNoExpireAsync-Success");
                    fs.unlink(imagePath, (err) => {
                        if (err) {
                            throw err;
                        }
                    });
                    if (res.data.success) {
                        resolve(res.data.data.url);
                    }
                    else {
                        reject("Upload error" + res.data);
                    }
                }
                catch (error) {
                    reject(error);
                }
            });
        });
    }
}
exports.default = ImgBBService;
