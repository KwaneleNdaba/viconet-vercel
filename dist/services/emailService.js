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
exports.sendMail = void 0;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey("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");
function sendMail(to, subject, text, html) {
    return __awaiter(this, void 0, void 0, function* () {
        const msg = {
            to: to,
            from: 'dev1@webparam.org',
            subject: subject,
            text: text,
            html: html,
        };
        const res = yield sgMail.send(msg);
    });
}
exports.sendMail = sendMail;
//# sourceMappingURL=emailService.js.map