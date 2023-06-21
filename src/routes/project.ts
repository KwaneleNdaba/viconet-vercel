import express, { Request, Response } from 'express'

import { AddProject, GetAllProjects, GetProjectById, GetProjectsByOrgId, UpdateProject } from '../repositories/projectRepository';
import { IProject, IUpdateProject } from '../models/project';
import { ICreateProject } from '../models/project';

const router = express.Router()

router.get('/api/project', async (req: Request, res: Response) => {
  const user = await GetAllProjects();
  return res.status(200).send(user)
})


router.get('/api/project/:id', async (req: Request, res: Response) => {
  
    const id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {// valid ObjectId
      
      const user = await GetProjectById(id);
      res.header("Access-Control-Allow-Origin", "*");
      return res.status(200).send(user)
    }else{
      return res.status(404).send("Cannot find project");
    }

})
router.get('/api/project/organisation/:id', async (req: Request, res: Response) => {
  
    const id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {// valid ObjectId
      
      const user = await GetProjectsByOrgId(id);
      res.header("Access-Control-Allow-Origin", "*");
      return res.status(200).send(user)
    }else{
      return res.status(404).send("Cannot find project");
    }

})

router.get('/api/project/user/:id', async (req: Request, res: Response) => {
  
  const id = req.params.id;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {// valid ObjectId
    
    const user = await GetProjectsByOrgId(id);
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(200).send(user)
  }else{
    return res.status(404).send("Cannot find project");
  }

})


router.post('/api/project', async (req: Request, res: Response) => {
  const { 
    _organisation,
    _creatingUser,
    name,
    description } = req.body;

    const companyRegister = {
      _organisation:_organisation,
      _creatingUser:_creatingUser,
      name:name,
      description:description,
      status:"0"
    
    } as ICreateProject;

    const _project = await AddProject(companyRegister) as IProject;


  return res.status(200).send(_project);

});


router.post('/api/project/:id', async (req: Request, res: Response) => {
  const { 
    name,
    description } = req.body;

    const id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {// valid ObjectId
      const project = {
        name:name,
        description:description,
      } as IUpdateProject;
  
      const _project = await UpdateProject(project, id) as IProject;
  
  
    return res.status(200).send(_project);
    }
 

});



export { router as projectRouter }