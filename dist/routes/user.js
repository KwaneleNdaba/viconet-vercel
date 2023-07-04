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
const staffRepository_1 = require("../repositories/staffRepository");
const organisationRepository_1 = require("../repositories/organisationRepository");
const documentService_1 = require("../services/documentService");
// import { uploadProfilePic } from '../services/documentService';
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
router.post('/api/users/verify/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    if (email) {
        const user = yield (0, usersRepository_1.ActivateUser)(otp, email);
        if ((0, typeCheck_1.instanceOfTypeCustomError)(user)) {
            const errorResponse = user;
            return res.status(errorResponse.code).send(errorResponse);
        }
        return res.status(200).send(user);
    }
    else {
        return res.status(404).send("Cannot find user");
    }
}));
router.post('/api/upload_profilepicture/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield (0, documentService_1.uploadProfilePic)(req, id)
        .then((data) => {
        console.log("imageData", data.Location);
        console.log("personnelId", id);
        // res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Origin", "*");
        res.status(200).json({
            message: "Success",
            data
        });
    })
        .catch((error) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.status(400).json({
            message: "An error occurred.",
            error
        });
    });
}));
router.post('/api/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, firstName, surname, email, password, type, mobileNumber } = req.body;
    const hashedPassword = yield (0, loginService_1.HashPassword)(password);
    const dbUser = { title: title,
        firstName: firstName,
        surname: surname,
        email: email === null || email === void 0 ? void 0 : email.toLowerCase(),
        type: type,
        mobileNumber: mobileNumber,
        status: 0,
        password: hashedPassword };
    const user = yield (0, usersRepository_1.AddUser)(dbUser);
    if ((0, typeCheck_1.instanceOfTypeIUser)(user)) {
        return res.status(200).send(user);
    }
    else {
        const error = user;
        return res.status(400).send(error.message);
    }
}));
router.post('/api/user/deleteUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, oldPassword, password } = req.body;
    const user = yield (0, usersRepository_1.GetUserByEmail)(email);
    const currPass = yield (0, loginService_1.HashPassword)(oldPassword);
    if (user.password == currPass) {
        const hashedPassword = yield (0, loginService_1.HashPassword)(password);
        const newUser = Object.assign(Object.assign({}, user), { password: hashedPassword });
        const dbUser = yield (0, usersRepository_1.UpdateUser)(newUser);
        if ((0, typeCheck_1.instanceOfTypeIUser)(dbUser)) {
            return res.status(200).send(user);
        }
        else {
            const error = user;
            return res.status(400).send(error.message);
        }
    }
}));
router.post('/api/user/deleteUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, password } = req.body;
    const user = (0, usersRepository_1.GetUserById)(userId);
    const _userPass = user.password;
    const hashedPassword = yield (0, loginService_1.HashPassword)(password);
    if (_userPass == hashedPassword) {
        const newUser = Object.assign(Object.assign({}, user._doc), { status: "3" });
        const dbUser = yield (0, usersRepository_1.UpdateUser)(newUser);
        if ((0, typeCheck_1.instanceOfTypeIUser)(dbUser)) {
            return res.status(200).send(user);
        }
        else {
            const error = user;
            return res.status(400).send(error.message);
        }
    }
    return res.status(400).send("User not deleted");
}));
router.post('/api/users/staff', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, firstName, surname, email, password, mobileNumber, position, profilePicture, _organisation } = req.body;
    const hashedPassword = yield (0, loginService_1.HashPassword)(password);
    const dbUser = { title: title,
        firstName: firstName,
        surname: surname,
        email: email === null || email === void 0 ? void 0 : email.toLowerCase(),
        type: "2",
        mobileNumber: mobileNumber,
        status: 0,
        password: hashedPassword };
    const user = yield (0, usersRepository_1.AddUser)(dbUser);
    const staff = {
        profilePicture: profilePicture,
        position: position,
        _organisation: _organisation,
    };
    const staffUser = {
        staff: staff,
        user: user
    };
    const _staffUser = yield (0, staffRepository_1.AddStaff)(staffUser);
    const organisation = yield (0, organisationRepository_1.AddStaffToOrganisation)(_organisation, _staffUser);
    return res.status(200).send(_staffUser);
}));
router.post('/api/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, firstName, surname, email, password } = req.body;
    const id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) { // valid ObjectId
        const dbUser = { title, firstName, surname, email, password, ["_id"]: id };
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