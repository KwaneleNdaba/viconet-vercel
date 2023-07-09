import { IProject } from "../models/project";
import { instanceOfTypeMongoError } from "../lib/typeCheck";
import { ICustomError, IMongoError } from "../models/errors";
import { IPersonnel, IPersonnelDoc, IPersonnelViewModel, Personnel } from "../models/personnel";
import { ICreatePersonnelUser, IUser, IUserDoc, User } from "../models/user";
import { GenerateSearchKeys } from "../services/searchService";
import { AddUser } from "./usersRepository";
import { IProjectView } from "../models/project";

+ function MapProjectPersonnel(project:IProject,  personnel: IPersonnel[], users:IUser[]):IProjectView{


    // const p = _project as any;
    // const project = p._doc as IProject;
       
        const uninvited = project.uninvited.split(",").map(proj=> personnel.filter(pers=>pers._id.toString()== proj)[0]).filter(x=>x!=undefined);
        const pending = project.pending.split(",").map(proj=> personnel.filter(pers=>pers._id.toString()== proj)[0]).filter(x=>x!=undefined);;
        const accepted =project.accepted.split(",").map(proj=> personnel.filter(pers=>pers._id.toString()== proj)[0]).filter(x=>x!=undefined);;
        const declined =project.declined.split(",").map(proj=> personnel.filter(pers=>pers._id.toString()== proj)[0]).filter(x=>x!=undefined);;


        const _uninvited = ToPersonnelViewModelSync(uninvited,users);
        const _pending = ToPersonnelViewModelSync(pending,users);
        const _accepted = ToPersonnelViewModelSync(accepted,users);
        const _declined = ToPersonnelViewModelSync(declined,users);


        const result ={
          ...project, 
            _uninvited:_uninvited,
            _pending: _pending,
            _accepted:  _accepted,
            _declined:_declined
        } as IProjectView

        return result;

}




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

        const personnel = await Personnel.find({_user:id})
        const match = personnel[0];
        return match as IPersonnelDoc;
        }catch(e){
            return e as IMongoError;
        }
}

export const ToPersonnelViewModel = async function( personnel: IPersonnel[]):Promise<IPersonnelViewModel[]>{
   
    const userIds = personnel.map(x=>x._user);
   
    const users = await User.find({_id:userIds});
    const responseModels = personnel.map((res:any)=>{
      const user = users.filter(x=>x.id == res._user)[0];
      const response = {
        ...res._doc,
        user:user
  
      } as IPersonnelViewModel


      return response;
    })
    return responseModels;
}

export const ToPersonnelViewModelSync = function( personnel: IPersonnel[], users: IUser[]):IPersonnelViewModel[]{
    const responseModels = personnel.map((res:any)=>{
      
      const user = users.filter(x=>x._id == res._user)[0];
      const response = {
        ...res,
        user:user
  
      } as IPersonnelViewModel
  
      return response;
    })

    return responseModels;
}

export const GetPersonnelById= async function(id:string):Promise<IPersonnelDoc| IMongoError>{
    try{
     
        const personnel = await Personnel.find({_id:id})
   
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
        const res = await personnel.save();
    
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




