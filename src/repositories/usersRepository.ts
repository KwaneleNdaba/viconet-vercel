import { HashPassword } from "../services/loginService";
import { ICustomError, IMongoError } from "../models/errors";
import { IUser, IUserDoc, User  } from "../models/user";
import { sendMail } from "../services/emailService";

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
        const email = await sendMail(_user.email, `Activate your VICO net profile`, `Your otp is ${_otp.toString()}`, `Activate your VICO net profile", "Your otp is <strong> ${_otp.toString()}</strong>` );
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
      console.log("user", email)
        const person = await GetUserByEmail(email) as IUser;
        console.log("user", person)
        const _otp = person.otp;
        if(otp == _otp){
          
          const activatedPerson = {...person, status:1}
          const updated = await UpdateUser(activatedPerson);
          return updated;
        }else{
          console.log("ERERER1")
          return {code:400, message:"Incorrect OTP"} as ICustomError
        }

    }catch(e){
        // return e as IMongoError;
        return {code:400, message:e } as ICustomError
    }
  }

  export const GetUserById = async function(id:string):Promise<IUser| IMongoError>{
    try{
    const users = await User.find({ _id: id})
    return users[0] as IUser;
    }catch(e){
        return e as IMongoError;
    }
  
  }

  

  export const GetUserByEmail = async function(email:string):Promise<IUser| IMongoError>{
    try{
    const users = await User.find({ email: email})
    const data = users[0] as any;
    console.log("data", data)
    return data._doc as IUser;
    }catch(e){
        return e as IMongoError;
    }
  
  }
