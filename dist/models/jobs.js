"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobApplication = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jobApplicationSchema = new mongoose_1.default.Schema({
    country: {
        type: String,
        required: true,
    },
    companyId: {
        type: String,
        required: true,
    },
    creatingUser: {
        type: String,
        required: true,
    },
    language: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    jobTitle: {
        type: String,
        require: true,
    },
    streetAddress: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zipCode: {
        type: String,
        required: true,
    },
    remote: {
        type: Number,
        required: true,
    },
    jobtype: {
        type: Number,
        required: true,
    },
    hires: {
        type: String,
        required: true,
    },
    urgency: {
        type: String,
        required: true,
    },
    pay: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    fromDate: {
        type: String,
        required: true,
    },
    toDate: {
        type: String,
        required: true,
    },
    period: {
        type: String,
        required: true,
    },
    signingBonus: {
        type: Number,
        default: 0
    },
    commisionPay: {
        type: Number,
        default: 0,
    },
    bonusPay: {
        type: Number,
        default: 0,
    },
    tips: {
        type: Number,
        default: 0,
    },
    otherPay: {
        type: Number,
        default: 0,
    },
    healthInsurance: {
        type: Boolean,
        required: true,
    },
    paidTimeOff: {
        type: Boolean,
        required: true,
    },
    dentalInsurance: {
        type: Boolean,
        required: true,
    },
    retirememntFund: {
        type: Boolean,
        required: true,
    },
    flexibleSchedule: {
        type: Boolean,
        required: true,
    },
    tuition: {
        type: Boolean,
        required: true,
    },
    lifeInsurance: {
        type: Boolean,
        required: true,
    },
    retirememntFundMatch: {
        type: Boolean,
        required: true,
    },
    disabilityInsurance: {
        type: Boolean,
        required: true,
    },
    retirementPlan: {
        type: Boolean,
        required: true,
    },
    referalProgram: {
        type: Boolean,
        required: true,
    },
    employeeDiscount: {
        type: Boolean,
        required: true,
    },
    spendingAccount: {
        type: Boolean,
        required: true,
    },
    relocation: {
        type: Boolean,
        required: true,
    },
    parentalLeave: {
        type: Boolean,
        required: true,
    },
    otherBenefits: {
        type: Boolean,
        required: true,
    },
    noBenefits: {
        type: Boolean,
        required: true,
    },
    //
    jobSchedule: {
        type: Number,
        required: true,
    },
    //
    website: {
        type: String,
        required: true,
    },
    responsibilities: {
        type: String,
        required: true,
    },
    //
    methodToRecieveApplications: {
        type: Number,
        required: true,
    },
    submitResume: {
        type: Number,
        required: true,
    },
    dailyUpdateEmailAddress: {
        type: String,
        default: ""
    },
    individualUpDateEmailAddress: {
        type: String,
        default: ""
    },
    dailyUpdateEmail: {
        type: Boolean,
        default: false
    },
    individualUpDateEmail: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });
jobApplicationSchema.statics.build = (attr) => {
    return new jobApplication(attr);
};
const jobApplication = mongoose_1.default.model('jobApplications', jobApplicationSchema, "jobApplications");
exports.jobApplication = jobApplication;
//# sourceMappingURL=jobs.js.map