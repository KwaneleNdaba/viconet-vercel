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
exports.AddProjectToOrganisation = exports.AddStaffToOrganisation = exports.UpdateOrganisation = exports.AddOrganisationAndStaff = exports.AddOrganisation = exports.GetOrganisationProjects = exports.GetOrganisationById = exports.GetAllOrganisations = void 0;
const organisations_1 = require("../models/organisations");
const staff_1 = require("../models/staff");
const user_1 = require("../models/user");
const project_1 = require("../models/project");
const typeCheck_1 = require("../lib/typeCheck");
const emailService_1 = require("../services/emailService");
const GetAllOrganisations = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const organisation = yield organisations_1.Organisation.find({});
            const projects = yield project_1.Project.find({});
            return organisation;
        }
        catch (e) {
            return { code: 500, message: "error", object: e };
        }
    });
};
exports.GetAllOrganisations = GetAllOrganisations;
const GetOrganisationById = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const organisation = yield organisations_1.Organisation.find({ _id: id });
            const org = organisation[0];
            const projects = yield project_1.Project.find({});
            const viewModel = {
                organisation: org,
                projects: projects
            };
            return viewModel;
        }
        catch (e) {
            return { code: 500, message: "error", object: e };
        }
    });
};
exports.GetOrganisationById = GetOrganisationById;
const GetOrganisationProjects = function (projectIds, allProjects) {
    const projectIdArray = projectIds.split(",");
    const projects = allProjects.filter(x => projectIdArray.includes(x._id));
    return projects;
};
exports.GetOrganisationProjects = GetOrganisationProjects;
const AddOrganisation = function (_organisation) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const organisation = (0, exports.AddOrganisationAndStaff)(_organisation);
            return organisation;
        }
        catch (e) {
            return { code: 500, message: "error", object: e };
        }
    });
};
exports.AddOrganisation = AddOrganisation;
const AddOrganisationAndStaff = function (_organisation) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const _otp = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
            const _user = {
                title: "",
                firstName: _organisation.userName,
                surname: _organisation.userSurname,
                email: _organisation.userEmail,
                password: _organisation.password,
                mobileNumber: _organisation.userNumber,
                type: "2",
                status: 0,
                otp: _otp.toString()
            };
            const _staff = {
                position: _organisation.position,
                _shortlist: ""
            };
            const userReq = Object.assign({}, _user);
            const user = user_1.User.build(userReq);
            const email = yield (0, emailService_1.sendMail)(_user.email, `Activate your VICO net profile`, `Your otp is ${_otp.toString()}`, `Activate your VICO net profile, Your otp is <strong> ${_otp.toString()}</strong>`);
            const userResp = yield user.save();
            if (!(0, typeCheck_1.instanceOfTypeIUser)(userResp)) {
                return { code: 500, message: "Failed to add user", object: userResp };
            }
            const _userResp = userResp;
            const organisationPayload = {
                name: _organisation.companyName,
                status: "0",
                currentPackage: "0",
                renewalDate: "",
                mobilePhone: _organisation.companyNumber,
                _staff: _staff._id,
                _adminStaff: _staff._id
            };
            const organisation = organisations_1.Organisation.build(organisationPayload);
            const staffReq = Object.assign(Object.assign({}, _staff), { _user: _userResp._id, _organisation: organisation.id });
            const staff = staff_1.Staff.build(staffReq);
            const staffResp = yield staff.save();
            if (!(0, typeCheck_1.instanceOfTypeIStaff)(staffResp)) {
                return { code: 500, message: "Failed to add staff", object: staffResp };
            }
            organisation._adminStaff = staff.id;
            organisation._staff = staff.id;
            const _org = organisation.save();
            return _org;
        }
        catch (e) {
            return { code: 500, message: "Fail;ed to add staff user", object: e };
            // return e as IMongoError;
        }
    });
};
exports.AddOrganisationAndStaff = AddOrganisationAndStaff;
const UpdateOrganisation = function (_organisation) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const organisation = organisations_1.Organisation.build(_organisation);
            yield organisation.updateOne(organisation);
            return organisation;
        }
        catch (e) {
            return { code: 500, message: "error", object: e };
        }
    });
};
exports.UpdateOrganisation = UpdateOrganisation;
const AddStaffToOrganisation = function (_organisation, staff) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentOrg = yield (0, exports.GetOrganisationById)(_organisation);
            const currentStaff = currentOrg._staff;
            const newStaff = `${currentStaff},${staff._id}`;
            const newOrg = Object.assign(Object.assign({}, currentOrg), { _staff: newStaff });
            const organisation = organisations_1.Organisation.build(newOrg);
            yield organisation.updateOne(organisation);
            return organisation;
        }
        catch (e) {
            return e;
        }
    });
};
exports.AddStaffToOrganisation = AddStaffToOrganisation;
const AddProjectToOrganisation = function (_organisation, projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentOrg = yield (0, exports.GetOrganisationById)(_organisation);
            const currentProjects = currentOrg._projects;
            const newProjects = `${currentProjects},${projectId}`;
            const newOrg = Object.assign(Object.assign({}, currentOrg), { _projects: newProjects });
            const organisation = organisations_1.Organisation.build(newOrg);
            yield organisation.updateOne(organisation);
            return organisation;
        }
        catch (e) {
            return e;
        }
    });
};
exports.AddProjectToOrganisation = AddProjectToOrganisation;
//# sourceMappingURL=organisationRepository.js.map