"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const projectSchema = new mongoose_1.default.Schema({
    _organisation: {
        type: String,
        required: true
    },
    _creatingUser: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    uninvited: {
        type: String,
        required: true
    },
    pending: {
        type: String,
        required: true
    },
    accepted: {
        type: String,
        required: true
    },
    declined: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    cvUrl: {
        type: String,
        required: true
    }
});
projectSchema.statics.build = (attr) => {
    return new Project(attr);
};
const Project = mongoose_1.default.model('project', projectSchema, "project");
exports.Project = Project;
//# sourceMappingURL=project.js.map