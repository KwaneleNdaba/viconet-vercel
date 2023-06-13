import { IMongoError } from "../models/errors";
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

  export const AddUser = async function(_user:IUser):Promise<IUserDoc | IMongoError> {
    try{
        const user = User.build(_user);
        await user.save()
        return user;
    }catch(e){
        return e as IMongoError;
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
