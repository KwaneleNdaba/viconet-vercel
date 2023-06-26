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
exports.UpdateNotification = exports.AddNotification = exports.GetNotificationByTargetUser = exports.GetNotificationByTargetAndReference = exports.GetNotificationById = exports.GetAllNotifications = void 0;
const notifications_1 = require("../models/notifications");
const emailService_1 = require("../services/emailService");
const GetAllNotifications = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const notifications = yield notifications_1.Notification.find({});
            return notifications;
        }
        catch (e) {
            return { code: 500, message: "error", object: e };
        }
    });
};
exports.GetAllNotifications = GetAllNotifications;
const GetNotificationById = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const organisation = yield notifications_1.Notification.find({ _id: id });
            const notification = organisation[0];
            return notification;
        }
        catch (e) {
            return { code: 500, message: "error", object: e };
        }
    });
};
exports.GetNotificationById = GetNotificationById;
const GetNotificationByTargetAndReference = function (userId, projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const _notification = yield notifications_1.Notification.find({ targetUser: userId, reference: projectId });
            const notification = _notification[0];
            return notification._doc;
        }
        catch (e) {
            return { code: 500, message: "error", object: e };
        }
    });
};
exports.GetNotificationByTargetAndReference = GetNotificationByTargetAndReference;
const GetNotificationByTargetUser = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const organisation = yield notifications_1.Notification.find({ targetUser: id });
            const notification = organisation[0];
            return notification;
        }
        catch (e) {
            return { code: 500, message: "error", object: e };
        }
    });
};
exports.GetNotificationByTargetUser = GetNotificationByTargetUser;
const AddNotification = function (notification) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (notification.type == "0") {
                const sendEmail = yield (0, emailService_1.sendMail)(notification.email, "New Invite", `You have been invited to join a group, view more here`, `You have been invited to join a group, view more here. 
            <br/>
            <a href="personnel/notifications/"> View Notifications</a>
            <br/>
            <a href="/api/acceptinvite/${notification.targetUser}/${notification.reference}"> Accept</a>
            <br/>
            <a href="/api/declineinvite/${notification.targetUser}/${notification.reference}"> Decline</a>
            `);
            }
            const noti = notifications_1.Notification.build(notification);
            yield noti.save();
            return noti;
        }
        catch (e) {
            return e;
        }
    });
};
exports.AddNotification = AddNotification;
const UpdateNotification = function (notification) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const noti = notifications_1.Notification.build(notification);
            yield noti.updateOne(noti);
            return noti;
        }
        catch (e) {
            return e;
        }
    });
};
exports.UpdateNotification = UpdateNotification;
//# sourceMappingURL=notificatonsRepository.js.map