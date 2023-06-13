import { instanceOfTypeIPersonnelArray } from "../lib/typeCheck";
import { ICustomError, IMongoError } from "../models/errors";
import { IPersonnel, IPersonnelDoc, Personnel } from "../models/personnel";
import { IProject, IProjectDoc, IProjectView, Project } from "../models/project";
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

export const AddProject = async function(_project:IProject):Promise<IProjectDoc | IMongoError> {
    try{
        const project = Project.build(_project);
        await project.save()
        return project;
    }catch(e){
        return e as IMongoError;
    }
  }

  export const UpdateProject = async function(_project:IProject):Promise<IProjectDoc | IMongoError> {
    try{
        const project = Project.build(_project);
        await project.updateOne(project)
        return project;
    }catch(e){
        return e as IMongoError;
    }
  }


 function MapProjectPersonnel(project:IProjectDoc,  personnel: IPersonnel[]){

   

        const uninvited = project.uninvited.split(",").map(proj=> personnel.filter(pers=>pers._id== proj)[0]);
        const pending = project.pending.split(",").map(proj=> personnel.filter(pers=>pers._id== proj)[0]);
        const accepted = project.accepted.split(",").map(proj=> personnel.filter(pers=>pers._id== proj)[0]);
        const declined = project.declined.split(",").map(proj=> personnel.filter(pers=>pers._id== proj)[0]);

        const result ={
            ...project, 
            _uninvited:uninvited,
            _pending: pending,
            _accepted:accepted,
            _declined:declined
        } as IProjectView

        return result;

}
