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
exports.UpdateOrganisation = exports.AddOrganisation = exports.GetOrganisationById = exports.GetAllOrganisations = void 0;
const organisations_1 = require("../models/organisations");
const GetAllOrganisations = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const organisation = yield organisations_1.Organisation.find({});
            return organisation;
        }
        catch (e) {
            return e;
        }
    });
};
exports.GetAllOrganisations = GetAllOrganisations;
const GetOrganisationById = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const organisation = yield organisations_1.Organisation.find({ _id: id });
            return organisation[0];
        }
        catch (e) {
            return e;
        }
    });
};
exports.GetOrganisationById = GetOrganisationById;
const AddOrganisation = function (_organisation) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const organisation = organisations_1.Organisation.build(_organisation);
            yield organisation.save();
            return organisation;
        }
        catch (e) {
            return e;
        }
    });
};
exports.AddOrganisation = AddOrganisation;
const UpdateOrganisation = function (_organisation) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const organisation = organisations_1.Organisation.build(_organisation);
            yield organisation.updateOne(organisation);
            return organisation;
        }
        catch (e) {
            return e;
        }
    });
};
exports.UpdateOrganisation = UpdateOrganisation;
//# sourceMappingURL=organisationRepository.js.map