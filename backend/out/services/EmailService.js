"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
const AppConfigs_1 = require("../shared/AppConfigs");
const EmailTemplate_1 = require("../templates/EmailTemplate");
const transport = nodemailer.createTransport({
    host: AppConfigs_1.EmailConfigs.MAIL_HOST,
    port: AppConfigs_1.EmailConfigs.MAIL_PORT,
    auth: {
        user: AppConfigs_1.EmailConfigs.MAILTRAP_USER,
        pass: AppConfigs_1.EmailConfigs.MAILTRAP_PASSWORD,
    },
});
class EmailService {
    static sendUsernamePassword(to, username, password) {
        return transport.sendMail({
            from: AppConfigs_1.EmailConfigs.MAIL_FROM_USER,
            to,
            subject: "Thông báo tài khoản",
            html: (0, EmailTemplate_1.newAccountTemplate)(username, password),
        });
    }
    static sendResetPassword(to, password) {
        return transport.sendMail({
            from: AppConfigs_1.EmailConfigs.MAIL_FROM_USER,
            to,
            subject: "Cấp lại mật khẩu",
            html: (0, EmailTemplate_1.resetPasswordTemplate)(password),
        });
    }
}
exports.default = EmailService;
