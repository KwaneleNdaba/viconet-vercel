import { IJobApplication,IJobApplicationDoc,jobApplication } from "../models/jobs";
import { ICustomError, IMongoError } from "../models/errors";

export const AddJobApplication = async function(_job:IJobApplication):Promise<IJobApplication | ICustomError> {
    try{
   
        const job = jobApplication.build(_job);
        await job.save();
      
        return job;
    }catch(e){
        // return e as IMongoError;
        return {code:400, message:e } as ICustomError
    }
  }

  export const GetAllJobApplications= async function():Promise<IJobApplicationDoc[] | IMongoError>{
    try{
        const jobApplications = await jobApplication.find({})
        return jobApplications as IJobApplicationDoc[];
        }catch(e){
            return e as IMongoError;
        }
}

export const DeleteJobApplicationById = async function(id: string): Promise<IJobApplication | ICustomError> {
  try {
    const deletedJobApplication = await jobApplication.findByIdAndDelete(id);

    if (deletedJobApplication) {
      return deletedJobApplication;
    } else {
      return { code: 404, message: "Job application not found" } as ICustomError;
    }
  } catch (e) {
    return { code: 500, message: e.message } as ICustomError;
  }
}


export const GetJobApplicationById = async function(id:string):Promise<IJobApplication| IMongoError>{
    try{
    const jobs = await jobApplication.find({ _id: id})
    const data = jobs[0] as any;
    return data._doc as IJobApplication;
    }catch(e){
        return e as IMongoError;
    }
  
  }

  