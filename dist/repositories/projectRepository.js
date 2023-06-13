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
exports.UpdateProject = exports.AddProject = exports.GetProjectById = exports.GetProjectsByOrgId = exports.GetAllProjects = void 0;
const typeCheck_1 = require("../lib/typeCheck");
const project_1 = require("../models/project");
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
            const project = project_1.Project.build(_project);
            yield project.save();
            return project;
        }
        catch (e) {
            return e;
        }
    });
};
exports.AddProject = AddProject;
const UpdateProject = function (_project) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const project = project_1.Project.build(_project);
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
    const uninvited = project.uninvited.split(",").map(proj => personnel.filter(pers => pers._id == proj)[0]);
    const pending = project.pending.split(",").map(proj => personnel.filter(pers => pers._id == proj)[0]);
    const accepted = project.accepted.split(",").map(proj => personnel.filter(pers => pers._id == proj)[0]);
    const declined = project.declined.split(",").map(proj => personnel.filter(pers => pers._id == proj)[0]);
    const result = Object.assign(Object.assign({}, project), { _uninvited: uninvited, _pending: pending, _accepted: accepted, _declined: declined });
    return result;
}
//# sourceMappingURL=projectRepository.js.map