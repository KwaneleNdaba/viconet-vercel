import { ICustomError, IMongoError } from "../models/errors";
import { IPersonnel } from "../models/personnel";
import { IUser } from "../models/user";

export function instanceOfTypeIUser(object: any): object is IUser {
    return object._id
}

export function instanceOfTypeIPersonnelArray(object: any): object is IPersonnel[] {
    return object[0]?._id;
}

export function instanceOfTypeCustomError(object: any): object is ICustomError[] {
    return object[0]?.code
}

export function instanceOfTypeMongoError(object: any): object is IMongoError[] {
    return object[0]?.errors
}