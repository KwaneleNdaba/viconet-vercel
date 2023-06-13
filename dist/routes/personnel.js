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
exports.personnelRouter = void 0;
const express_1 = __importDefault(require("express"));
const typeCheck_1 = require("../lib/typeCheck");
const searchService_1 = require("../services/searchService");
const personnelRepository_1 = require("../repositories/personnelRepository");
const documentService_1 = require("../services/documentService");
// import AWS from 'aws-sdk';
// import multer from 'multer';
// import multerS3 from 'multer-s3';
// import { v4 as uuidv4 } from 'uuid';
// Configure AWS credentials
// AWS.config.update({
//   accessKeyId: 'AKIAWZJISUVZLVQKQH5Y',
//   secretAccessKey: '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',
// });
// // Create an S3 instance
// const s3 = new AWS.S3();
// // Configure multer to store files in memory
// const storage = multer.memoryStorage();
// const upload = multer({
//   storage: storage,
// });
const router = express_1.default.Router();
exports.personnelRouter = router;
router.post('/api/searchPersonnel', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchKey } = req.body;
    const personnel = yield (0, personnelRepository_1.GetAllPersonnel)();
    if (!(0, typeCheck_1.instanceOfTypeCustomError)(personnel)) {
        const _personnel = personnel;
        const result = yield (0, searchService_1.SearchByKey)(searchKey, _personnel);
        console.log("RERE", result);
        return res.status(200).send(result);
    }
}));
router.post('/api/upload_cv/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    console.log("TREE", id);
    yield (0, documentService_1.parsefile)(req)
        .then((data) => {
        res.status(200).json({
            message: "Success",
            data
        });
    })
        .catch((error) => {
        res.status(400).json({
            message: "An error occurred.",
            error
        });
    });
}));
router.post('/api/personnel', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchKeys, information, currentJob, previousWorkExperience, yearsOfExperience, education, keySkills, keyCourses, cvUrl, personalInformation } = req.body;
    const dbUser = { searchKeys, information, currentJob, previousWorkExperience, yearsOfExperience, education, keySkills, keyCourses, cvUrl, personalInformation };
    const user = yield (0, personnelRepository_1.AddPersonnel)(dbUser);
    return res.status(201).send(user);
}));
//# sourceMappingURL=personnel.js.map