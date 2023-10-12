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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobApplicationRouter = void 0;
const express_1 = __importDefault(require("express"));
const jobs_1 = require("../models/jobs");
const jobApplicationsRepository_1 = require("../repositories/jobApplicationsRepository");
const router = express_1.default.Router();
exports.jobApplicationRouter = router;
router.post('/api/jobApplications', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newJob = new jobs_1.jobApplication(req.body);
    try {
        const job = yield (0, jobApplicationsRepository_1.AddJobApplication)(newJob);
        res.status(200).send(job);
    }
    catch (error) {
        res.status(500).json(error.message);
    }
}));
router.get('/api/getJobApplications', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jobApplications = yield (0, jobApplicationsRepository_1.GetAllJobApplications)();
    return res.status(200).send(jobApplications);
}));
router.get('/api/jobApplications/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) { // valid ObjectId
        const jobApplication = yield (0, jobApplicationsRepository_1.GetJobApplicationById)(id);
        res.header("Access-Control-Allow-Origin", "*");
        return res.status(200).send(jobApplication);
    }
    else {
        return res.status(404).send("Cannot find job application");
    }
}));
//# sourceMappingURL=jobApplication.js.map