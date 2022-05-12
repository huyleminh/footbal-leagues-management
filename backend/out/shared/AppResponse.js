"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppResponse {
    constructor(res, code, data, metadata) {
        this._res = res;
        this._code = code || 200;
        this._message = this.mappMessageByCode(this._code);
        this._data = data;
        this._metadata = metadata || {
            createdDate: new Date(),
        };
    }
    code(code) {
        this._code = code;
        this._message = this.mappMessageByCode(code);
        return this;
    }
    data(dataResponse) {
        this._data = dataResponse;
        return this;
    }
    message(msg) {
        this._message = msg;
        return this;
    }
    metadata(metadata) {
        this._metadata = metadata;
        return this;
    }
    send() {
        this._res.status(200).json({
            code: this._code,
            message: this._message,
            data: this._data,
            metadata: this._metadata,
        });
    }
    mappMessageByCode(code) {
        switch (code) {
            case 200:
                return "OK";
            case 201:
                return "Created";
            case 202:
                return "Accepted";
            case 204:
                return "No Content";
            case 400:
                return "Bad Request";
            case 401:
                return "Unauthorized";
            case 403:
                return "Forbidden";
            case 404:
                return "Not Found";
            case 500:
                return "Internal Server Error";
            default:
                return "Unknown Message";
        }
    }
}
exports.default = AppResponse;
