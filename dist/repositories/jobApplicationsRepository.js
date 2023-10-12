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
exports.GetJobApplicationById = exports.GetAllJobApplications = exports.AddJobApplication = void 0;
const jobs_1 = require("../models/jobs");
const AddJobApplication = function (_job) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const job = jobs_1.jobApplication.build(_job);
            yield job.save();
            return job;
        }
        catch (e) {
            // return e as IMongoError;
            return { code: 400, message: e };
        }
    });
};
exports.AddJobApplication = AddJobApplication;
const GetAllJobApplications = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const jobApplications = yield jobs_1.jobApplication.find({});
            return jobApplications;
        }
        catch (e) {
            return e;
        }
    });
};
exports.GetAllJobApplications = GetAllJobApplications;
const GetJobApplicationById = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const jobs = yield jobs_1.jobApplication.find({ _id: id });
            const data = jobs[0];
            return data._doc;
        }
        catch (e) {
            return e;
        }
    });
};
exports.GetJobApplicationById = GetJobApplicationById;
//# sourceMappingURL=jobApplicationsRepository.js.map