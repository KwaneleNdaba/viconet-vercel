"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import express from 'express';
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = require("body-parser");
const user_1 = require("./routes/user");
const personnel_1 = require("./routes/personnel");
const formData = require("express-form-data");
const os = require("os");
const app = (0, express_1.default)();
const options = {
    uploadDir: os.tmpdir(),
    autoClean: true
};
app.use((0, body_parser_1.json)());
app.use(user_1.userRouter, personnel_1.personnelRouter);
// const app = express()
const port = process.env.PORT || 8080;
app.get('/', (_req, res) => {
    return res.send('Express Typescript on Njinu222');
});
app.get('/ping', (_req, res) => {
    return res.send('pong 🏓');
});
mongoose_1.default.connect("mongodb+srv://suntecTMS:suntectms2022@cluster0.zm9cv.mongodb.net/viconet?retryWrites=true&w=majority");
app.listen(port, () => {
    return console.log(`Server is listening on ${port}`);
});
//# sourceMappingURL=index.js.map