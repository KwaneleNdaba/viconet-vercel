import express, { Request, Response } from 'express'
import { instanceOfTypeCustomError } from '../lib/typeCheck';
import { SearchByKey } from '../services/searchService';
import { AddPersonnel, GetAllPersonnel, GetPersonnelById, GetPersonnelByUserId, ToPersonnelViewModel, UpdatePersonnel } from '../repositories/personnelRepository';
import { IPersonnel, IPersonnelDoc, IPersonnelViewModel } from '../models/personnel';
import {parsefile} from '../services/documentService'
import { IUser, User } from '../models/user';



const router = express.Router()



router.post('/api/searchPersonnel', async (req: Request, res: Response) => {
  const { searchKey } = req.body;
  const personnel = await GetAllPersonnel();
  

  if(!instanceOfTypeCustomError(personnel)){
    const _personnel = personnel as IPersonnelDoc[];
    if(searchKey ==undefined || searchKey==""){
      const _result =await  ToPersonnelViewModel(_personnel);
       return res.status(200).send(_result)
      }
    
    const result = await SearchByKey(searchKey,_personnel);
  
    const responseModels = await ToPersonnelViewModel(result);
  
    return res.status(200).send(responseModels);
  }else{
    return res.status(500).send({message:"an error occured", data:personnel})
  }
})

router.post('/api/upload_cv/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  await parsefile(req)
  .then((data:any) => {

    // res.header("Access-Control-Allow-Origin", "*");
    res.status(200).json({
      message: "Success",
      data
    })
  })
  .catch((error:any) => {

    res.header("Access-Control-Allow-Origin", "*");
    res.status(400).json({
      message: "An error occurred.",
      error
    })
  })
});


router.post('/api/personnel', async (req: Request, res: Response) => {
  const { information, currentJob, previousWorkExperience, yearsOfExperience, education, keySkills, keyCourses, cvUrl, personalInformation, _user, preferedWorkMethod } = req.body;
  const dbUser = {  information, currentJob, previousWorkExperience, yearsOfExperience, education, keySkills, keyCourses, cvUrl, personalInformation, _user:_user, state:0, preferedWorkMethod:preferedWorkMethod } as IPersonnel;

  const user = await AddPersonnel(dbUser);
 
  return res.status(201).send(user)
})

router.get('/api/personnel', async (req: Request, res: Response) => {
  
  const user = await GetAllPersonnel();
 
  return res.status(201).send(user)
})


router.get('/api/personnel/:userId', async (req: Request, res: Response) => {
  const email = req.params.userId;
  const user = await GetPersonnelById(email);

  return res.status(200).send(user)
})

router.get('/api/personnelByUserId/:userId', async (req: Request, res: Response) => {
  const email = req.params.userId;

  const user = await GetPersonnelByUserId(email);

  if(!user){
    const resp = {code:404, message:"User not found"}
    return res.status(404).send(resp)
  }
  return res.status(200).send(user)
})



router.post('/api/personnel/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const { searchKeys, currentJob, previousWorkExperience, yearsOfExperience, education, keySkills, keyCourses, cvUrl, personalInformation, _user,preferedWorkMethod } = req.body;
  const dbUser = {  searchKeys,
    currentJob,
    previousWorkExperience,
    yearsOfExperience,
    education,
    keySkills,
    keyCourses,
    cvUrl,
    personalInformation,
    _user:_user, 
    state:0, 
    _id:id,
    preferedWorkMethod:preferedWorkMethod  } as IPersonnel;


  if (id.match(/^[0-9a-fA-F]{24}$/)) {// valid ObjectId
    
    const user = await UpdatePersonnel(dbUser);    
    return res.status(201).send(user);

  }else{

    return res.status(404).send("Cannot find user");

  }

 
})

export { router as personnelRouter }