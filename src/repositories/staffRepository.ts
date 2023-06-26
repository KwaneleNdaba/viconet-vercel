import { ICompanyRegisterModel } from "../models/organisations";
import { instanceOfTypeIStaff, instanceOfTypeIUser, instanceOfTypeMongoError } from "../lib/typeCheck";
import { ICustomError, IMongoError } from "../models/errors";
import { IStaff, IStaffDoc, IStaffViewModel, Staff } from "../models/staff";
import { ICreateStaffUser, IUser, IUserDoc, User } from "../models/user";
import { Organisation } from "../models/organisations";
import { IOrganisation } from "../models/organisations";
import { GetAllPersonnel } from "./personnelRepository";
import { IPersonnelDoc } from "../models/personnel";
import { IPersonnel } from "../models/personnel";

export const GetAllStaff= async function():Promise<IStaffDoc[] | IMongoError>{
    try{
        const staff = await Staff.find({})
        return staff as IStaffDoc[];
        }catch(e){
            return e as IMongoError;
        }
}

export const GetFullStaffById= async function(id:string):Promise<IStaffViewModel | IMongoError>{
    try{
        const staff = await Staff.find({_id:id});
        const _staff = staff[0] as IStaff;

        const personnel = await GetShortListed(_staff._shortlist);
        
        const response = {
            staff: _staff,
            shortlisted: personnel

        } as IStaffViewModel
        return response;
        }catch(e){
            return e as IMongoError;
        }
}

export const GetStaffById= async function(id:string):Promise<IStaff | IMongoError>{
    try{
        const staff = await Staff.find({_id:id});
        const _staff = staff[0] as IStaff;
        return _staff;
        }catch(e){
            return e as IMongoError;
        }
}


export const AddToShortlist = async function(personnel: string, staffId: string):Promise<IStaffViewModel | IMongoError>{

    try{
        const currentStaff = await GetStaffById(staffId) as IStaff;
        const newPersonnel = `${currentStaff._shortlist},${personnel}`;
        const newStaff = {...currentStaff, _shortlist:newPersonnel}
        const savedStaff = await UpdateStaff(newStaff) as IStaff;
        const newShortlist = await GetShortListed(newPersonnel);
        const response = {
            staff: savedStaff,
            shortlisted: newShortlist

        } as IStaffViewModel

        return response;

    }catch(e){
        return e as IMongoError;
    }
}

export const RemoveFromShortlist = async function(personnel: string, staffId: string):Promise<IStaffViewModel | IMongoError>{

    try{
        const currentStaff = await GetStaffById(staffId) as IStaff;
        const currentPersonnel = currentStaff._shortlist.split(",");
        const _newShortlist = currentPersonnel.filter(x=>x!=personnel).join(",");
        
        const newStaff = {...currentStaff, _shortlist:_newShortlist}
        const savedStaff = await UpdateStaff(newStaff) as IStaff;

        const newShortlistPersonnel = await GetShortListed(_newShortlist);
        const response = {
            staff: savedStaff,
            shortlisted: newShortlistPersonnel

        } as IStaffViewModel

        return response;

    }catch(e){
        return e as IMongoError;
    }
}

const GetShortListed = async function(shortlisted:string):Promise<IPersonnel[]> {
    const allPersonnel = await GetAllPersonnel() as IPersonnel[];
    const allShortListed = shortlisted.split(",");

    const list = allPersonnel.filter(x=> allShortListed.includes(x._id));
    return list;


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




