
import { ICustomError,IMongoError } from "../models/errors";
import { IUser } from "../models/user";
import { instanceOfTypeIUser } from "../lib/typeCheck";
import { GetAllUsers, GetUserByEmail } from "../repositories/usersRepository";
const bcrypt = require('bcrypt');
export const LoginUser= async function(email:string, password: string):Promise<IUser | ICustomError>{
  
    const user = await GetUserByEmail(email)
    
    if(instanceOfTypeIUser(user)){
      if(user.status==2){
        return {code:401, message:"User has been deleted"} as ICustomError;
      }

      const result = await bcrypt.compare(password, user.password);
  
      if(result==true){
        const responseUser = {...user, password:""}
        return responseUser as IUser
      }else{
        return {code:401, message:"Incorrect email/password combination"} as ICustomError;
      }
     
    }else{
      return {code:404, message:"Cannot find user"} as ICustomError;
    }
  
  }

export const HashPassword = async function(password:string):Promise<string>{
  const saltRounds = 10;
  const salt ="$2b$10$O.v22NpswdZqTkZt1oS/Ge";
 
 const hash = await  bcrypt.hash(password, salt);
  return hash;

}
