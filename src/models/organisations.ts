import mongoose from 'mongoose'
import { IProject } from './project';
import { IStaff, IStaffViewModel } from './staff';


export interface ICompanyRegisterModel{
  email: string;
  password: string;
  userName:string;
  userSurname: string;
  // mobileNumber: z.string(),  
  userNumber: string;
  companyNumber: string;
  companyReg: string;
  companyName:string;
  companyAdrress: string;
  position:string;
  title?:string;
  userEmail:string;  
  
}

export interface IOrganisationViewModel extends IOrganisation{
  projects: IProject[],
  organisation: IOrganisation,
  staff?:IStaffViewModel[]
}

export interface IOrganisation {
  _id?:string;
  profile:string;
  name:string;	
  description:string;
  status:string;		
  currentPackage:string;		
  renewalDate	:string;	
  mobilePhone:string;	
  _staff:string;
  _projects:string;
  _adminStaff:string;
}

interface organisationDocInterface extends mongoose.Model<IOrganisationDoc> {
  build(attr: IOrganisation): IOrganisationDoc
}

export interface IOrganisationDoc extends mongoose.Document {
  profile:string;
  name:string;	
  description:string;
  status:string;		
  currentPackage:string;		
  renewalDate	:string;		
  mobilePhone:string;	
  _staff:string;
  _adminStaff:string;
  _projects:string;
}

const organisationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    // required: true
  },
  status: {
    type: String,
    required: true
  },
  currentPackage: {
    type: String,
    // required: true
  },
  renewalDate: {
    type: String,
    // required: true
  },
  mobilePhone: {
    type: String,
    required: true
  },
  _staff:{
    type: String,
    required: true
  },
  _adminStaff:{
    type: String,
    required: true
  },
  _projects:{
    type: String,
    // required: true
  }
})

organisationSchema.statics.build = (attr: IOrganisation) => {
  return new Organisation(attr)
}

const Organisation = mongoose.model<IOrganisationDoc, organisationDocInterface>('organisations', organisationSchema, "organisations")


export { Organisation }




