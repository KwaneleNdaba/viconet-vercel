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
exports.UpdateStaff = exports.AddStaff = exports.GetStaffInOrganisation = exports.RemoveFromShortlist = exports.AddToShortlist = exports.GetStaffById = exports.GetFullStaffById = exports.GetAllStaff = void 0;
const typeCheck_1 = require("../lib/typeCheck");
const staff_1 = require("../models/staff");
const user_1 = require("../models/user");
const personnelRepository_1 = require("./personnelRepository");
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
const GetFullStaffById = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const staff = yield staff_1.Staff.find({ _user: id });
            const _staff = staff[0];
            const user = yield user_1.User.findById(id);
            const personnel = yield GetShortListed(_staff._shortlist);
            const response = {
                staff: _staff,
                shortlisted: personnel,
                user: user
            };
            return response;
        }
        catch (e) {
            return e;
        }
    });
};
exports.GetFullStaffById = GetFullStaffById;
const GetStaffById = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const staff = yield staff_1.Staff.find({ _id: id });
            const _staff = staff[0];
            return _staff;
        }
        catch (e) {
            return e;
        }
    });
};
exports.GetStaffById = GetStaffById;
const AddToShortlist = function (personnel, staffId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const staffDoc = yield (0, exports.GetStaffById)(staffId);
            const currentStaff = staffDoc._doc;
            const currentStaffArray = currentStaff._shortlist.split(",");
            if (currentStaffArray.includes(personnel)) {
                //already shortlisted 
                console.log("already shortlisted");
                const response = {
                    staff: currentStaff,
                    shortlisted: yield GetShortListed(currentStaff._shortlist)
                };
                return response;
            }
            else {
                const newPersonnel = `${currentStaff._shortlist.trim()}${currentStaff._shortlist.trim() == "" ? '' : ","}${personnel.trim()}`;
                const newStaff = Object.assign(Object.assign({}, currentStaff), { _shortlist: newPersonnel });
                const savedStaff = yield (0, exports.UpdateStaff)(newStaff);
                const newShortlist = yield GetShortListed(newPersonnel);
                const response = {
                    staff: savedStaff,
                    shortlisted: newShortlist
                };
                return response;
            }
        }
        catch (e) {
            return e;
        }
    });
};
exports.AddToShortlist = AddToShortlist;
const RemoveFromShortlist = function (personnel, staffId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("person", personnel);
        console.log("staff", staffId);
        try {
            const staffDoc = yield (0, exports.GetStaffById)(staffId);
            const currentStaff = staffDoc._doc;
            const currentPersonnel = currentStaff._shortlist.trim().split(",");
            const _newShortlist = currentPersonnel.filter(x => x != personnel).join(",");
            const newStaff = Object.assign(Object.assign({}, currentStaff), { _shortlist: _newShortlist });
            const savedStaff = yield (0, exports.UpdateStaff)(newStaff);
            const newShortlistPersonnel = yield GetShortListed(_newShortlist);
            const response = {
                staff: savedStaff,
                shortlisted: newShortlistPersonnel
            };
            return response;
        }
        catch (e) {
            return e;
        }
    });
};
exports.RemoveFromShortlist = RemoveFromShortlist;
const GetShortListed = function (shortlisted) {
    return __awaiter(this, void 0, void 0, function* () {
        const allPersonnel = yield (0, personnelRepository_1.GetAllPersonnel)();
        const allShortListed = shortlisted.split(",");
        const list = allShortListed.length > 0 ? allPersonnel.filter(x => allShortListed.includes(x === null || x === void 0 ? void 0 : x._id.toString())) : [];
        return list;
    });
};
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
            const userReq = Object.assign({}, _staff.user);
            const user = user_1.User.build(userReq);
            const userResp = yield user.save();
            console.log("asas", !(0, typeCheck_1.instanceOfTypeIUser)(userResp));
            if (!(0, typeCheck_1.instanceOfTypeIUser)(userResp)) {
                return { code: 500, message: "Failed to add user", object: userResp };
            }
            const _userResp = userResp;
            const staffReq = Object.assign(Object.assign({}, _staff.staff), { _user: _userResp._id, _organisation: "rtesat" });
            const staff = staff_1.Staff.build(staffReq);
            const staffResp = yield staff.save();
            if (!(0, typeCheck_1.instanceOfTypeIStaff)(staffResp)) {
                return { code: 500, message: "Failed to add staff", object: staffResp };
            }
            return staffResp;
        }
        catch (e) {
            return { code: 500, message: "Fail;ed to add staff user", object: e };
            // return e as IMongoError;
        }
    });
};
exports.AddStaff = AddStaff;
const UpdateStaff = function (_staff) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const staff = staff_1.Staff.build(_staff);
            yield staff.updateOne(staff);
            console.log("newshort", _staff);
            return staff;
        }
        catch (e) {
            return e;
        }
    });
};
exports.UpdateStaff = UpdateStaff;
//# sourceMappingURL=staffRepository.js.map