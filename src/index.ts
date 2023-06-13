import express, { Request, Response } from 'express'
// import express from 'express';
import mongoose from 'mongoose'
import { json, urlencoded } from 'body-parser';
import { userRouter } from './routes/user'
import { personnelRouter } from './routes/personnel';
const formData = require("express-form-data");
const os = require("os");
 const app = express()
const options = {
  uploadDir: os.tmpdir(),
  autoClean: true
};
app.use(json())
app.use(userRouter, personnelRouter)
// const app = express()
const port = process.env.PORT || 8080

app.get('/', (_req: Request, res: Response) => {
	return res.send('Express Typescript on Njinu222')
})

app.get('/ping', (_req: Request, res: Response) => {
	return res.send('pong 🏓')
})

mongoose.connect("mongodb+srv://suntecTMS:suntectms2022@cluster0.zm9cv.mongodb.net/viconet?retryWrites=true&w=majority")

app.listen(port, () => {
	return console.log(`Server is listening on ${port}`)
})
