"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Staff = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const staffSchema = new mongoose_1.default.Schema({
    profilePicture: {
        type: String,
        required: false
    },
    position: {
        type: String,
        required: true
    },
    _organisation: {
        type: String,
        // required: true
    },
    _user: {
        type: String,
        required: true
    },
});
staffSchema.statics.build = (attr) => {
    return new Staff(attr);
};
const Staff = mongoose_1.default.model('staff', staffSchema, "staff");
exports.Staff = Staff;
//# sourceMappingURL=staff.js.map