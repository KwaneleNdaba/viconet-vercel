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
exports.UpdatePersonnelOnProject = exports.UpdateProject = exports.AddProject = exports.GetProjectById = exports.GetProjectsByUserId = exports.GetProjectsByOrgId = exports.GetAllProjects = void 0;
const typeCheck_1 = require("../lib/typeCheck");
const project_1 = require("../models/project");
const notificatonsRepository_1 = require("./notificatonsRepository");
const organisationRepository_1 = require("./organisationRepository");
const personnelRepository_1 = require("./personnelRepository");
const staffRepository_1 = require("./staffRepository");
const usersRepository_1 = require("./usersRepository");
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
                const doc = project[0];
                const view = MapProjectPersonnel(doc._doc, personnel);
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
            const projectDb = yield project.save();
            const org = yield (0, organisationRepository_1.AddProjectToOrganisation)(project._organisation, projectDb.id);
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
const UpdatePersonnelOnProject = function (_project) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentProject = yield (0, exports.GetProjectById)(_project.projectId);
        // const currentProject = _currentProject._doc as IProject;
        const allPersonnel = yield (0, personnelRepository_1.GetAllPersonnel)();
        const personnelUser = allPersonnel.filter(x => x._id == _project.personnelId)[0];
        const user = yield (0, usersRepository_1.GetUserById)(personnelUser._user);
        try {
            switch (_project.status) {
                //invited
                case "0":
                    const currentPending = currentProject.pending.split(",");
                    const pending = currentPending.length > 0 ? [...currentPending, _project.personnelId].join(",") : _project.personnelId;
                    const pendingClean = pending.charAt(0) === ',' ? pending.slice(1) : pending;
                    const newProject = Object.assign(Object.assign({}, currentProject), { pending: pendingClean });
                    const project = project_1.Project.build(newProject);
                    const newProjectDb = yield project.updateOne(project);
                    //remove from shortlist
                    yield (0, staffRepository_1.RemoveFromShortlist)(_project.personnelId, _project.staffId);
                    //send notification
                    const notification = {
                        targetUser: _project.personnelId,
                        reference: _project.projectId,
                        message: "Invited to a new project",
                        status: "0",
                        type: "0",
                        email: user.email,
                        phone: user.mobileNumber,
                        date: new Date().toString()
                    };
                    const resp = (0, notificatonsRepository_1.AddNotification)(notification);
                    const response = MapProjectPersonnel(newProject, allPersonnel);
                    return response;
                //accepted
                case "1":
                    const newPending = currentProject.pending.split(",").filter((x) => x != _project.personnelId).join(",");
                    const currentAccepted = currentProject.accepted.split(",");
                    const accepted = currentAccepted.length > 0 ? [...currentAccepted, _project.personnelId].join(",") : _project.personnelId;
                    const acceptedClean = accepted.charAt(0) === ',' ? accepted.slice(1) : pending;
                    const _newProject = Object.assign(Object.assign({}, currentProject), { pending: newPending, accepted: acceptedClean });
                    const __project = project_1.Project.build(_newProject);
                    const _newProjectDb = yield __project.updateOne(__project);
                    const _notification = yield (0, notificatonsRepository_1.GetNotificationByTargetAndReference)(_project.personnelId, _project.projectId);
                    const newNotification = Object.assign(Object.assign({}, _notification), { status: "1" });
                    const updatedNotification = yield (0, notificatonsRepository_1.UpdateNotification)(newNotification);
                    const _response = MapProjectPersonnel(_newProject, allPersonnel);
                    return _response;
                //declined
                case "2":
                    const _newPending = currentProject.pending.split(",").filter((x) => x != _project.personnelId).join(",");
                    const currentDeclined = currentProject.declined.split(",");
                    const declined = currentDeclined.length > 0 ? [...currentDeclined, _project.personnelId].join(",") : _project.personnelId;
                    const declinedClean = declined.charAt(0) === ',' ? declined.slice(1) : declined;
                    const __newProject = Object.assign(Object.assign({}, currentProject), { pending: _newPending, declined: declinedClean });
                    const ___project = project_1.Project.build(__newProject);
                    const __newProjectDb = yield ___project.updateOne(___project);
                    const __notification = yield (0, notificatonsRepository_1.GetNotificationByTargetAndReference)(_project.personnelId, _project.projectId);
                    const _newNotification = Object.assign(Object.assign({}, __notification), { status: "1" });
                    const _updatedNotification = yield (0, notificatonsRepository_1.UpdateNotification)(_newNotification);
                    const __response = MapProjectPersonnel(__newProject, allPersonnel);
                    return __response;
                //removed
                case "3":
                    const __removedInvited = currentProject.pending.split(",").filter((x) => x == _project.personnelId).join(",");
                    const __removeAccepted = currentProject.accepted.split(",").filter((x) => x == _project.personnelId).join(",");
                    const __removeRejected = currentProject.declined.split(",").filter((x) => x == _project.personnelId).join(",");
                    const ___newProject = Object.assign(Object.assign({}, currentProject), { accepted: __removeAccepted, pending: __removedInvited, declined: __removeRejected, uninvited: `${currentProject.uninvited},${_project.personnelId}` });
                    const ____project = project_1.Project.build(___newProject);
                    const ___newProjectDb = yield ____project.updateOne(____project);
                    const ___response = MapProjectPersonnel(___newProjectDb, allPersonnel);
                    return ___response;
            }
        }
        catch (e) {
            return e;
        }
    });
};
exports.UpdatePersonnelOnProject = UpdatePersonnelOnProject;
//   export const AddMultiplePersonnelToProject = async function(_project:IAddPersonnelToProject):Promise<IProjectView[]> {
//             const currentProject = await GetProjectById(_project.projectId) as any;
//             const allPersonnel = await GetAllPersonnel() as IPersonnel[];
//             const personnelUsers = allPersonnel.filter(x=>_project.personnelIds??[].includes(x._id))as IPersonnel[];
//             const results = await personnelUsers.map((personnel)=>{
//                 const perUserRes = GetUserById(personnel._user).then((user:any)=>{
//                         try{
//                             const currentPending = currentProject.pending.split(",");
//                             const pending = currentPending.length>0?[...currentPending,personnel._id].join(","): personnel._id;
//                             const pendingClean = pending.charAt(0) === ','? pending.slice(1): pending;
//                             const newProject = {...currentProject, pending:pendingClean} as IProject;
//                             const project = Project.build(newProject);
//                             const newProjectDb = project.updateOne(project)
//                             .then((project)=>{
//                                 //send notification
//                                 const notification = {
//                                     targetUser: personnel._id,
//                                     reference:_project.projectId,
//                                     message: "Invited to a new project",
//                                     status:"0",
//                                     type:"0",
//                                     email:user.email,
//                                     phone:user.mobileNumber,
//                                     date:new Date().toString()
//                                 } as INotification
//                                 const resp = AddNotification(notification);
//                             });
//                             const response = MapProjectPersonnel(newProject,allPersonnel);
//                             return response;
//                         } catch(E){
//                             console.log("Inner", E)
//                         }
//                 });
//                 return perUserRes;
//             })
//         return results;
//   }
function MapProjectPersonnel(project, personnel) {
    // const p = _project as any;
    // const project = p._doc as IProject;
    const uninvited = project.uninvited.split(",").map(proj => personnel.filter(pers => pers._id.toString() == proj)[0]);
    const pending = project.pending.split(",").map(proj => personnel.filter(pers => pers._id.toString() == proj)[0]);
    const accepted = project.accepted.split(",").map(proj => personnel.filter(pers => pers._id.toString() == proj)[0]);
    const declined = project.declined.split(",").map(proj => personnel.filter(pers => pers._id.toString() == proj)[0]);
    const result = Object.assign(Object.assign({}, project), { _uninvited: uninvited, _pending: pending, _accepted: accepted, _declined: declined });
    return result;
}
//# sourceMappingURL=projectRepository.js.map