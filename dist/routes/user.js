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
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const usersRepository_1 = require("../repositories/usersRepository");
const loginService_1 = require("../services/loginService");
const typeCheck_1 = require("../lib/typeCheck");
const router = express_1.default.Router();
exports.userRouter = router;
router.get('/api/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, usersRepository_1.GetAllUsers)();
    return res.status(200).send(user);
}));
router.get('/api/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) { // valid ObjectId
        const user = yield (0, usersRepository_1.GetUserById)(id);
        res.header("Access-Control-Allow-Origin", "*");
        return res.status(200).send(user);
    }
    else {
        return res.status(404).send("Cannot find user");
    }
}));
router.post('/api/users/email/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (email) {
        const user = yield (0, usersRepository_1.GetUserByEmail)(email);
        return res.status(200).send(user);
    }
    else {
        return res.status(404).send("Cannot find user");
    }
}));
router.post('/api/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, firstName, surname, email, password, type, mobileNumber } = req.body;
    const hashedPassword = yield (0, loginService_1.HashPassword)(password);
    const dbUser = { title: title,
        firstName: firstName,
        surname: surname,
        email: email.toLowerCase(),
        type: type,
        mobileNumber: mobileNumber,
        password: hashedPassword };
    console.log(dbUser);
    const user = yield (0, usersRepository_1.AddUser)(dbUser);
    console.log("yeses", user);
    if ((0, typeCheck_1.instanceOfTypeIUser)(user)) {
        return res.status(200).send(user);
    }
    else {
        const error = user;
        return res.status(400).send(error.message);
    }
}));
router.post('/api/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, firstName, surname, email, password } = req.body;
    const id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) { // valid ObjectId
        const dbUser = { title, firstName, surname, email, password, ["_id"]: id };
        console.log("user", dbUser);
        const user = yield (0, usersRepository_1.UpdateUser)(dbUser);
        return res.status(201).send(user);
    }
    else {
        return res.status(404).send("Cannot find user");
    }
}));
router.post('/api/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const result = yield (0, loginService_1.LoginUser)(email, password);
    if ((0, typeCheck_1.instanceOfTypeIUser)(result)) {
        return res.status(200).send(result);
    }
    else {
        return res.status(result.code).send(result.message);
    }
}));
//# sourceMappingURL=user.js.map