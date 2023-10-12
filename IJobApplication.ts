export interface IJobApplication{
    country: number,
    language:number,
    companyName:string,
    jobTitle: string,
    streetAddress:string,
    city:string,
    state:string,
    zipCode:string,
    remote:number,
    jobtype:number,
    hires:number,
    urgency:number,
    pay:number,
    currency:number,
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