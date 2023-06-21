
import { ICustomError, IMongoError } from "../models/errors";
import { ICompanyRegisterModel, IOrganisation, IOrganisationDoc, Organisation } from "../models/organisations";
import { IPersonnel, IPersonnelDoc, Personnel } from "../models/personnel";
import { IStaff, Staff } from "../models/staff";

import { IUser, IUserDoc, User } from "../models/user";
import { IProject } from "../models/project";
import { instanceOfTypeIStaff, instanceOfTypeIUser } from "../lib/typeCheck";

export const GetAllOrganisations= async function():Promise<IOrganisationDoc[] | ICustomError>{
    try{
        const organisation = await Organisation.find({})
        return organisation as IOrganisationDoc[];
        }catch(e){
            return {code:500, message:"error", object:e} as ICustomError;
        }
}

export const GetOrganisationById= async function(id:string):Promise<IOrganisationDoc | ICustomError>{
    try{
        const organisation = await Organisation.find({_id:id})
        return organisation[0] as IOrganisationDoc;
        }catch(e){
            return {code:500, message:"error", object:e} as ICustomError;
        }
}


export const AddOrganisation = async function(_organisation:ICompanyRegisterModel):Promise<IOrganisation | ICustomError> {
    try{
        const organisation = AddOrganisationAndStaff(_organisation);
        return organisation;
        
    }catch(e){
        return {code:500, message:"error", object:e} as ICustomError;
    }
}

export const AddOrganisationAndStaff = async function(_organisation: ICompanyRegisterModel):Promise<IOrganisation | ICustomError  > {
    try{

        const _user = {
            title:"",
            firstName: _organisation.userName,
            surname:_organisation.userSurname,
            email:_organisation.userEmail,
            password:_organisation.password,
            mobileNumber:_organisation.userNumber,
            type:"2",
            status:0 
           } as IUser
    
           const _staff ={
            position:_organisation.position
           } as IStaff;
    

           
       const userReq = {..._user} as IUser;       
        const user = User.build(userReq);

        const userResp  = await user.save();

    
        if(!instanceOfTypeIUser(userResp)){
            return {code:500, message:"Failed to add user", object:userResp} as ICustomError
        
        }

        const _userResp = userResp as IUserDoc;

        const organisationPayload ={
            name:_organisation.companyName,
            status:"0",		
            currentPackage:"0",
            renewalDate	:"",	
            mobilePhone:_organisation.companyNumber,	
            _staff:_staff._id,
            _adminStaff:_staff._id
    
           } as IOrganisation;
        const organisation = Organisation.build(organisationPayload);
       
            

        const staffReq = {..._staff, _user: _userResp._id, _organisation:organisation.id}
         
        const staff = Staff.build(staffReq);
        const staffResp = await staff.save();

        if(!instanceOfTypeIStaff(staffResp)){
            return {code:500, message:"Failed to add staff", object:staffResp} as ICustomError
        
        }
        organisation._adminStaff = staff.id;
        organisation._staff =staff.id;
       const _org =  organisation.save()

        return _org;
    }catch(e){ 
        
        return {code:500, message:"Fail;ed to add staff user", object:e} as ICustomError
        // return e as IMongoError;
    }
}


export const UpdateOrganisation = async function(_organisation:IOrganisation):Promise<IOrganisation | ICustomError> {
    try{

        const organisation = Organisation.build(_organisation);
        await organisation.updateOne(organisation);
        return organisation;
    }catch(e){
        return {code:500, message:"error", object:e} as ICustomError;
    }
}



export const AddStaffToOrganisation = async function(_organisation:string, staff :IStaff):Promise<IOrganisation | IMongoError> {
    try{
        const currentOrg = await GetOrganisationById(_organisation) as IOrganisation;
        const currentStaff = currentOrg._staff;
        const newStaff = `${currentStaff},${staff._id}`;

        const newOrg = {...currentOrg, _staff: newStaff} as IOrganisation;
        const organisation = Organisation.build(newOrg);
        await organisation.updateOne(organisation);
        return organisation;
    }catch(e){
        return e as IMongoError;
    }
}



export const AddProjectToOrganisation = async function(_organisation:string, project :IProject):Promise<IOrganisation | IMongoError> {
    try{
        const currentOrg = await GetOrganisationById(_organisation) as IOrganisation;
        const currentProjects = currentOrg._projects;
        const newProjects = `${currentProjects},${project._id}`;

        const newOrg = {...currentOrg, _projects: newProjects} as IOrganisation;
        const organisation = Organisation.build(newOrg);
        await organisation.updateOne(organisation);
        return organisation;
    }catch(e){
        return e as IMongoError;
    }
}




