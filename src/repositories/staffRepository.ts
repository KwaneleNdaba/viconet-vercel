import { instanceOfTypeMongoError } from "../lib/typeCheck";
import { ICustomError, IMongoError } from "../models/errors";
import { IStaff, IStaffDoc, Staff } from "../models/staff";
import { ICreateStaffUser, IUser, IUserDoc, User } from "../models/user";

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

export const AddStaff = async function(_staff:ICreateStaffUser):Promise<IStaffDoc | IMongoError | IUserDoc> {
    try{
       const userReq = {..._staff.user, type:"STAFFUSER_UNREGISTERED"} as IUser;

       
        const user = User.build(userReq);
        const userResp  = await user.save();
        if(instanceOfTypeMongoError(userResp)){
            return userResp;
        }
        const _userResp = userResp as IUserDoc;
        const staffReq = {..._staff.staff, _user: _userResp._id}
         
        const staff = Staff.build(staffReq);
        const staffResp = await staff.save();

        return staffResp;
    }catch(e){ 
        return e as IMongoError;
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




