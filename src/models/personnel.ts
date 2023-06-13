import mongoose from 'mongoose'

export interface IPersonalDetails{
profile :string;
name:string;
surname:string;
dateOfBirth	:string;
cellPhone	:string;	
address	:string;
country:string;
province:string;
}

export interface IPersonalInformation{
  profile :string;
  name:string;
  surname:string;
  dateOfBirth	:string;
  cellPhone	:string;	
  address	:string;
  country:string;
  province:string;
}

export interface IJobInformation{
  employer:string,
  jobTitle:string,
  startDate:string,
  endDate:string
}

export interface IEducationInformation{
  instituteName:string,
  qualification:string,
  dateCompleted:string
}
export interface IPersonnel {
  _id?:string;
  searchKeys:string;
  information:string;
  currentJob: IJobInformation;
  previousWorkExperience:IJobInformation[];
  yearsOfExperience:string,
  education:IEducationInformation,
  keySkills: string;
  keyCourses:string;
  cvUrl:string;
  personalInformation:IPersonalInformation;
  _user:string;
  
}

interface personnelDocInterface extends mongoose.Model<IPersonnelDoc> {
  build(attr: IPersonnel): IPersonnelDoc
}

export interface IPersonnelDoc extends mongoose.Document {
  searchKeys:string;
  information:string;
  currentJob: IJobInformation;
  previousWorkExperience:IJobInformation[];
  yearsOfExperience:string,
  education:IEducationInformation,
  keySkills: string;
  keyCourses:string;
  cvUrl:string;
  personalInformation:IPersonalInformation;
  _user:string;
}

const personnelSchema = new mongoose.Schema({
  searchKeys: {
    type: String,
    required: true
  },
  information:{
    type: String,
    required: true
  },
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
    type: String,
    required: true
  },
  keyCourses:{
    type: String,
    required: true
  },
  cvUrl:{
    type: String,
    required: true
  },
  personalInformation: {
    type: Object,
    // required: true
  },
  _user: {
    type: Object,
    // required: true
  },
})

personnelSchema.statics.build = (attr: IPersonnel) => {
  return new Personnel(attr)
}

const Personnel = mongoose.model<IPersonnelDoc, personnelDocInterface>('personnel', personnelSchema, "personnel")


export { Personnel }




