"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserType = exports.UserState = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.UserState = {
    "Unverified": 0,
    "Verified": 1,
    "Deleted": 2,
    "Onboarded": 3
};
exports.UserType = {
    "Personnel": "1",
    "Staff": "2",
    "Admin": "3"
};
const userSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
    },
    firstName: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: Number,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    otp: {
        type: String
    },
    profilePicture: {
        type: String
    }
});
userSchema.statics.build = (attr) => {
    return new User(attr);
};
const User = mongoose_1.default.model('user', userSchema, "users");
exports.User = User;
//# sourceMappingURL=user.js.map