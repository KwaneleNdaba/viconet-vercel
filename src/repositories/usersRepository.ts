import { ICustomError, IMongoError } from "../models/errors";
import { IUser, IUserDoc, User  } from "../models/user";

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
        const user = User.build(_user);
        await user.save();
        console.log("USERDOC", user)
        //TODO: NK remove passeword=> map response
        const clean = {...user, password:""} as IUser
      
        return user;
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
    return data._doc as IUser;
    }catch(e){
        return e as IMongoError;
    }
  
  }
