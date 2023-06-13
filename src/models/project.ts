import mongoose from 'mongoose'
import { IPersonnel } from './personnel';

export interface IProjectView extends IProject {
  _uninvited:IPersonnel[];
  _pending:IPersonnel[];
  _declined:IPersonnel[];
  _accepted:IPersonnel[];
}

export interface IProject {
  _id?:string;
  _organisation:string;
  _creatingUser:string;
  name:string;
  description:string;
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
    type: String,
    required: true
  },  
  pending:{
    type: String,
    required: true
  },
  accepted:{
    type: String,
    required: true
  },
  declined:{
    type: String,
    required: true
  },
  name:{
    type: String,
    required: true
  },
  cvUrl:{
    type: String,
    required: true
  }
})

projectSchema.statics.build = (attr: IProject) => {
  return new Project(attr)
}

const Project = mongoose.model<IProjectDoc, projectInterface>('project', projectSchema, "project")


export { Project }




