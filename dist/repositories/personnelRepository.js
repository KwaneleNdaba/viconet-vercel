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
exports.UpdatePersonnel = exports.AddPersonnelUser = exports.AddPersonnel = exports.GetPersonnelById = exports.ToPersonnelViewModelSync = exports.ToPersonnelViewModel = exports.GetPersonnelByUserId = exports.GetAllPersonnel = void 0;
const typeCheck_1 = require("../lib/typeCheck");
const personnel_1 = require("../models/personnel");
const user_1 = require("../models/user");
const searchService_1 = require("../services/searchService");
const usersRepository_1 = require("./usersRepository");
const GetAllPersonnel = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const personnel = yield personnel_1.Personnel.find({});
            return personnel;
        }
        catch (e) {
            return e;
        }
    });
};
exports.GetAllPersonnel = GetAllPersonnel;
const GetPersonnelByUserId = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const personnel = yield personnel_1.Personnel.find({ _user: id });
            const match = personnel[0];
            console.log("match", personnel);
            return match;
        }
        catch (e) {
            return e;
        }
    });
};
exports.GetPersonnelByUserId = GetPersonnelByUserId;
const ToPersonnelViewModel = function (personnel) {
    return __awaiter(this, void 0, void 0, function* () {
        const userIds = personnel.map(x => x._user);
        const users = yield user_1.User.find({ _id: userIds });
        const responseModels = personnel.map((res) => {
            const user = users.filter(x => x.id == res._user)[0];
            const response = Object.assign(Object.assign({}, res._doc), { user: user });
            return response;
        });
        return responseModels;
    });
};
exports.ToPersonnelViewModel = ToPersonnelViewModel;
const ToPersonnelViewModelSync = function (personnel, users) {
    const userIds = personnel.map(x => x._user);
    const responseModels = personnel.map((res) => {
        const user = users.filter(x => x.id == res._user)[0];
        const response = Object.assign(Object.assign({}, res._doc), { user: user });
        return response;
    });
    return responseModels;
};
exports.ToPersonnelViewModelSync = ToPersonnelViewModelSync;
const GetPersonnelById = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const personnel = yield personnel_1.Personnel.find({ _id: id });
            const match = personnel[0];
            return match;
        }
        catch (e) {
            return e;
        }
    });
};
exports.GetPersonnelById = GetPersonnelById;
const AddPersonnel = function (_personnel) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const searchKeys = (0, searchService_1.GenerateSearchKeys)(_personnel);
            const populated = Object.assign(Object.assign({}, _personnel), { searchKeys: searchKeys });
            const personnel = personnel_1.Personnel.build(populated);
            const res = yield personnel.save();
            return personnel;
        }
        catch (e) {
            console.log("RERER", e);
            return e;
        }
    });
};
exports.AddPersonnel = AddPersonnel;
const AddPersonnelUser = function (_personnel) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            _personnel.user.type = "TALENT";
            const saveUser = yield (0, usersRepository_1.AddUser)(_personnel.user);
            if ((0, typeCheck_1.instanceOfTypeMongoError)(saveUser)) {
                return saveUser;
            }
            const searchKeys = (0, searchService_1.GenerateSearchKeys)(_personnel.personnel);
            const userId = saveUser;
            const populated = Object.assign(Object.assign({}, _personnel.personnel), { searchKeys: searchKeys, _user: userId._id });
            const personnel = personnel_1.Personnel.build(populated);
            yield personnel.save();
            return personnel;
        }
        catch (e) {
            return e;
        }
    });
};
exports.AddPersonnelUser = AddPersonnelUser;
const UpdatePersonnel = function (_personnel) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const searchKeys = (0, searchService_1.GenerateSearchKeys)(_personnel);
            const populated = Object.assign(Object.assign({}, _personnel), { searchKeys: searchKeys });
            const personnel = personnel_1.Personnel.build(populated);
            yield personnel.updateOne(personnel);
            return personnel;
        }
        catch (e) {
            return e;
        }
    });
};
exports.UpdatePersonnel = UpdatePersonnel;
//# sourceMappingURL=personnelRepository.js.map