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
exports.staffRouter = void 0;
const express_1 = __importDefault(require("express"));
const usersRepository_1 = require("../repositories/usersRepository");
const loginService_1 = require("../services/loginService");
const staffRepository_1 = require("../repositories/staffRepository");
const organisationRepository_1 = require("../repositories/organisationRepository");
const router = express_1.default.Router();
exports.staffRouter = router;
router.get('/api/staff', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, staffRepository_1.GetAllStaff)();
    return res.status(200).send(user);
}));
router.get('/api/staff/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) { // valid ObjectId
        const user = yield (0, staffRepository_1.GetStaffById)(id);
        res.header("Access-Control-Allow-Origin", "*");
        return res.status(200).send(user);
    }
    else {
        return res.status(404).send("Cannot find user");
    }
}));
router.post('/api/staff', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, firstName, surname, email, password, mobileNumber, position, profilePicture, _organisation } = req.body;
    const hashedPassword = yield (0, loginService_1.HashPassword)(password);
    const dbUser = { title: title,
        firstName: firstName,
        surname: surname,
        email: email.toLowerCase(),
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
//# sourceMappingURL=staff.js.map