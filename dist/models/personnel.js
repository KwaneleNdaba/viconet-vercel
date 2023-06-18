"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Personnel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const personnelSchema = new mongoose_1.default.Schema({
    searchKeys: {
        type: String,
        required: true
    },
    // information:{
    //   type: String,
    //   required: true
    // },
    currentJob: {
        type: Object,
        // required: true
    },
    previousWorkExperience: {
        type: Array,
        // required: true
    },
    yearsOfExperience: {
        type: String,
        // required: true
    },
    education: {
        type: Array,
        // required: true
    },
    keySkills: {
        type: Array,
        required: true
    },
    keyCourses: {
        type: Array,
        required: true
    },
    cvUrl: {
        type: String,
        // required: true
    },
    personalInformation: {
        type: Object,
        // required: true
    },
    _user: {
        type: String,
        // required: true
    },
});
personnelSchema.statics.build = (attr) => {
    return new Personnel(attr);
};
const Personnel = mongoose_1.default.model('personnel', personnelSchema, "personnel");
exports.Personnel = Personnel;
//# sourceMappingURL=personnel.js.map