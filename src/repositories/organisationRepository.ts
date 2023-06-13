import { IMongoError } from "../models/errors";
import { IOrganisation, IOrganisationDoc, Organisation } from "../models/organisations";
import { IPersonnel, IPersonnelDoc, Personnel } from "../models/personnel";
import { IStaff, IStaffDoc, Staff } from "../models/staff";
import { GenerateSearchKeys } from "../services/searchService";

export const GetAllOrganisations= async function():Promise<IOrganisationDoc[] | IMongoError>{
    try{
        const organisation = await Organisation.find({})
        return organisation as IOrganisationDoc[];
        }catch(e){
            return e as IMongoError;
        }
}

export const GetOrganisationById= async function(id:string):Promise<IOrganisationDoc | IMongoError>{
    try{
        const organisation = await Organisation.find({_id:id})
        return organisation[0] as IOrganisationDoc;
        }catch(e){
            return e as IMongoError;
        }
}


export const AddOrganisation = async function(_organisation:IOrganisation):Promise<IOrganisationDoc | IMongoError> {
    try{
       
        const organisation = Organisation.build(_organisation);
        await organisation.save()
        return organisation;
    }catch(e){
        return e as IMongoError;
    }
}

export const UpdateOrganisation = async function(_organisation:IOrganisation):Promise<IOrganisation | IMongoError> {
    try{

        const organisation = Organisation.build(_organisation);
        await organisation.updateOne(organisation);
        return organisation;
    }catch(e){
        return e as IMongoError;
    }
}




