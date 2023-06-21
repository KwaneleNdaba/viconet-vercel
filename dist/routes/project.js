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
exports.projectRouter = void 0;
const express_1 = __importDefault(require("express"));
const projectRepository_1 = require("../repositories/projectRepository");
const router = express_1.default.Router();
exports.projectRouter = router;
router.get('/api/project', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, projectRepository_1.GetAllProjects)();
    return res.status(200).send(user);
}));
router.get('/api/project/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) { // valid ObjectId
        const user = yield (0, projectRepository_1.GetProjectById)(id);
        res.header("Access-Control-Allow-Origin", "*");
        return res.status(200).send(user);
    }
    else {
        return res.status(404).send("Cannot find project");
    }
}));
router.get('/api/project/organisation/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) { // valid ObjectId
        const user = yield (0, projectRepository_1.GetProjectsByOrgId)(id);
        res.header("Access-Control-Allow-Origin", "*");
        return res.status(200).send(user);
    }
    else {
        return res.status(404).send("Cannot find project");
    }
}));
router.get('/api/project/user/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) { // valid ObjectId
        const user = yield (0, projectRepository_1.GetProjectsByOrgId)(id);
        res.header("Access-Control-Allow-Origin", "*");
        return res.status(200).send(user);
    }
    else {
        return res.status(404).send("Cannot find project");
    }
}));
router.post('/api/project', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _organisation, _creatingUser, name, description } = req.body;
    const companyRegister = {
        _organisation: _organisation,
        _creatingUser: _creatingUser,
        name: name,
        description: description,
        status: "0"
    };
    const _project = yield (0, projectRepository_1.AddProject)(companyRegister);
    return res.status(200).send(_project);
}));
router.post('/api/project/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    const id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) { // valid ObjectId
        const project = {
            name: name,
            description: description,
        };
        const _project = yield (0, projectRepository_1.UpdateProject)(project, id);
        return res.status(200).send(_project);
    }
}));
//# sourceMappingURL=project.js.map