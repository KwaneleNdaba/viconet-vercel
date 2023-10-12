import mongoose from 'mongoose'

export interface IJobApplication{
    country: number,
    language:number,
    companyId:string
    creatingUser: String
    companyName:string,
    description:string; 
    jobTitle: string,
    streetAddress:string,
    city:string,
    state:string,
    zipCode:string,
    remote:number,
    jobtype:number,
    hires:string,
    urgency:string,
    pay:number,
    currency:string,
    fromDate:string,
    toDate:string,
    period:string,
    signingBonus?:number //default  to 0 in the backend if not provided
    commisionPay?:number //default  to 0 in the backend if not provided
    bonusPay?:number //default  to 0 in the backend if not provided
    tips?:number //default  to 0 in the backend if not provided
    otherPay?:number //default  to 0 in the backend if not provided
    healthInsurance:boolean,
    paidTimeOff:boolean,
    dentalInsurance:boolean,
    retirememntFund:boolean,
    flexibleSchedule:boolean,
    tuition:boolean,
    lifeInsurance:boolean,    
    retirememntFundMatch:boolean,
    disabilityInsurance:boolean,
    retirementPlan:boolean,
    referalProgram:boolean,
    employeeDiscount:boolean,
    spendingAccount:boolean,
    relocation:boolean,
    parentalLeave:boolean,
    otherBenefits:boolean,
    noBenefits:boolean
    //
    jobSchedule:number,
    //
    website:string,
    //
    responsibilities:string,
    //
    methodToRecieveApplications:number,
    submitResume:number,
    dailyUpdateEmailAddress?:string, //empty string if not provided
    individualUpDateEmailAddress?:string //empty string if not provided
    dailyUpdateEmail?:boolean, //false if not provided
    individualUpDateEmail?:boolean //false if not provided


}

  

interface jobApplicationDocInterface extends mongoose.Model<IJobApplicationDoc> {
    build(attr: IJobApplication): IJobApplicationDoc
  }
  
  export interface IJobApplicationDoc extends mongoose.Document {
    country: number,
    language:number,
    creatingUser:string,
    companyId:string
    companyName:string,
    jobTitle: string,
    streetAddress:string,
    city:string,
    state:string,
    zipCode:string,
    remote:number,
    description:string; 
    jobtype:number,
    hires:string,
    urgency:string,
    pay:number,
    currency:string,
    fromDate:string,
    toDate:string,
    period:string,
    signingBonus?:number //default  to 0 in the backend if not provided
    commisionPay?:number //default  to 0 in the backend if not provided
    bonusPay?:number //default  to 0 in the backend if not provided
    tips?:number //default  to 0 in the backend if not provided
    otherPay?:number //default  to 0 in the backend if not provided
    healthInsurance:boolean,
    paidTimeOff:boolean,
    dentalInsurance:boolean,
    retirememntFund:boolean,
    flexibleSchedule:boolean,
    tuition:boolean,
    lifeInsurance:boolean,    
    retirememntFundMatch:boolean,
    disabilityInsurance:boolean,
    retirementPlan:boolean,
    referalProgram:boolean,
    employeeDiscount:boolean,
    spendingAccount:boolean,
    relocation:boolean,
    parentalLeave:boolean,
    otherBenefits:boolean,
    noBenefits:boolean
    //
    jobSchedule:number,
    //
    website:string,
    //
    responsibilities:string,
    //
    methodToRecieveApplications:number,
    submitResume:number,
    dailyUpdateEmailAddress?:string, //empty string if not provided
    individualUpDateEmailAddress?:string //empty string if not provided
    dailyUpdateEmail?:boolean, //false if not provided
    individualUpDateEmail?:boolean //false if not provided
  }


const jobApplicationSchema = new mongoose.Schema({
    country:{
        type : String,
        required: true,
    },
    companyId:{
        type:String,
        required: true,
    },
    creatingUser:{
        type : String,
        required: true,
    },
    language:{
        type : Number,
        required: true,
    },
    description:{
        type : String,
        required: true,
    },
    companyName:{
        type : String,
        required: true,
    },
    jobTitle:{
        type : String,
        require: true,
    },
    streetAddress:{
        type:String,
        required: true,
    },
    city:{
        type:String,
        required: true,
    },
    state:{
        type:String,
        required: true,
    },
    zipCode:{
        type:String,
        required: true,
    },
    remote:{
        type:Number,
        required: true,
    },
    jobtype:{
        type:Number,
        required: true,
    },
    hires:{
        type:String,
        required: true,
    },
    urgency:{
        type:String,
        required: true,
    },
    pay:{
        type:Number,
        required: true,
    },
    currency:{
        type:String,
        required: true,
    },
    fromDate:{
        type:String,
        required: true,
    },
    toDate:{
        type:String,
        required: true,
    },
    period:{
        type:String,
        required: true,
    },
    signingBonus:{
    type:Number,
    default: 0
    },
    commisionPay:{
        type:Number,
        default: 0,
    }, 
    bonusPay:{
        type:Number,
        default: 0,
    },
    tips:{
        type:Number,
        default: 0,
    }, 
    otherPay:{
        type:Number,
        default: 0,
    }, 
    healthInsurance:{
        type: Boolean,
        required: true,
    },
    paidTimeOff:{
        type: Boolean,
        required: true,
    },
    dentalInsurance:{
        type: Boolean,
        required: true,
    },
    retirememntFund:{
        type: Boolean,
        required: true,
    },
    flexibleSchedule:{
        type: Boolean,
        required: true,
    },
    tuition:{
        type: Boolean,
        required: true,
    },
    lifeInsurance:{
        type: Boolean,
        required: true,
    }, 
    retirememntFundMatch:{
        type: Boolean,
        required: true,
    },
    disabilityInsurance:{
        type: Boolean,
        required: true,
    },
    retirementPlan:{
        type: Boolean,
        required: true,
    },
    referalProgram:{
        type: Boolean,
        required: true,
    },
    employeeDiscount:{
        type: Boolean,
        required: true,
    },
    spendingAccount:{
        type: Boolean,
        required: true,
    },
    relocation:{
        type: Boolean,
        required: true,
    },
    parentalLeave:{
        type: Boolean,
        required: true,
    },
    otherBenefits:{
        type: Boolean,
        required: true,
    },
    noBenefits:{
        type: Boolean,
        required: true,
    },
    //
    jobSchedule:{
        type: Number,
        required: true,
    },
    //
    website:{
        type: String,
        required: true,
    },

    responsibilities:{
        type: String,
        required: true,
    },
    //
    methodToRecieveApplications:{
        type: Number,
        required: true,
    },
    submitResume:{
        type: Number,
        required: true,
    },
    dailyUpdateEmailAddress:{
        type: String,
        default : ""
    },
    individualUpDateEmailAddress:{
        type: String,
        default : ""
    }, 
    dailyUpdateEmail:{
        type: Boolean,
        default : false
    },
    individualUpDateEmail:{
        type: Boolean,
        default : false
    },

  },{timestamps: true})
  
  jobApplicationSchema.statics.build = (attr: IJobApplication) => {
    return new jobApplication(attr)
  }
  
  const jobApplication = mongoose.model<IJobApplicationDoc, jobApplicationDocInterface>('jobApplications', jobApplicationSchema, "jobApplications")
  
  
  export { jobApplication }
  
  
  
  
  