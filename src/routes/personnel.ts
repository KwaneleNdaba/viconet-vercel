import express, { Request, Response } from 'express'
import { instanceOfTypeCustomError } from '../lib/typeCheck';
import { SearchByKey } from '../services/searchService';
import { AddPersonnel, GetAllPersonnel } from '../repositories/personnelRepository';
import { IPersonnel, IPersonnelDoc } from '../models/personnel';
import {parsefile} from '../services/documentService'

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
const router = express.Router()



router.post('/api/searchPersonnel', async (req: Request, res: Response) => {
  const { searchKey } = req.body;
  const personnel = await GetAllPersonnel();

  if(!instanceOfTypeCustomError(personnel)){
    const _personnel = personnel as IPersonnelDoc[];

    const result = await SearchByKey(searchKey,_personnel)
    console.log("RERE",result)
    return res.status(200).send(result);
  }
})

router.post('/api/upload_cv/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log("TREE", id)

  await parsefile(req)
  .then((data:any) => {
    res.status(200).json({
      message: "Success",
      data
    })
  })
  .catch((error:any) => {
    res.status(400).json({
      message: "An error occurred.",
      error
    })
  })
});

router.post('/api/personnel', async (req: Request, res: Response) => {
  const { searchKeys, information, currentJob, previousWorkExperience, yearsOfExperience, education, keySkills, keyCourses, cvUrl, personalInformation } = req.body;
  const dbUser = {  searchKeys, information, currentJob, previousWorkExperience, yearsOfExperience, education, keySkills, keyCourses, cvUrl, personalInformation  } as IPersonnel;
  
  const user = await AddPersonnel(dbUser);
 
  return res.status(201).send(user)
})


export { router as personnelRouter }