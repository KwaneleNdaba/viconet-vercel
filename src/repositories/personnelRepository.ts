import { instanceOfTypeMongoError } from "../lib/typeCheck";
import { ICustomError, IMongoError } from "../models/errors";
import { IPersonnel, IPersonnelDoc, Personnel } from "../models/personnel";
import { ICreatePersonnelUser, IUser } from "../models/user";
import { GenerateSearchKeys } from "../services/searchService";
import { AddUser } from "./usersRepository";

export const GetAllPersonnel= async function():Promise<IPersonnelDoc[] | IMongoError>{
    try{
        const personnel = await Personnel.find({})
        
        return personnel as IPersonnelDoc[];
        }catch(e){
            return e as IMongoError;
        }
}

export const GetPersonnelByUserId= async function(id:string):Promise<IPersonnelDoc| IMongoError>{
    try{
        console.log("userid", id)
        const personnel = await Personnel.find({_user:id})
        const match = personnel[0];
        return match as IPersonnelDoc;
        }catch(e){
            return e as IMongoError;
        }
}

export const GetPersonnelById= async function(id:string):Promise<IPersonnelDoc| IMongoError>{
    try{
      
        const personnel = await Personnel.find({_id:id})
        console.log("personnel", personnel)
        const match = personnel[0];
        return match as IPersonnelDoc;
        }catch(e){
            return e as IMongoError;
        }
}


export const AddPersonnel = async function(_personnel:IPersonnel):Promise<IPersonnelDoc | IMongoError> {
    try{
        const searchKeys = GenerateSearchKeys(_personnel);
        const populated = {..._personnel, searchKeys:searchKeys};

        const personnel = Personnel.build(populated);
        await personnel.save();

        return personnel;
    }catch(e){
        return e as IMongoError;
    }
}

export const AddPersonnelUser = async function(_personnel:ICreatePersonnelUser):Promise<IPersonnelDoc | IMongoError| ICustomError> {
    try{
        _personnel.user.type="TALENT";
        const saveUser = await AddUser(_personnel.user);
        if(instanceOfTypeMongoError(saveUser)){
            return saveUser as ICustomError;
        }
        const searchKeys = GenerateSearchKeys(_personnel.personnel);
        const userId = saveUser as IUser;
        const populated = {..._personnel.personnel, searchKeys:searchKeys, _user:userId._id} as IPersonnel;
       
        const personnel = Personnel.build(populated);
        await personnel.save();

        return personnel;
    }catch(e){
        return e as IMongoError;
    }
}
export const UpdatePersonnel = async function(_personnel:IPersonnel):Promise<IPersonnelDoc | IMongoError> {
    try{
        const searchKeys = GenerateSearchKeys(_personnel);
        const populated = {..._personnel, searchKeys:searchKeys} as IPersonnel;
        const personnel = Personnel.build(populated);
        await personnel.updateOne(personnel);
        return personnel;
    }catch(e){
        return e as IMongoError;
    }
}




