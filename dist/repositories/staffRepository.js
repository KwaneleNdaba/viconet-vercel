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
exports.UpdateStaff = exports.AddStaff = exports.GetStaffInOrganisation = exports.GetStaffById = exports.GetAllStaff = void 0;
const typeCheck_1 = require("../lib/typeCheck");
const staff_1 = require("../models/staff");
const user_1 = require("../models/user");
const GetAllStaff = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const staff = yield staff_1.Staff.find({});
            return staff;
        }
        catch (e) {
            return e;
        }
    });
};
exports.GetAllStaff = GetAllStaff;
const GetStaffById = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const staff = yield staff_1.Staff.find({ _id: id });
            return staff;
        }
        catch (e) {
            return e;
        }
    });
};
exports.GetStaffById = GetStaffById;
const GetStaffInOrganisation = function (organisationId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const allStaff = yield (0, exports.GetAllStaff)();
            if ((0, typeCheck_1.instanceOfTypeMongoError)(allStaff)) {
                return { code: "500", message: "Error retrieving staff" };
            }
            else {
                const _allStaff = allStaff;
                const response = _allStaff.filter(x => x._organisation == organisationId);
                return response;
            }
        }
        catch (e) {
            return e;
        }
    });
};
exports.GetStaffInOrganisation = GetStaffInOrganisation;
const AddStaff = function (_staff) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userReq = Object.assign(Object.assign({}, _staff.user), { type: "STAFFUSER_UNREGISTERED" });
            const user = user_1.User.build(userReq);
            const userResp = yield user.save();
            if ((0, typeCheck_1.instanceOfTypeMongoError)(userResp)) {
                return userResp;
            }
            const _userResp = userResp;
            const staffReq = Object.assign(Object.assign({}, _staff.staff), { _user: _userResp._id });
            const staff = staff_1.Staff.build(staffReq);
            const staffResp = yield staff.save();
            return staffResp;
        }
        catch (e) {
            return e;
        }
    });
};
exports.AddStaff = AddStaff;
const UpdateStaff = function (_staff) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const staff = staff_1.Staff.build(_staff);
            yield staff.updateOne(staff);
            return staff;
        }
        catch (e) {
            return e;
        }
    });
};
exports.UpdateStaff = UpdateStaff;
//# sourceMappingURL=staffRepository.js.map