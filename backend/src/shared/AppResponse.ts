import { Response } from "express";

export default class AppResponse {
    private _res: Response;
    private _statusCode?: number;
    private _data: any;
    private _message?: string;

    /**
     *
     * @param res
     * @param statusCode
     * @param message
     * @param data
     */
    constructor(res: Response, statusCode?: number, message?: string, data?: any) {
        this._res = res;
        this._statusCode = statusCode ? statusCode : 200;
        this._message = message;
        this._data = data;
    }

    public statusCode(code: number): this {
        this._statusCode = code;
        return this;
    }

    public data(dataResponse: any): this {
        this._data = dataResponse;
        return this;
    }

    public message(msg: string): this {
        this._message = msg;
        return this;
    }

    public sendNotFound() {
        return this._res.status(404).send();
    }

    public sendInternalError() {
        return this._res.status(500).send();
    }

    public send() {
        this._res.status(200).json({
            statusCode: this._statusCode,
            message: this._message,
            data: this._data,
        });
    }
}
