import mongoose from 'mongoose'
import { IUser } from './user';

export interface IPersonalInformation{
  _id?:string;
  about? :string;
  name?:string;
  surname?:string;
  dateOfBirth?	:string; //not sent
  address?	:string; //not sent
  country?:string; //not sent 
  province?:string;
}
export interface IJobResponsibilities{
  content:string
}

export interface IJobInformation{
  employer:string,
  jobTitle:string,
  startDate:string,
  endDate:string
  responsibilities?:IJobResponsibilities[]
}

export interface IEducationInformation{
  instituteName:string,
  qualification:string,
  dateCompleted:string
}
export interface IPersonnel {
  _id?:string;
  searchKeys?:string;
  // information?:string; // personal info->about
  currentJob?: IJobInformation;
  previousWorkExperience?:IJobInformation[];
  yearsOfExperience?:string,
  education?:IEducationInformation[],
  keySkills?: string[];
  keyCourses?:string[];
  cvUrl?:string;
  personalInformation?:IPersonalInformation;
  _user?:string;
  state?:number;
  preferedWorkMethod?:number;
  
}

export interface IPersonnelViewModel extends IPersonnel{
  user: IUser;
}
interface personnelDocInterface extends mongoose.Model<IPersonnelDoc> {
  build(attr: IPersonnel): IPersonnelDoc
}

export interface IPersonnelDoc extends mongoose.Document {
  searchKeys?:string;
  // information?:string; // personal info->about
  currentJob?: IJobInformation;
  previousWorkExperience?:IJobInformation[];
  yearsOfExperience?:string,
  education?:IEducationInformation[],
  keySkills?: string[];
  keyCourses?:string[];
  cvUrl?:string;
  personalInformation:IPersonalInformation;
  _user:string;
  state:number;
  projectState:string;
  preferedWorkMethod:number;
  profilePicture?:string
}

const personnelSchema = new mongoose.Schema({
  searchKeys: {
    type: String,
    // required: true
  },
  // information:{
  //   type: String,
  //   required: true
  // },
  currentJob:{
    type: Object,
    // required: true
  },
  previousWorkExperience:{
    type: Array,
    // required: true
  },
  yearsOfExperience:{
    type: String,
    // required: true
  },
  education: {
    type: Array,
    // required: true
  },
  keySkills:{
    type: Array,
    // required: true
  },
  keyCourses:{
    type: Array,
    // required: truex`
  },
  cvUrl:{
    type: String,
    // required: true
  },
  personalInformation: {
    type: Object,
    // required: true
  },
  _user: {
    type: String,
    // required: true
  },
  state: {
    type: String,
    // required: true
  },
  projectState: {
    type: String,
    // required: true
  },
  preferedWorkMethod: {
    type: Number,
    // required: true
  },
})

personnelSchema.statics.build = (attr: IPersonnel) => {
  return new Personnel(attr)
}

const Personnel = mongoose.model<IPersonnelDoc, personnelDocInterface>('personnel', personnelSchema, "personnel")


export { Personnel }




