"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfTypeMongoError = exports.instanceOfTypeCustomError = exports.instanceOfTypeIPersonnelArray = exports.instanceOfTypeIOrganisation = exports.instanceOfTypeIStaff = exports.instanceOfTypeIUser = void 0;
function instanceOfTypeIUser(object) {
    return object._id;
}
exports.instanceOfTypeIUser = instanceOfTypeIUser;
function instanceOfTypeIStaff(object) {
    return object._id;
}
exports.instanceOfTypeIStaff = instanceOfTypeIStaff;
function instanceOfTypeIOrganisation(object) {
    return object._id;
}
exports.instanceOfTypeIOrganisation = instanceOfTypeIOrganisation;
function instanceOfTypeIPersonnelArray(object) {
    var _a;
    return (_a = object[0]) === null || _a === void 0 ? void 0 : _a._id;
}
exports.instanceOfTypeIPersonnelArray = instanceOfTypeIPersonnelArray;
function instanceOfTypeCustomError(object) {
    var _a;
    return (_a = object[0]) === null || _a === void 0 ? void 0 : _a.code;
}
exports.instanceOfTypeCustomError = instanceOfTypeCustomError;
function instanceOfTypeMongoError(object) {
    var _a;
    return (_a = object[0]) === null || _a === void 0 ? void 0 : _a.errors;
}
exports.instanceOfTypeMongoError = instanceOfTypeMongoError;
//# sourceMappingURL=typeCheck.js.map