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
        type: String
    },
    pending: {
        type: String
    },
    accepted: {
        type: String
    },
    declined: {
        type: String
    },
    name: {
        type: String
    },
    status: {
        type: String,
        required: true
    }
});
projectSchema.statics.build = (attr) => {
    return new Project(attr);
};
const Project = mongoose_1.default.model('projects', projectSchema, "projects");
exports.Project = Project;
//# sourceMappingURL=project.js.map