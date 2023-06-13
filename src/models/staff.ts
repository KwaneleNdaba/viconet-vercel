import mongoose from 'mongoose'


export interface IStaff {
  _id?:string;
  profilePicture:string;
  fullName:string;
  title:string;			
  phoneNumber:string;			
  emailAddress:string;	
  _organisation:string;
  _user:string;
}

interface staffInterface extends mongoose.Model<IStaffDoc> {
  build(attr: IStaff): IStaffDoc
}

export interface IStaffDoc extends mongoose.Document {
  profilePicture:string;
  fullName:string;
  title:string;			
  phoneNumber:string;			
  emailAddress:string;	
  _organisation:string;
  _user:string;
}

const staffSchema = new mongoose.Schema({

  profilePicture:{
    type: String,
    required: true
  },
  fullName:{
    type: String,
    required: true
  },
  title:{
    type: String,
    required: true
  },
  phoneNumber:{
    type: String,
    required: true
  },
  emailAddress:{
    type: String,
    required: true
  },
  _organisation:{
    type: String,
    required: true
  },
  _user:{
    type: String,
    required: true
  }
})

staffSchema.statics.build = (attr: IStaff) => {
  return new Staff(attr)
}

const Staff = mongoose.model<IStaffDoc, staffInterface>('staff', staffSchema, "staff")


export { Staff }




