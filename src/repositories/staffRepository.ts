import { ICompanyRegisterModel } from "../models/organisations";
import { instanceOfTypeIStaff, instanceOfTypeIUser, instanceOfTypeMongoError } from "../lib/typeCheck";
import { ICustomError, IMongoError } from "../models/errors";
import { IStaff, IStaffDoc, Staff } from "../models/staff";
import { ICreateStaffUser, IUser, IUserDoc, User } from "../models/user";
import { Organisation } from "../models/organisations";
import { IOrganisation } from "../models/organisations";

export const GetAllStaff= async function():Promise<IStaffDoc[] | IMongoError>{
    try{
        const staff = await Staff.find({})
        return staff as IStaffDoc[];
        }catch(e){
            return e as IMongoError;
        }
}

export const GetStaffById= async function(id:string):Promise<IStaffDoc[] | IMongoError>{
    try{
        const staff = await Staff.find({_id:id})
        return staff as IStaffDoc[];
        }catch(e){
            return e as IMongoError;
        }
}

export const GetStaffInOrganisation= async function(organisationId:string):Promise<IStaffDoc[] | IMongoError | ICustomError>{
    try{
            const allStaff = await GetAllStaff();
            if(instanceOfTypeMongoError(allStaff)){
                return {code:"500", message: "Error retrieving staff"} as ICustomError;
            }else{
                const _allStaff = allStaff as IStaffDoc[];
            
                const response =  _allStaff.filter(x=>x._organisation == organisationId);
                return response;
            }
        
        }catch(e){
            return e as IMongoError;
        }
}

export const AddStaff = async function(_staff:ICreateStaffUser):Promise<IStaffDoc | ICustomError | IUserDoc > {
    try{
       const userReq = {..._staff.user} as IUser;

       
        const user = User.build(userReq);
        const userResp  = await user.save();
        console.log("asas", !instanceOfTypeIUser(userResp))
        if(!instanceOfTypeIUser(userResp)){
            return {code:500, message:"Failed to add user", object:userResp} as ICustomError
        
        }
        const _userResp = userResp as IUserDoc;
        const staffReq = {..._staff.staff, _user: _userResp._id, _organisation:"rtesat"}
         
        const staff = Staff.build(staffReq);
        const staffResp = await staff.save();

        if(!instanceOfTypeIStaff(staffResp)){
            return {code:500, message:"Failed to add staff", object:staffResp} as ICustomError
        
        }
        return staffResp;
    }catch(e){ 
        
        return {code:500, message:"Fail;ed to add staff user", object:e} as ICustomError
        // return e as IMongoError;
    }
}



export const UpdateStaff = async function(_staff:IStaff):Promise<IStaff | IMongoError> {
    try{
         
        const staff = Staff.build(_staff);
        await staff.updateOne(staff);
    
        return staff;
    }catch(e){
        return e as IMongoError;
    }
}




