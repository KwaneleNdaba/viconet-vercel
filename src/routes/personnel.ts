import express, { Request, Response } from 'express'
import { instanceOfTypeCustomError } from '../lib/typeCheck';
import { SearchByKey } from '../services/searchService';
import { AddPersonnel, GetAllPersonnel, GetPersonnelByUserId, UpdatePersonnel } from '../repositories/personnelRepository';
import { IPersonnel, IPersonnelDoc } from '../models/personnel';
import {parsefile} from '../services/documentService'


const router = express.Router()



router.post('/api/searchPersonnel', async (req: Request, res: Response) => {
  const { searchKey } = req.body;
  const personnel = await GetAllPersonnel();

  if(!instanceOfTypeCustomError(personnel)){
    const _personnel = personnel as IPersonnelDoc[];

    const result = await SearchByKey(searchKey,_personnel)

    return res.status(200).send(result);
  }
})

router.post('/api/upload_cv/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  await parsefile(req)
  .then((data:any) => {
    console.log("data",data)
    // res.header("Access-Control-Allow-Origin", "*");
    res.status(200).json({
      message: "Success",
      data
    })
  })
  .catch((error:any) => {
    console.log("data",error)
    res.header("Access-Control-Allow-Origin", "*");
    res.status(400).json({
      message: "An error occurred.",
      error
    })
  })
});

router.post('/api/personnel', async (req: Request, res: Response) => {
  const { searchKeys, information, currentJob, previousWorkExperience, yearsOfExperience, education, keySkills, keyCourses, cvUrl, personalInformation, _user } = req.body;
  const dbUser = {  searchKeys, information, currentJob, previousWorkExperience, yearsOfExperience, education, keySkills, keyCourses, cvUrl, personalInformation, _user:_user, state:0 } as IPersonnel;
  
  const user = await AddPersonnel(dbUser);
 
  return res.status(201).send(user)
})

router.get('/api/personnel', async (req: Request, res: Response) => {
  
  const user = await GetAllPersonnel();
 
  return res.status(201).send(user)
})


router.get('/api/personnel/:userId', async (req: Request, res: Response) => {
  const email = req.params.userId;
  const user = await GetPersonnelByUserId(email);
 
  return res.status(200).send(user)
})



router.post('/api/personnel/:id', async (req: Request, res: Response) => {
  const { searchKeys, information, currentJob, previousWorkExperience, yearsOfExperience, education, keySkills, keyCourses, cvUrl, personalInformation, userId } = req.body;
  const dbUser = {  searchKeys, information, currentJob, previousWorkExperience, yearsOfExperience, education, keySkills, keyCourses, cvUrl, personalInformation, _user:userId, state:0  } as IPersonnel;
  
  const id = req.params.id;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {// valid ObjectId
    
    const user = await UpdatePersonnel(dbUser);    
    return res.status(201).send(user);

  }else{

    return res.status(404).send("Cannot find user");

  }

 
})

export { router as personnelRouter }