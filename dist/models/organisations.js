"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Organisation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const organisationSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        // required: true
    },
    status: {
        type: String,
        required: true
    },
    currentPackage: {
        type: String,
        // required: true
    },
    renewalDate: {
        type: String,
        // required: true
    },
    mobilePhone: {
        type: String,
        required: true
    },
    _staff: {
        type: String,
        required: true
    },
    _adminStaff: {
        type: String,
        required: true
    },
    _projects: {
        type: String,
        // required: true
    }
});
organisationSchema.statics.build = (attr) => {
    return new Organisation(attr);
};
const Organisation = mongoose_1.default.model('organisations', organisationSchema, "organisations");
exports.Organisation = Organisation;
//# sourceMappingURL=organisations.js.map