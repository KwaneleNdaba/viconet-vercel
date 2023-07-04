import mongoose from 'mongoose'
import { IPersonnel } from './personnel';
import { IStaff } from './staff';

export interface IUser {
  _id?:string;
  title: string;
  firstName: string;
  surname:string;
  email:string;
  password:string;
  mobileNumber:string;
  //userstate: 
  //0 = otp unverified
  //1 = otp verified
  //2 = deleted
  //3 = onboarded - reset password
  type:string;
  //type
  //0: personnel
  //2: staff
  status:number;
  otp: string;
  profilePicture?:string
}

export const UserState = {
  "Unverified":0,
   "Verified":1,
  "Deleted":2,
  "Onboarded":3
}


export const UserType = {
  "Personnel":"1",
  "Staff":"2",
  "Admin":"3"
}


export interface IUserRegisterModel{
  firstName: string;
  surname:string;
  email:string;
  mobileNumber:string;
  password:string;
  type:number;
}

interface userModelInterface extends mongoose.Model<IUserDoc> {
  build(attr: IUser): IUserDoc
}

export interface IUserDoc extends mongoose.Document {
  title: string;
  firstName: string;
  surname:string;
  email:string;
  password:string;
  mobileNumber:string;
  type:string;
  status:number;
  otp:string;
  profilePicture:string

}

const userSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  firstName: {
    type: String, 
    required: true
  },
  surname: {
    type: String, 
    required: true
  },
  email: {
    type: String, 
    required: true,
    unique: true, 
    dropDups: true 
  },
  password: {
    type: String, 
    required: true
  },
  type: {
    type: Number, 
    required: true
  },
  mobileNumber:{
    type:String,
    required:true
  },
  status:{
    type:Number,
    required:true
  },
  otp:{
    type:String
  },
  profilePicture:{
    type:String
  }
})

userSchema.statics.build = (attr: IUser) => {
  return new User(attr)
}

const User = mongoose.model<IUserDoc, userModelInterface>('user', userSchema, "users")


export { User }

export interface ICreatePersonnelUser{

    user:IUser;
    personnel:IPersonnel

}

export interface ICreateStaffUser{
  user:IUser;
  staff:IStaff;
}




