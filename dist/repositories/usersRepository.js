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
exports.GetUserByEmail = exports.GetUserById = exports.ActivateUser = exports.AddUser = exports.UpdateUser = exports.GetAllUsers = void 0;
const user_1 = require("../models/user");
const emailService_1 = require("../services/emailService");
const GetAllUsers = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield user_1.User.find({});
            return users;
        }
        catch (e) {
            return e;
        }
    });
};
exports.GetAllUsers = GetAllUsers;
const UpdateUser = function (_user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = user_1.User.build(_user);
            yield user.updateOne(user);
            return user;
        }
        catch (e) {
            return e;
        }
    });
};
exports.UpdateUser = UpdateUser;
const AddUser = function (_user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const _otp = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
            const _dbUser = Object.assign(Object.assign({}, _user), { otp: _otp.toString() });
            const user = user_1.User.build(_dbUser);
            yield user.save();
            const email = yield (0, emailService_1.sendMail)(_user.email, `Activate your VICO net profile`, `Your otp is ${_otp.toString()}`, `Activate your VICO net profile", "Your otp is <strong> ${_otp.toString()}</strong>`);
            //TODO: NK remove passeword=> map response
            const clean = Object.assign(Object.assign({}, user), { password: "", status: 0 });
            return user;
        }
        catch (e) {
            // return e as IMongoError;
            return { code: 400, message: e };
        }
    });
};
exports.AddUser = AddUser;
const ActivateUser = function (otp, email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("user", email);
            const person = yield (0, exports.GetUserByEmail)(email);
            console.log("user", person);
            const _otp = person.otp;
            if (otp == _otp) {
                const activatedPerson = Object.assign(Object.assign({}, person), { status: 1 });
                const updated = yield (0, exports.UpdateUser)(activatedPerson);
                return updated;
            }
            else {
                console.log("ERERER1");
                return { code: 400, message: "Incorrect OTP" };
            }
        }
        catch (e) {
            // return e as IMongoError;
            return { code: 400, message: e };
        }
    });
};
exports.ActivateUser = ActivateUser;
const GetUserById = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield user_1.User.find({ _id: id });
            return users[0];
        }
        catch (e) {
            return e;
        }
    });
};
exports.GetUserById = GetUserById;
const GetUserByEmail = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield user_1.User.find({ email: email });
            const data = users[0];
            console.log("data", data);
            return data._doc;
        }
        catch (e) {
            return e;
        }
    });
};
exports.GetUserByEmail = GetUserByEmail;
//# sourceMappingURL=usersRepository.js.map