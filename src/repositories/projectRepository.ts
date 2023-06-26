import { instanceOfTypeIPersonnelArray } from "../lib/typeCheck";
import { ICustomError, IMongoError } from "../models/errors";
import { IPersonnel, IPersonnelDoc, Personnel } from "../models/personnel";
import { ICreateProject, IProject, IProjectDoc, IProjectView, IUpdateProject, IUpdateProjectPersonnel, Project } from "../models/project";
import { AddProjectToOrganisation } from "./organisationRepository";
import { GetAllPersonnel } from "./personnelRepository";

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

        if(instanceOfTypeIPersonnelArray(personnel)){
            const fullProjects = project.map(x=> MapProjectPersonnel(x, personnel));
            return fullProjects;
        }

        return {code:"500", message:"Error occured while fetching personnel"}
        
        }catch(e){
            return e as IMongoError;
        }
}


export const GetProjectsByUserId= async function(id:string):Promise<IProjectView[] | IMongoError | ICustomError>{
    try{
        const project = await Project.find({ _creatingUser: id});
        const personnel = await GetAllPersonnel();

        if(instanceOfTypeIPersonnelArray(personnel)){
            const fullProjects = project.map(x=> MapProjectPersonnel(x, personnel));
            return fullProjects;
        }

        return {code:"500", message:"Error occured while fetching personnel"}
        
        }catch(e){
            return e as IMongoError;
        }
}


export const GetProjectById= async function(id:string):Promise<IProjectView | IMongoError |ICustomError>{
    try{
        
        const project = await Project.find({ _id: id});
        const personnel = await GetAllPersonnel();

        if(instanceOfTypeIPersonnelArray(personnel)){
          
            const view = MapProjectPersonnel(project[0], personnel);
           
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

  
  export const UpdatePersonnelOnProject = async function(_project:IUpdateProjectPersonnel):Promise<IProjectView | IMongoError> {
    
    const currentProject = await GetProjectById(_project.projectId) as IProject;
    const allPersonnel = await GetAllPersonnel() as IPersonnel[];
    try{

        switch(_project.status){
            //invited
            case"0":
                const newProject = {...currentProject, pending:`${currentProject.pending},${_project.personnelId}`};
                const project = Project.build(newProject);
                const newProjectDb = await project.updateOne(project);
                const allPersonnel = await GetAllPersonnel() as IPersonnel[];
                const response = MapProjectPersonnel(newProjectDb,allPersonnel);
                return response;
        //accepted
            case "1":
                
                const removed = currentProject.pending.split(",").filter(x=>x == _project.personnelId).join(",");

                const _newProject = {...currentProject, pending:removed, accepted:`${currentProject.pending},${_project.personnelId}`} as IProject;

                // currentProject.pending

                const __project = Project.build(_newProject);
                const _newProjectDb = await project.updateOne(__project);
                const _response = MapProjectPersonnel(_newProjectDb,allPersonnel);
                return _response;
        //declined
            case "2":
                const _removed = currentProject.pending.split(",").filter(x=>x == _project.personnelId).join(",");

                const __newProject = {...currentProject, pending:_removed, declined:`${currentProject.pending},${_project.personnelId}`} as IProject;

                const ___project = Project.build(__newProject);
                const __newProjectDb = await project.updateOne(___project);
                const __response = MapProjectPersonnel(__newProjectDb,allPersonnel);
                return __response;
        //removed
            case "3":
                const __removedInvited = currentProject.pending.split(",").filter(x=>x == _project.personnelId).join(",");
                const __removeAccepted = currentProject.accepted.split(",").filter(x=>x == _project.personnelId).join(",");
                const __removeRejected = currentProject.declined.split(",").filter(x=>x == _project.personnelId).join(",");

                const ___newProject = {...currentProject,
                    accepted:__removeAccepted,
                    pending:__removedInvited,
                    declined:__removeRejected,
                    uninvited:`${currentProject.uninvited},${_project.personnelId}`
                } as IProject;

                const ____project = Project.build(___newProject);
                const ___newProjectDb = await project.updateOne(____project);
                const ___response = MapProjectPersonnel(___newProjectDb,allPersonnel);
                return ___response;
        }
       
    }catch(e){
        return e as IMongoError;
    }
  }





 function MapProjectPersonnel(project:IProjectDoc,  personnel: IPersonnel[]):IProjectView{


    const p = project as any;
        const uninvited = project.uninvited.split(",").map(proj=> personnel.filter(pers=>pers._id== proj)[0]);
        const pending = project.pending.split(",").map(proj=> personnel.filter(pers=>pers._id== proj)[0]);
        const accepted = project.accepted.split(",").map(proj=> personnel.filter(pers=>pers._id== proj)[0]);
        const declined = project.declined.split(",").map(proj=> personnel.filter(pers=>pers._id== proj)[0]);

        const result ={
            ...p._doc, 
            _uninvited:uninvited,
            _pending: pending,
            _accepted:accepted,
            _declined:declined
        } as IProjectView

        return result;

}
