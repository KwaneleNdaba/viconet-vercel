import mongoose from 'mongoose'
import { IPersonnel } from './personnel';

export interface IProjectView extends IProject {
  _uninvited:IPersonnel[];
  _pending:IPersonnel[];
  _declined:IPersonnel[];
  _accepted:IPersonnel[];
}

export interface ICreateProject{
  _organisation:string;
  _creatingUser:string;
  name:string;
  description:string;  
}



export interface IUpdateProject{
  name:string;
  description:string;  
  status:string;
}



export interface IUpdateProjectPersonnel{
  projectId:string;
  personnelId:string;  
  status:string;
  staffId:string;
}



export interface IProject {
  _id?:string;
  _organisation:string;
  _creatingUser:string;
  name:string;
  status:string;
  description:string;  
  //list of personnel id
  uninvited:string;
  pending:string;
  declined:string;
  accepted:string;
}

interface projectInterface extends mongoose.Model<IProjectDoc> {
  build(attr: IProject): IProjectDoc
}

export interface IProjectDoc extends mongoose.Document {

  _organisation:string;
  _creatingUser:string;
  name:string;
  description:string;
  uninvited:string;
  pending:string;
  declined:string;
  accepted:string;
  status:string;
}

const projectSchema = new mongoose.Schema({
  _organisation:{
    type: String,
    required: true
  },
  _creatingUser:{
    type: String,
    required: true
  },  
  description:{
    type: String,
    required: true
  },
  uninvited:{
    type: String
  },  
  pending:{
    type: String
  },
  accepted:{
    type: String
  },
  declined:{
    type: String
  },
  name:{
    type: String
  },
  status:{
    type: String,
    required: true
  }
})

projectSchema.statics.build = (attr: IProject) => {
  return new Project(attr)
}

const Project = mongoose.model<IProjectDoc, projectInterface>('projects', projectSchema, "projects")


export { Project }




