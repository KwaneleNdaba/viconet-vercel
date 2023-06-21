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
exports.UpdateProject = exports.AddProject = exports.GetProjectById = exports.GetProjectsByUserId = exports.GetProjectsByOrgId = exports.GetAllProjects = void 0;
const typeCheck_1 = require("../lib/typeCheck");
const project_1 = require("../models/project");
const organisationRepository_1 = require("./organisationRepository");
const personnelRepository_1 = require("./personnelRepository");
const GetAllProjects = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const personnel = yield project_1.Project.find({});
            return personnel;
        }
        catch (e) {
            return e;
        }
    });
};
exports.GetAllProjects = GetAllProjects;
const GetProjectsByOrgId = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const project = yield project_1.Project.find({ _organisation: id });
            const personnel = yield (0, personnelRepository_1.GetAllPersonnel)();
            if ((0, typeCheck_1.instanceOfTypeIPersonnelArray)(personnel)) {
                const fullProjects = project.map(x => MapProjectPersonnel(x, personnel));
                return fullProjects;
            }
            return { code: "500", message: "Error occured while fetching personnel" };
        }
        catch (e) {
            return e;
        }
    });
};
exports.GetProjectsByOrgId = GetProjectsByOrgId;
const GetProjectsByUserId = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const project = yield project_1.Project.find({ _creatingUser: id });
            const personnel = yield (0, personnelRepository_1.GetAllPersonnel)();
            if ((0, typeCheck_1.instanceOfTypeIPersonnelArray)(personnel)) {
                const fullProjects = project.map(x => MapProjectPersonnel(x, personnel));
                return fullProjects;
            }
            return { code: "500", message: "Error occured while fetching personnel" };
        }
        catch (e) {
            return e;
        }
    });
};
exports.GetProjectsByUserId = GetProjectsByUserId;
const GetProjectById = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const project = yield project_1.Project.find({ _id: id });
            const personnel = yield (0, personnelRepository_1.GetAllPersonnel)();
            if ((0, typeCheck_1.instanceOfTypeIPersonnelArray)(personnel)) {
                const view = MapProjectPersonnel(project[0], personnel);
                return view;
            }
            return { code: "500", message: "Error occured while fetching personnel" };
        }
        catch (e) {
            return e;
        }
    });
};
exports.GetProjectById = GetProjectById;
const AddProject = function (_project) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const projectPayload = {
                _organisation: _project._organisation,
                _creatingUser: _project._creatingUser,
                name: _project.name,
                status: "0",
                description: _project.description,
                //list of personnel id
                uninvited: "",
                pending: "",
                declined: "",
                accepted: ""
            };
            const project = project_1.Project.build(projectPayload);
            yield project.save();
            const org = yield (0, organisationRepository_1.AddProjectToOrganisation)(project._organisation, project);
            return project;
        }
        catch (e) {
            return e;
        }
    });
};
exports.AddProject = AddProject;
const UpdateProject = function (_project, _projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentProject = yield (0, exports.GetProjectById)(_projectId);
            const newProject = Object.assign(Object.assign({}, currentProject), { description: _project.description, name: _project.name });
            const project = project_1.Project.build(newProject);
            yield project.updateOne(project);
            return project;
        }
        catch (e) {
            return e;
        }
    });
};
exports.UpdateProject = UpdateProject;
function MapProjectPersonnel(project, personnel) {
    const p = project;
    const uninvited = project.uninvited.split(",").map(proj => personnel.filter(pers => pers._id == proj)[0]);
    const pending = project.pending.split(",").map(proj => personnel.filter(pers => pers._id == proj)[0]);
    const accepted = project.accepted.split(",").map(proj => personnel.filter(pers => pers._id == proj)[0]);
    const declined = project.declined.split(",").map(proj => personnel.filter(pers => pers._id == proj)[0]);
    const result = Object.assign(Object.assign({}, p._doc), { _uninvited: uninvited, _pending: pending, _accepted: accepted, _declined: declined });
    return result;
}
//# sourceMappingURL=projectRepository.js.map