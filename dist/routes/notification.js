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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRouter = void 0;
const express_1 = __importDefault(require("express"));
const notificatonsRepository_1 = require("../repositories/notificatonsRepository");
const router = express_1.default.Router();
exports.notificationRouter = router;
router.get('/api/notification', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, notificatonsRepository_1.GetAllNotifications)();
    return res.status(200).send(user);
}));
router.get('/api/notification/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) { // valid ObjectId
        const user = yield (0, notificatonsRepository_1.GetNotificationById)(id);
        res.header("Access-Control-Allow-Origin", "*");
        return res.status(200).send(user);
    }
    else {
        return res.status(404).send("Cannot find user");
    }
}));
router.get('/api/notificationByUser/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.userId;
    if (id.match(/^[0-9a-fA-F]{24}$/)) { // valid ObjectId
        const user = yield (0, notificatonsRepository_1.GetNotificationByTargetUser)(id);
        res.header("Access-Control-Allow-Origin", "*");
        return res.status(200).send(user);
    }
    else {
        return res.status(404).send("Cannot find user");
    }
}));
router.post('/api/notification', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { targetUser, reference, message, status, type, email, phone } = req.body;
    const notification = {
        targetUser: targetUser,
        reference: reference,
        message: message,
        status: "0",
        type: type,
        email: email,
        phone: phone
    };
    const _project = yield (0, notificatonsRepository_1.AddNotification)(notification);
    return res.status(200).send(_project);
}));
router.post('/api/notification/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { targetUser, reference, message, status, type, email, phone } = req.body;
    const notification = {
        targetUser: targetUser,
        reference: reference,
        message: message,
        status: status,
        type: type,
        email: email,
        phone: phone
    };
    const _project = yield (0, notificatonsRepository_1.AddNotification)(notification);
    return res.status(200).send(_project);
}));
//# sourceMappingURL=notification.js.map