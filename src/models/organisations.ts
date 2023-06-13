import mongoose from 'mongoose'



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
}

const organisationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  currentPackage: {
    type: String,
    required: true
  },
  renewalDate: {
    type: String,
    required: true
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
  }
})

organisationSchema.statics.build = (attr: IOrganisation) => {
  return new Organisation(attr)
}

const Organisation = mongoose.model<IOrganisationDoc, organisationDocInterface>('organisation', organisationSchema, "organisation")


export { Organisation }




