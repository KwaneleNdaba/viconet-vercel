import { INotification } from "../models/notifications";
import { instanceOfTypeIPersonnelArray } from "../lib/typeCheck";
import { ICustomError, IMongoError } from "../models/errors";
import { IPersonnel, IPersonnelDoc, Personnel } from "../models/personnel";
import { IAddPersonnelToProject, ICreateProject, IProject, IProjectDoc, IProjectView, IUpdateProject, IUpdateProjectPersonnel, Project } from "../models/project";
import { AddNotification, GetNotificationById, GetNotificationByTargetAndReference, UpdateNotification } from "./notificatonsRepository";
import { AddProjectToOrganisation } from "./organisationRepository";
import { GetAllPersonnel, GetPersonnelByUserId, ToPersonnelViewModel, ToPersonnelViewModelSync } from "./personnelRepository";
import { RemoveFromShortlist } from "./staffRepository";
import { GetUserByEmail, GetUserById } from "./usersRepository";
import { IUser, IUserDoc, User } from "../models/user";

export const GetAllProjects= async function():Promise<IProjectDoc[] | IMongoError>{
    try{
        const personnel = await Project.find({})
        return personnel as IProjectDoc[];
        }catch(e){
            return e as IMongoError;
        }
}

export const GetProjectsByOrgId= async function(id:string):Promise<IProjectView[] | IMongoError | ICustomError>{
    try{
        const project = await Project.find({ _organisation: id});
        const personnel = await GetAllPersonnel();
        const users = await User.find({});
        if(instanceOfTypeIPersonnelArray(personnel)){
            const fullProjects = project.map(x=> MapProjectPersonnelSync(x, personnel,users));
            return fullProjects;
        }

        return {code:"500", message:"Error occured while fetching personnel"}
        
        }catch(e){
            return e as IMongoError;
        }
}


export const GetProjectsByUserId= async function(id:string):Promise<IProject[] | IMongoError | ICustomError>{
    try{
      
        const project = await Project.find({ _creatingUser: id});
        
        return project;
        
        
        }catch(e){
            return e as IMongoError;
        }
}


export const GetProjectById= async function(id:string):Promise<IProjectView | IMongoError |ICustomError>{
    try{
        
        const project = await Project.find({ _id: id});
        const personnel = await GetAllPersonnel();

        if(instanceOfTypeIPersonnelArray(personnel)){
          const doc = project[0] as any;
          const users =await User.find({});
         
            const view = MapProjectPersonnelForProject(doc._doc, personnel, users);
         
            return view;
        }

        return {code:"500", message:"Error occured while fetching personnel"}

        }catch(e){
            return e as IMongoError;
        }
}

export const AddProject = async function(_project:ICreateProject):Promise<IProjectDoc | IMongoError> {
    try{

        const projectPayload ={
            _organisation:_project._organisation,
            _creatingUser:_project._creatingUser,
            name:_project.name,
            status:"0",
            description:_project.description,  
            //list of personnel id
            uninvited:"",
            pending:"",
            declined:"",
            accepted:""
        } as IProject;

        const project = Project.build(projectPayload);
        const projectDb =  await project.save();

        const org = await AddProjectToOrganisation(project._organisation,projectDb.id)
    
        return project;
    }catch(e){
        return e as IMongoError;
    }
  }

  export const UpdateProject = async function(_project:IUpdateProject, _projectId: string):Promise<IProjectDoc | IMongoError> {
    try{
        const currentProject = await GetProjectById(_projectId) as IProject;
        const newProject = {...currentProject, description: _project.description, name:_project.name}
        const project = Project.build(newProject);
        await project.updateOne(project);
        return project;
    }catch(e){
        return e as IMongoError;
    }
  }

  export const DeleteProject = async function( _projectId: string):Promise<any | IMongoError> {
    try{
       
        const deleteRes = await Project.deleteOne({_id:_projectId});
       
        return deleteRes;
    }catch(e){
        return e as IMongoError;
    }
  }


export function MapBatchProjectPersonnel(project:IProject,  personnel: IPersonnel[], users:IUserDoc[]):IProjectView{


    // const p = _project as any;
    // const project = p._doc as IProject;
       
        const uninvited = project.uninvited.split(",").map(proj=> personnel.filter(pers=>pers._id.toString()== proj)[0]).filter(x=>x!=undefined);
        const pending = project.pending.split(",").map(proj=> personnel.filter(pers=>pers._id.toString()== proj)[0]).filter(x=>x!=undefined);;
        const accepted =project.accepted.split(",").map(proj=> personnel.filter(pers=>pers._id.toString()== proj)[0]).filter(x=>x!=undefined);;
        const declined =project.declined.split(",").map(proj=> personnel.filter(pers=>pers._id.toString()== proj)[0]).filter(x=>x!=undefined);;
      

        const _uninvited = ToPersonnelViewModelSync(uninvited,users);
        const _pending = ToPersonnelViewModelSync(pending,users);
        const _accepted = ToPersonnelViewModelSync(accepted,users);
        const _declined = ToPersonnelViewModelSync(declined,users);


        const result ={
          ...project, 
            _uninvited:_uninvited,
            _pending: _pending,
            _accepted:  _accepted,
            _declined:_declined
        } as IProjectView

        return result;

}


  export const UpdatePersonnelOnProject = async function(_project:IUpdateProjectPersonnel):Promise<IProjectView | IMongoError> {
    
    const currentProject = await GetProjectById(_project.projectId) as any;
    // const currentProject = _currentProject._doc as IProject;
    const users =await User.find({});
    const allPersonnel = await GetAllPersonnel() as IPersonnel[];
    const personnelUser = allPersonnel.filter(x=>x._id == _project.personnelId)[0] as IPersonnel;
    const user = await GetUserById(personnelUser._user) as IUser;
    try{
        
        switch(_project.status){
            //invited
            case"0":
                const currentPending = currentProject.pending.split(",");
                const pending = currentPending.length>0?[...currentPending,_project.personnelId].join(","): _project.personnelId;
                const pendingClean = pending.charAt(0) === ','? pending.slice(1): pending;
               
                const newProject = {...currentProject, pending:pendingClean} as IProject;
                const project = Project.build(newProject);
        
                const newProjectDb = await project.updateOne(project);
                //remove from shortlist
              
                await RemoveFromShortlist(_project.personnelId, _project.staffId);

           
                //send notification
                const notification = {
                    targetUser: _project.personnelId,
                    reference:_project.projectId,
                    message: "Invited to a new project",
                    status:"0",
                    type:"0",
                    email:user.email,
                    phone:user.mobileNumber,
                    date:new Date().toString()
                } as INotification
                
     
                const resp = AddNotification(notification);
                const users =await User.find({});
                const response = await MapProjectPersonnel(newProject,allPersonnel, users);
                return response;
        //accepted
            case "1":
                
                const newPending = currentProject.pending.split(",").filter((x:any)=>x != _project.personnelId).join(",");
                const currentAccepted =  currentProject.accepted.split(",");

                const accepted = currentAccepted.length>0?[...currentAccepted,_project.personnelId].join(","): _project.personnelId;
                const acceptedClean = accepted.charAt(0) === ','? accepted.slice(1): pending;
               
                const _newProject = {...currentProject, pending:newPending, accepted:acceptedClean} as IProject;
           
                const __project = Project.build(_newProject);
                const _newProjectDb = await __project.updateOne(__project);
                
                const _notification = await GetNotificationByTargetAndReference(_project.personnelId, _project.projectId) as INotification;
                const newNotification = {..._notification, status:"1"} as INotification;
                const updatedNotification = await UpdateNotification(newNotification);
               
                const _response = await MapProjectPersonnel(_newProject,allPersonnel, users);
                return _response;
        //declined
            case "2":
                const _newPending = currentProject.pending.split(",").filter((x:any)=>x != _project.personnelId).join(",");
                const currentDeclined =  currentProject.declined.split(",");

                const declined = currentDeclined.length>0?[...currentDeclined,_project.personnelId].join(","): _project.personnelId;
                const declinedClean = declined.charAt(0) === ','? declined.slice(1): declined;

                const __newProject = {...currentProject, pending: _newPending, declined:declinedClean} as IProject;
               
                const ___project = Project.build(__newProject);
              
                const __newProjectDb = await ___project.updateOne(___project);
                
                const __notification = await GetNotificationByTargetAndReference(_project.personnelId, _project.projectId) as INotification;
                const _newNotification = {...__notification, status:"1"} as INotification;
                const _updatedNotification = await UpdateNotification(_newNotification);

                const __response = await MapProjectPersonnel(__newProject,allPersonnel,users);
                return __response;
        //removed
            case "3":
                const __removedInvited = currentProject.pending.split(",").filter((x:any)=>x != _project.personnelId).join(",");
                const __removeAccepted = currentProject.accepted.split(",").filter((x:any)=>x != _project.personnelId).join(",");
                const __removeRejected = currentProject.declined.split(",").filter((x:any)=>x != _project.personnelId).join(",");
       
                const __removedInvitedClean = __removedInvited.charAt(0) === ','? __removedInvited.slice(1): __removedInvited;
                const __removeAcceptedClean = __removeAccepted.charAt(0) === ','? __removeAccepted.slice(1): __removeAccepted;
                const __removeRejectedClean = __removeRejected.charAt(0) === ','? __removeRejected.slice(1): __removeRejected;
                const uninvited =`${currentProject.uninvited},${_project.personnelId}`;
                const uninvitedClean =  uninvited.charAt(0) === ','? uninvited.slice(1): uninvited;

                const ___newProject = {...currentProject,
                    accepted:__removeAcceptedClean,
                    pending:__removedInvitedClean,
                    declined:__removeRejectedClean,
                    uninvited:uninvitedClean
                } as IProject;

                const ____project = Project.build(___newProject);
                const ___newProjectDb = await ____project.updateOne(____project);
                const ___response = await MapProjectPersonnel(___newProjectDb,allPersonnel, users);
                return ___response;
        }
       
    }catch(e){
        return e as IMongoError;
    }
  }


    

function MapProjectPersonnelSync(project:IProject,  personnel: IPersonnel[], users:IUser[]):IProjectView{


        const uninvited = ToPersonnelViewModelSync(project.uninvited.split(",").map(proj=> personnel.filter(pers=>pers._id.toString()== proj)[0]),users);
        
        const _p = project.pending.split(",").map(proj=> personnel.filter(pers=>pers._id.toString()== proj)[0]).filter(x=>x!=undefined);

        const pending =  ToPersonnelViewModelSync(_p,users);
       
        const _a = project.accepted.split(",").map(proj=> personnel.filter(pers=>pers._id.toString()== proj)[0]).filter(x=>x!=undefined);
        const accepted = ToPersonnelViewModelSync(_a,users);
       
        const _d = project.declined.split(",").map(proj=> personnel.filter(pers=>pers._id.toString()== proj)[0]).filter(x=>x!=undefined);
        const declined = ToPersonnelViewModelSync(_d,users);
   
        const result ={
          ...project, 
            _uninvited:uninvited,
            _pending: pending,
            _accepted:  accepted,
            _declined:declined
        } as IProjectView

    
    
        return result;

}



 export function MapProjectPersonnel(project:IProject,  personnel: IPersonnel[], users:IUserDoc[]):IProjectView{


    // const p = _project as any;
    // const project = p._doc as IProject;
       
        const uninvited = project.uninvited.split(",").map(proj=> personnel.filter(pers=>pers._id.toString()== proj)[0]).filter(x=>x!=undefined);
        const pending = project.pending.split(",").map(proj=> personnel.filter(pers=>pers._id.toString()== proj)[0]).filter(x=>x!=undefined);;
        const accepted =project.accepted.split(",").map(proj=> personnel.filter(pers=>pers._id.toString()== proj)[0]).filter(x=>x!=undefined);;
        const declined =project.declined.split(",").map(proj=> personnel.filter(pers=>pers._id.toString()== proj)[0]).filter(x=>x!=undefined);;

        const _uninvited = ToPersonnelViewModelSync(uninvited,users);
        const _pending = ToPersonnelViewModelSync(pending,users);
        const _accepted = ToPersonnelViewModelSync(accepted,users);
        const _declined = ToPersonnelViewModelSync(declined,users);


        const result ={
          ...project, 
            _uninvited:_uninvited,
            _pending: _pending,
            _accepted:  _accepted,
            _declined:_declined
        } as IProjectView
      
        return result;

}

export function MapProjectPersonnelForProject(project:IProject,  personnel: IPersonnel[], users:IUserDoc[]):IProjectView{
   

    // const p = _project as any;
    // const project = p._doc as IProject;
       
        const uninvited = project.uninvited.split(",").map(proj=> personnel.filter(pers=>pers._id.toString()== proj)[0]).filter(x=>x!=undefined);
        const pending = project.pending.split(",").map(proj=> personnel.filter(pers=>pers._id.toString()== proj)[0]).filter(x=>x!=undefined);;
        const accepted =project.accepted.split(",").map(proj=> personnel.filter(pers=>pers._id.toString()== proj)[0]).filter(x=>x!=undefined);;
        const declined =project.declined.split(",").map(proj=> personnel.filter(pers=>pers._id.toString()== proj)[0]).filter(x=>x!=undefined);;

        const _uninvited = ToPersonnelViewModelSync(uninvited,users);
        const _pending = ToPersonnelViewModelSync(pending,users);
        const _accepted = ToPersonnelViewModelSync(accepted,users);
        const _declined = ToPersonnelViewModelSync(declined,users);


        const result ={
          ...project, 
            _uninvited:_uninvited,
            _pending: _pending,
            _accepted:  _accepted,
            _declined:_declined
        } as IProjectView
      
        return result;

}



