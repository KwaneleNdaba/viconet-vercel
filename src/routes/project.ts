import express, { Request, Response } from 'express'

import { AddProject, GetAllProjects, GetProjectById, GetProjectsByOrgId, UpdatePersonnelOnProject, UpdateProject, MapProjectPersonnel, GetProjectsByUserId, DeleteProject } from '../repositories/projectRepository';
import { IAddBatchPersonnelToProject, IAddPersonnelToProject, IProject, IProjectView, IRemoveFromProject, IUpdateProject, IUpdateProjectPersonnel, Project } from '../models/project';
import { ICreateProject } from '../models/project';
import { IUser, IUserDoc, User } from '../models/user';
import { INotification } from '../models/notifications';
import { GetBatchUserByPersonnelId } from '../repositories/usersRepository';
import { Personnel } from '../models/personnel';
import { AddBatchNotification } from './notification';
import { RemoveBatchFromShortlist } from '../repositories/staffRepository';

const router = express.Router()

router.get('/api/project', async (req: Request, res: Response) => {
  const user = await GetAllProjects();
  return res.status(200).send(user)
})

router.get('/api/acceptinvite/:personnelId/:projectId', async (req: Request, res: Response) => {
  
  const personnelId = req.params.personnelId;
  const projectId = req.params.projectId;

  if (personnelId.match(/^[0-9a-fA-F]{24}$/) && projectId.match(/^[0-9a-fA-F]{24}$/)) {// valid ObjectId
    const payload = {
      projectId:projectId,
      personnelId:personnelId,
      staffId:"",
      status:"1"
    } as IUpdateProjectPersonnel

    const user = await UpdatePersonnelOnProject(payload);
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(200).send(user)
  }else{
    return res.status(404).send("Cannot find project");
  }

})

router.get('/api/declineinvite/:personnelId/:projectId', async (req: Request, res: Response) => {
  
  const personnelId = req.params.personnelId;
  const projectId = req.params.projectId;

  if (personnelId.match(/^[0-9a-fA-F]{24}$/) && projectId.match(/^[0-9a-fA-F]{24}$/)) {// valid ObjectId
    const payload = {
      projectId:projectId,
      personnelId:personnelId,
      staffId:"",
      status:"2"
    } as IUpdateProjectPersonnel

    const user = await UpdatePersonnelOnProject(payload);
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(200).send(user)
  }else{
    return res.status(404).send("Cannot find project");
  }

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
    
    const user = await GetProjectsByUserId(id);

    res.header("Access-Control-Allow-Origin", "*");
    return res.status(200).send(user)
  }else{
    return res.status(404).send("Cannot find project");
  }

})


router.post('/api/project/shortlist/batch', async (req: Request, res: Response) => {
  const { 
    personelIds,
    staffId,
    projectId} = req.body;

    const request = {
      personelIds,
      staffId,
      projectId
    
    } as IAddBatchPersonnelToProject;

    const _project = await AddBatchPersonnelToProject(request) as IProject;


  return res.status(200).send(_project);

});


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



export const AddBatchPersonnelToProject= async function(_project: IAddBatchPersonnelToProject){

  const currentProject = await GetProjectById(_project.projectId) as any;
  const allUsers = await User.find({});


  const currentPending = currentProject.pending.split(",");
  const metaPending = _project.personelIds;
  const newPending = [...metaPending, ...currentPending];
  const newPendingString = newPending.join(",");
  const pendingClean = newPendingString.charAt(0) === ','? newPendingString.slice(1): newPendingString;


  const newProject = {...currentProject, pending:pendingClean} as IProject;
  const project = Project.build(newProject);
  const newProjectDb = await project.updateOne(project);
  

  //remove from shortlist

  await RemoveBatchFromShortlist(_project.personelIds, _project.staffId);

  //get personnel users 

  const users = await GetBatchUserByPersonnelId(_project.personelIds) as IUserDoc[];
  const allPersonnel = await Personnel.find({_id:_project.personelIds }) as any[];

  const notifications = _project.personelIds.map(personelId=>  {
     
      const personnel = allPersonnel.filter(x=>x._id == personelId)[0];
      const user = users.filter(x=>x._id == personnel._user)[0];
   

      const notification = {
          targetUser:personelId,
          reference:_project.projectId,
          message: "Invited to a new project",
          status:"0",
          type:"0",
          email:user.email,
          phone:user.mobileNumber,
          date:new Date().toString()
      } as INotification
      return notification;
  }); 

  const resp = AddBatchNotification(notifications);
  
  const response = await MapProjectPersonnel(newProject,allPersonnel, users);
  return response;
}



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

router.post('/api/updateProjectPersonnel/', async (req: Request, res: Response) => {
  const { projectId, personnelId, status,staffId } = req.body;
  
      const project = {
        projectId:projectId,
        personnelId:personnelId, 
        status:status,
        staffId
      } as IUpdateProjectPersonnel;
  
      const _project = await UpdatePersonnelOnProject(project) as IProject;
  
  
      return res.status(200).send(_project);
    
 

});
router.post('/api/project/delete/deleteProject', async (req: Request, res: Response) => {
  const { projectId } = req.body;
  

      const _project = await DeleteProject(projectId);
  
  
      return res.status(200).send(_project);
    
 

});

// router.post('/api/addPersonnelToProject/', async (req: Request, res: Response) => {
//   const { projectId, personnelIds, status,staffId } = req.body;
  
//       const project = {
//         projectId:projectId,
//         personnelIds:personnelIds, 
//         status:status,
//         staffId
//       } as IAddPersonnelToProject;
  
//       const _project = await AddMultiplePersonnelToProject(project) as IProject;
  
  
//       return res.status(200).send(_project);
    
 

// });




export { router as projectRouter }