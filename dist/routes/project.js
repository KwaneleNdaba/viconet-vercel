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
exports.projectRouter = exports.AddBatchPersonnelToProject = void 0;
const express_1 = __importDefault(require("express"));
const projectRepository_1 = require("../repositories/projectRepository");
const project_1 = require("../models/project");
const user_1 = require("../models/user");
const usersRepository_1 = require("../repositories/usersRepository");
const personnel_1 = require("../models/personnel");
const notification_1 = require("./notification");
const staffRepository_1 = require("../repositories/staffRepository");
const router = express_1.default.Router();
exports.projectRouter = router;
router.get('/api/project', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, projectRepository_1.GetAllProjects)();
    return res.status(200).send(user);
}));
router.get('/api/acceptinvite/:personnelId/:projectId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const personnelId = req.params.personnelId;
    const projectId = req.params.projectId;
    if (personnelId.match(/^[0-9a-fA-F]{24}$/) && projectId.match(/^[0-9a-fA-F]{24}$/)) { // valid ObjectId
        const payload = {
            projectId: projectId,
            personnelId: personnelId,
            staffId: "",
            status: "1"
        };
        const user = yield (0, projectRepository_1.UpdatePersonnelOnProject)(payload);
        res.header("Access-Control-Allow-Origin", "*");
        return res.status(200).send(user);
    }
    else {
        return res.status(404).send("Cannot find project");
    }
}));
router.get('/api/declineinvite/:personnelId/:projectId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const personnelId = req.params.personnelId;
    const projectId = req.params.projectId;
    if (personnelId.match(/^[0-9a-fA-F]{24}$/) && projectId.match(/^[0-9a-fA-F]{24}$/)) { // valid ObjectId
        const payload = {
            projectId: projectId,
            personnelId: personnelId,
            staffId: "",
            status: "2"
        };
        const user = yield (0, projectRepository_1.UpdatePersonnelOnProject)(payload);
        res.header("Access-Control-Allow-Origin", "*");
        return res.status(200).send(user);
    }
    else {
        return res.status(404).send("Cannot find project");
    }
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
        const user = yield (0, projectRepository_1.GetProjectsByUserId)(id);
        res.header("Access-Control-Allow-Origin", "*");
        return res.status(200).send(user);
    }
    else {
        return res.status(404).send("Cannot find project");
    }
}));
router.post('/api/project/shortlist/batch', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { personelIds, staffId, projectId } = req.body;
    const request = {
        personelIds,
        staffId,
        projectId
    };
    const _project = yield (0, exports.AddBatchPersonnelToProject)(request);
    return res.status(200).send(_project);
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
const AddBatchPersonnelToProject = function (_project) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentProject = yield (0, projectRepository_1.GetProjectById)(_project.projectId);
        const allUsers = yield user_1.User.find({});
        const currentPending = currentProject.pending.split(",");
        const metaPending = _project.personelIds;
        const newPending = [...metaPending, ...currentPending];
        const newPendingString = newPending.join(",");
        const pendingClean = newPendingString.charAt(0) === ',' ? newPendingString.slice(1) : newPendingString;
        const newProject = Object.assign(Object.assign({}, currentProject), { pending: pendingClean });
        const project = project_1.Project.build(newProject);
        const newProjectDb = yield project.updateOne(project);
        //remove from shortlist
        yield (0, staffRepository_1.RemoveBatchFromShortlist)(_project.personelIds, _project.staffId);
        //get personnel users 
        const users = yield (0, usersRepository_1.GetBatchUserByPersonnelId)(_project.personelIds);
        const allPersonnel = yield personnel_1.Personnel.find({ _id: _project.personelIds });
        const notifications = _project.personelIds.map(personelId => {
            const personnel = allPersonnel.filter(x => x._id == personelId)[0];
            const user = users.filter(x => x._id == personnel._user)[0];
            const notification = {
                targetUser: personelId,
                reference: _project.projectId,
                message: "Invited to a new project",
                status: "0",
                type: "0",
                email: user.email,
                phone: user.mobileNumber,
                date: new Date().toString()
            };
            return notification;
        });
        const resp = (0, notification_1.AddBatchNotification)(notifications);
        const response = yield (0, projectRepository_1.MapProjectPersonnel)(newProject, allPersonnel, users);
        return response;
    });
};
exports.AddBatchPersonnelToProject = AddBatchPersonnelToProject;
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
router.post('/api/updateProjectPersonnel/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId, personnelId, status, staffId } = req.body;
    const project = {
        projectId: projectId,
        personnelId: personnelId,
        status: status,
        staffId
    };
    const _project = yield (0, projectRepository_1.UpdatePersonnelOnProject)(project);
    return res.status(200).send(_project);
}));
router.post('/api/project/delete/deleteProject', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.body;
    console.log("DSSDSDSD");
    const _project = yield (0, projectRepository_1.DeleteProject)(projectId);
    return res.status(200).send(_project);
}));
//# sourceMappingURL=project.js.map