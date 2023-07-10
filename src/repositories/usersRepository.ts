import { HashPassword } from "../services/loginService";
import { ICustomError, IMongoError } from "../models/errors";
import { IUser, IUserDoc, User  } from "../models/user";
import { sendMail } from "../services/emailService";
import { Personnel } from "../models/personnel";
import { IPersonnel } from "../models/personnel";

export const GetAllUsers= async function():Promise<IUser[] | IMongoError>{
    try{
    const users = await User.find({})
    return users as IUser[];
    }catch(e){
        return e as IMongoError;
    }
  
  }

  export const UpdateUser= async function(_user:IUser):Promise<IUserDoc | IMongoError>{
    try{
        const user = User.build(_user);
        await user.updateOne(user )
        return user;
    }catch(e){
        return e as IMongoError;
    }
  }

  export const AddUser = async function(_user:IUser):Promise<IUser | ICustomError> {
    try{
      const _otp = Math.floor(Math.random() * (99999 -10000 + 1)) + 10000;
      const _dbUser = {..._user, otp:_otp.toString()} as IUser;
        const user = User.build(_dbUser);
        await user.save();
        const email = await sendMail(_user.email, `Activate your VICO net profile`, `Your otp is ${_otp.toString()}`, `Activate your VICO net profile, Your otp is <strong> ${_otp.toString()}</strong>` );
        //TODO: NK remove passeword=> map response
        const clean = {...user, password:"", status:0} as IUser
      
        return user;
    }catch(e){
        // return e as IMongoError;
        return {code:400, message:e } as ICustomError
    }
  }

  export const ActivateUser = async function(otp:string, email:string):Promise<IUser | ICustomError | IMongoError> {
    try{

        const person = await GetUserByEmail(email) as IUser;

        const _otp = person.otp;
        if(otp == _otp){
          
          const activatedPerson = {...person, status:1}
          const updated = await UpdateUser(activatedPerson);
          return updated;
        }else{
          return {code:400, message:"Incorrect OTP"} as ICustomError
        }

    }catch(e){
        // return e as IMongoError;
        return {code:400, message:e } as ICustomError
    }
  }

  export const OnboardUser = async function(otp:string, email:string, password:string):Promise<IUser | ICustomError | IMongoError> {
    try{

        const person = await GetUserByEmail(email) as IUser;

        const _otp = person.otp;
        if(otp == _otp){
          
          const activatedPerson = {...person, status:1, password:password};
          const updated = await UpdateUser(activatedPerson);
          return updated;
        }else{
          return {code:400, message:"Incorrect Link"} as ICustomError
        }

    }catch(e){
        // return e as IMongoError;
        return {code:400, message:e } as ICustomError
    }
  }

  export const GetUserProfilePicture = async function(userId:string):Promise<string | ICustomError | IMongoError> {
    try{

        const person = await GetUserById(userId) as IUser;
         
          return person.profilePicture;
     
    }catch(e){
        // return e as IMongoError;
        return {code:400, message:e } as ICustomError
    }
  }

  
  export const ChangePassword = async function(email:string, password:string):Promise<IUser | ICustomError | IMongoError> {
    try{

        const person = await GetUserByEmail(email) as IUser;
        const newPassword = await HashPassword(password)
        const newPerson = {...person, password:newPassword} as IUser;
        
          const updated = await UpdateUser(newPerson);
          return updated;
     

    }catch(e){
        // return e as IMongoError;
        return {code:400, message:e } as ICustomError
    }
  }

      
  export const SendOTP = async function(_email:string):Promise<IUser | ICustomError | IMongoError> {
    try{

        const _user = await GetUserByEmail(_email) as IUser;

        const _otp = Math.floor(Math.random() * (99999 -10000 + 1)) + 10000;

        const _dbUser = {..._user, otp:_otp.toString()} as IUser;
          const user = User.build(_dbUser);
          const up = await user.updateOne(user);
      
          const email = await sendMail(_user.email, `Reset your VICO net password`, `Your otp is ${_otp.toString()}`, `Your otp is <strong> ${_otp.toString()}</strong>` );
     
          //TODO: NK remove passeword=> map response
          const clean = {...user, password:"", otp:""} as IUser
        return clean;

    }catch(e){
        // return e as IMongoError;
        return {code:400, message:e } as ICustomError
    }
  }
  export const GetBatchUserById = async function(id:string[]):Promise<IUser| IMongoError>{
    try{
    const users = await User.find({ _id: id})
    const data = users[0] as any;
    return data._doc as IUser;
    }catch(e){
        return e as IMongoError;
    }
  
  }

  export const GetBatchUserByPersonnelId = async function(personnelIds:string[]):Promise<IUser[]| IMongoError>{
    try{
     const personnel = await Personnel.find({_id:personnelIds})as IPersonnel[];
     const personnelUserIds = personnel.map(x=>x._user);

    const users = await User.find({ _id: personnelUserIds}) as any[];
    const response = users.map(x=>x._doc) as IUser[];
    return response;
    }catch(e){
        return e as IMongoError;
    }
  
  }



    
  export const VerifyOTPAndResetPassword = async function(email:string, password:string, otp:string):Promise<IUser | ICustomError | IMongoError> {
    try{

        const person = await GetUserByEmail(email) as IUser;
        if(otp == person.otp){
          const newPassword = await HashPassword(password)
          const newPerson = {...person, password:newPassword} as IUser;
          
            const updated = await UpdateUser(newPerson);
            return updated;
        }else{
          return {code:401, message:"Invalid OTP provided"} as ICustomError
        }

    }catch(e){
        // return e as IMongoError;
        return {code:400, message:e } as ICustomError
    }
  }

    

  export const ChangePasswordAndActivate = async function(email:string, password:string):Promise<IUser | ICustomError | IMongoError> {
    try{

        const person = await GetUserByEmail(email) as IUser;
        const newPassword = await HashPassword(password)
        const newPerson = {...person, password:newPassword, status:1} as IUser;
        
          const updated = await UpdateUser(newPerson);
          return updated;
     

    }catch(e){
        // return e as IMongoError;
        return {code:400, message:e } as ICustomError
    }
  }


  export const GetUserById = async function(id:string):Promise<IUser| IMongoError>{
    try{
    const users = await User.find({ _id: id})
    const data = users[0] as any;
    return data._doc as IUser;
    }catch(e){
        return e as IMongoError;
    }
  
  }

  

  export const GetUserByEmail = async function(email:string):Promise<IUser| IMongoError>{
    try{
    const users = await User.find({ email: email})
    const data = users[0] as any;

    return data._doc as IUser;
    }catch(e){
        return e as IMongoError;
    }
  
  }

  export const DeleteUser = async function(userId:string):Promise<IUser | IMongoError> {
    try{
        const _user = await GetUserById(userId) as IUser;
        console.log("DSSDSDSD")
        const newUser = {
            ..._user,
            status:2,
            email:`${_user.email}--deleted-${new Date().getTime()}`
        } as IUser;
      
        const user = User.build(newUser);
       const p =  await user.updateOne(user);

        return user;
    }catch(e){
        return e as IMongoError;
    }
}
