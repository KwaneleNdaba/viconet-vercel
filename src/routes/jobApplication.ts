import express, { Request, Response, Router } from 'express'
import { ICustomError } from '../models/errors';
import { instanceOfTypeCustomError, instanceOfTypeIUser } from '../lib/typeCheck';
import { IJobApplication, IJobApplicationDoc, jobApplication } from '../models/jobs';
import { AddJobApplication, GetAllJobApplications, GetJobApplicationById } from '../repositories/jobApplicationsRepository';

const router = express.Router()

router.post('/api/jobApplications', async (req: Request, res: Response) => {

    const newJob = new jobApplication(req.body);
    try{
        const job = await AddJobApplication(newJob);
        res.status(200).send(job)
    }catch(error){
        res.status(500).json(error.message)
    }
  })

  router.get('/api/getJobApplications', async (req: Request, res: Response) => {
    const jobApplications = await GetAllJobApplications();
    return res.status(200).send(jobApplications) 
  })


  router.get('/api/jobApplications/:id', async (req: Request, res: Response) => {
  
    const id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {// valid ObjectId
      
      const jobApplication = await GetJobApplicationById(id);
      res.header("Access-Control-Allow-Origin", "*");
      return res.status(200).send(jobApplication)
    }else{
      return res.status(404).send("Cannot find job application");
    }

})
  
  export { router as jobApplicationRouter }
