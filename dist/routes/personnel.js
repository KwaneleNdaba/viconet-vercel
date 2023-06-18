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
exports.personnelRouter = void 0;
const express_1 = __importDefault(require("express"));
const typeCheck_1 = require("../lib/typeCheck");
const searchService_1 = require("../services/searchService");
const personnelRepository_1 = require("../repositories/personnelRepository");
const documentService_1 = require("../services/documentService");
const router = express_1.default.Router();
exports.personnelRouter = router;
router.post('/api/searchPersonnel', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchKey } = req.body;
    const personnel = yield (0, personnelRepository_1.GetAllPersonnel)();
    if (!(0, typeCheck_1.instanceOfTypeCustomError)(personnel)) {
        const _personnel = personnel;
        const result = yield (0, searchService_1.SearchByKey)(searchKey, _personnel);
        return res.status(200).send(result);
    }
}));
router.post('/api/upload_cv/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield (0, documentService_1.parsefile)(req)
        .then((data) => {
        console.log("data", data);
        // res.header("Access-Control-Allow-Origin", "*");
        res.status(200).json({
            message: "Success",
            data
        });
    })
        .catch((error) => {
        console.log("data", error);
        res.header("Access-Control-Allow-Origin", "*");
        res.status(400).json({
            message: "An error occurred.",
            error
        });
    });
}));
router.post('/api/personnel', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchKeys, information, currentJob, previousWorkExperience, yearsOfExperience, education, keySkills, keyCourses, cvUrl, personalInformation, _user } = req.body;
    const dbUser = { searchKeys, information, currentJob, previousWorkExperience, yearsOfExperience, education, keySkills, keyCourses, cvUrl, personalInformation, _user: _user, state: 0 };
    const user = yield (0, personnelRepository_1.AddPersonnel)(dbUser);
    return res.status(201).send(user);
}));
router.get('/api/personnel', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, personnelRepository_1.GetAllPersonnel)();
    return res.status(201).send(user);
}));
router.get('/api/personnel/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.params.userId;
    const user = yield (0, personnelRepository_1.GetPersonnelByUserId)(email);
    return res.status(200).send(user);
}));
router.post('/api/personnel/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchKeys, information, currentJob, previousWorkExperience, yearsOfExperience, education, keySkills, keyCourses, cvUrl, personalInformation, userId } = req.body;
    const dbUser = { searchKeys, information, currentJob, previousWorkExperience, yearsOfExperience, education, keySkills, keyCourses, cvUrl, personalInformation, _user: userId, state: 0 };
    const id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) { // valid ObjectId
        const user = yield (0, personnelRepository_1.UpdatePersonnel)(dbUser);
        return res.status(201).send(user);
    }
    else {
        return res.status(404).send("Cannot find user");
    }
}));
//# sourceMappingURL=personnel.js.map