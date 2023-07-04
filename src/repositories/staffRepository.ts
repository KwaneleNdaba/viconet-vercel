import { ICompanyRegisterModel, IOrganisationViewModel } from "../models/organisations";
import { instanceOfTypeCustomError, instanceOfTypeIStaff, instanceOfTypeIUser, instanceOfTypeMongoError } from "../lib/typeCheck";
import { ICustomError, IMongoError } from "../models/errors";
import { ICreateStaffModel, IStaff, IStaffDoc, IStaffViewModel, Staff } from "../models/staff";
import { ICreateStaffUser, IUser, IUserDoc, User, UserState, UserType } from "../models/user";
import { Organisation } from "../models/organisations";
import { IOrganisation } from "../models/organisations";
import { GetAllPersonnel } from "./personnelRepository";
import { IPersonnelDoc } from "../models/personnel";
import { IPersonnel } from "../models/personnel";
import { GetOrganisationById, UpdateOrganisation } from "./organisationRepository";
import { sendMail } from "../services/emailService";
import { HashPassword } from "../services/loginService";

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
        const staff = await Staff.find({_user:id});
        const _staff = staff[0] as IStaff;
        const user = await User.findById(id);
    
        const personnel = await GetShortListed(_staff._shortlist);
       
        const response = {
            staff: _staff,
            shortlisted: personnel,
            user:user

        } as IStaffViewModel
        return response;
        }catch(e){
            console.log("er", e)
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
        const staffDoc = await GetStaffById(staffId) as any;
        const currentStaff = staffDoc._doc as IStaff;

        const currentStaffArray = currentStaff._shortlist??"".split(",");

        if(currentStaffArray.includes(personnel)){
            //already shortlisted 

            const response = {
                staff: currentStaff,
                shortlisted: await GetShortListed(currentStaff._shortlist)
    
            } as IStaffViewModel
    
            return response;
        }else{
           
            const newPersonnel = `${currentStaff._shortlist.trim()}${currentStaff._shortlist.trim()==""?'':","}${personnel.trim()}`;
            const newStaff = {...currentStaff, _shortlist:newPersonnel} as IStaff
            const savedStaff = await UpdateStaff(newStaff) as IStaff;
            const newShortlist = await GetShortListed(newPersonnel);
            const response = {
                staff: savedStaff,
                shortlisted: newShortlist
    
            } as IStaffViewModel
    
            return response;
    
         
        }
    }catch(e){
        return e as IMongoError;
    }
}

export const RemoveFromShortlist = async function(personnel: string, staffId: string):Promise<IStaffViewModel | IMongoError>{

    try{
        const staffDoc = await GetStaffById(staffId) as any;
        const currentStaff = staffDoc._doc as IStaff;
        const currentPersonnel = currentStaff._shortlist.trim().split(",");
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
    const list = allShortListed.length>0? allPersonnel.filter(x=> allShortListed.includes(x?._id.toString())):[];
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

export const AddStaffToOrganisaion = async function(_staff: ICreateStaffModel):Promise<IStaffViewModel | ICustomError  > {
    try{
        const _otp = Math.floor(Math.random() * (99999 -10000 + 1)) + 10000;
        const hash = await HashPassword(_otp.toString());
        const _user = {
            title:"Mr",
            firstName: _staff.firstName,
            surname: _staff.surname,
            email: _staff.email,
            password:hash,
            mobileNumber:_staff.mobileNumber,
            type:UserType.Staff,
            status:UserState.Onboarded,
            otp:_otp.toString()
           } as IUser
    
           
       const userReq = {..._user} as IUser;       
        const user = User.build(userReq);
     
           
        const userResp  = await user.save();
       
        if(instanceOfTypeCustomError(userResp)){
            return {code:500, message:"Failed to add user", object:userResp} as ICustomError
        
        }

        const staffReq = {
            profilePicture:"",
            position:_staff.position,
            _organisation: _staff._organisation??'',
            _user : user._id,
            _shortlist:""
        } as IStaff
      
        const staff = Staff.build(staffReq);
      
        const staffResp = await staff.save();

        const organisation = await GetOrganisationById(_staff._organisation) as IOrganisationViewModel;
        console.log("EEWEWRES", organisation);
        const newOrg = {...organisation.organisation, _staff:`${[...organisation?._staff??"".split(","), staff._id].join(",")}`}
        const savedOrg = await UpdateOrganisation(newOrg);
        
        const email = await sendMail(_user.email, 
            `Viconet profile created`, `Hi, a staff profile for ${organisation?.organisation?.name} has been created for you. <br/>
            Your one time password is ${_otp.toString()}. Your may login here: <br/> `,  
            `Hi, a staff profile for ${organisation?.organisation?.name} has been created for you. <br/>
            Your one time password is ${_otp.toString()} <br/> 
            Your may login here: <br/> ` );
    
      

        const response ={
            staff:staffReq,
            shortlisted:[],
            user:_user
        } as IStaffViewModel;

        return response;

    }catch(e){ 
        console.log("ee", e)
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




