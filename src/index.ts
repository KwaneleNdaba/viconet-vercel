import express, { Request, Response } from 'express'
// import express from 'express';
import mongoose from 'mongoose'
import { json, urlencoded } from 'body-parser';
import { userRouter } from './routes/user'
import { personnelRouter } from './routes/personnel';
import { projectRouter } from './routes/project';
import { organiwsationRouter } from './routes/organisation';
import { staffRouter } from './routes/staff';
import { notificationRouter } from './routes/notification';
const formData = require("express-form-data");
require('dotenv').config()

const os = require("os");
 const app = express()
const options = {
  uploadDir: os.tmpdir(),
  autoClean: true
};
app.use(json())
app.use(function(req, res, next) {
	
res.header("Access-Control-Allow-Origin", "https://fraktional-web-be.onrender.com");
res.header("Access-Control-Request-Headers",
"access-control-allow-credentials,access-control-allow-headers,access-control-allow-methods,access-control-allow-origin,authorization,content-type,access-control-allow-origin");
 res.header("Access-Control-Allow-Headers", "Authorization, Access-Control-Allow-Headers,access-control-allow-origin, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

	next();
  });
app.use(userRouter, personnelRouter, projectRouter, organiwsationRouter, staffRouter, notificationRouter)
// const app = express()
const port = process.env.PORT || 8080

app.get('/', (_req: Request, res: Response) => {
	return res.send('Viconet V1')
})

app.get('/ping', (_req: Request, res: Response) => {
	return res.send('pong 🏓')
})



mongoose.connect("mongodb+srv://prince:LTSNsskk113@cluster0.mrb5jxy.mongodb.net/")

app.listen(port, () => {
	return console.log(`Server is listening on ${port}`)
})
