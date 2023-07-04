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
exports.HashPassword = exports.LoginUser = void 0;
const typeCheck_1 = require("../lib/typeCheck");
const usersRepository_1 = require("../repositories/usersRepository");
const bcrypt = require('bcrypt');
const LoginUser = function (email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield (0, usersRepository_1.GetUserByEmail)(email);
        if ((0, typeCheck_1.instanceOfTypeIUser)(user)) {
            if (user.status == 2) {
                return { code: 401, message: "User has been deleted" };
            }
            const result = yield bcrypt.compare(password, user.password);
            if (result == true) {
                const responseUser = Object.assign(Object.assign({}, user), { password: "" });
                return responseUser;
            }
            else {
                return { code: 401, message: "Incorrect email/password combination" };
            }
        }
        else {
            return { code: 404, message: "Cannot find user" };
        }
    });
};
exports.LoginUser = LoginUser;
const HashPassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        const saltRounds = 10;
        const salt = "$2b$10$O.v22NpswdZqTkZt1oS/Ge";
        const hash = yield bcrypt.hash(password, salt);
        return hash;
    });
};
exports.HashPassword = HashPassword;
//# sourceMappingURL=loginService.js.map