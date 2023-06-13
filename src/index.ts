import express from 'express';
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
// app.use(formData.parse(options));
// // delete from the request all empty files (size == 0)
// app.use(formData.format());
// // change the file objects to fs.ReadStream 
// app.use(formData.stream());
// // union the body and the files
// app.use(formData.union());
app.use(userRouter, personnelRouter)

mongoose.connect("mongodb+srv://suntecTMS:suntectms2022@cluster0.zm9cv.mongodb.net/viconet?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}, () => {
  console.log('connected to database')
})

app.listen(3000, () => {
  console.log('server is listening on port 3000')
})