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
exports.organiwsationRouter = void 0;
const express_1 = __importDefault(require("express"));
const loginService_1 = require("../services/loginService");
const organisationRepository_1 = require("../repositories/organisationRepository");
const typeCheck_1 = require("../lib/typeCheck");
const router = express_1.default.Router();
exports.organiwsationRouter = router;
router.get('/api/organisation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, organisationRepository_1.GetAllOrganisations)();
    return res.status(200).send(user);
}));
router.get('/api/organisation/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) { // valid ObjectId
        const user = yield (0, organisationRepository_1.GetOrganisationById)(id);
        res.header("Access-Control-Allow-Origin", "*");
        return res.status(200).send(user);
    }
    else {
        return res.status(404).send("Cannot find user");
    }
}));
router.post('/api/organisation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, userName, userSurname, userNumber, companyNumber, companyReg, companyName, companyAdrress, position, title, userEmail } = req.body;
    const hashedPassword = yield (0, loginService_1.HashPassword)(password);
    const companyRegister = {
        email: email,
        password: hashedPassword,
        userName: userName,
        userSurname: userSurname,
        userNumber: userNumber,
        companyNumber: companyNumber,
        companyReg: companyReg,
        companyName: companyName,
        companyAdrress: companyAdrress,
        position: position,
        title: title,
        userEmail: userEmail
    };
    const _organisation = yield (0, organisationRepository_1.AddOrganisation)(companyRegister);
    const code = !(0, typeCheck_1.instanceOfTypeIOrganisation)(_organisation) ? 500 : 200;
    return res.status(code).send(_organisation);
}));
//# sourceMappingURL=organisation.js.map