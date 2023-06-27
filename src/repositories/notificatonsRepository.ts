
import { INotification, INotificationDoc, Notification } from "../models/notifications";
import { ICustomError, IMongoError } from "../models/errors";
import { sendMail } from "../services/emailService";


export const GetAllNotifications= async function():Promise<INotificationDoc[] | ICustomError>{
    try{
        const notifications = await Notification.find({})
        return notifications as INotificationDoc[];
        }catch(e){
            return {code:500, message:"error", object:e} as ICustomError;
        }
}

export const GetNotificationById= async function(id:string):Promise<INotificationDoc | ICustomError>{
    try{
        const organisation = await Notification.find({_id:id})
        const notification =  organisation[0] as INotificationDoc;

        return notification;
        }catch(e){
            return {code:500, message:"error", object:e} as ICustomError;
        }
}

export const GetNotificationByTargetAndReference= async function(userId:string, projectId:string ):Promise<INotification | ICustomError>{
    try{
        const _notification = await Notification.find({targetUser:userId, reference:projectId});
        const notification =  _notification[0] as any;

        return notification._doc as INotification;
        }catch(e){
            return {code:500, message:"error", object:e} as ICustomError;
        }
}


export const GetNotificationByTargetUser= async function(id:string):Promise<INotificationDoc[] | ICustomError>{
    try{
        const notifications = await Notification.find({targetUser:id})
        const notification =  notifications as INotificationDoc[];

        return notification;
        }catch(e){
            return {code:500, message:"error", object:e} as ICustomError;
        }
}


export const CloseNotification= async function(id:string):Promise<INotificationDoc | ICustomError>{
    try{
        const _notification = await Notification.find({id:id});
        const notification =  _notification[0] as any;
        const not = notification._doc as INotification;
        const newNotification = {...notification, status:"1"} as INotification
        
        const noti = Notification.build(newNotification);
        await noti.updateOne(noti);

        return noti;
        }catch(e){
            return {code:500, message:"error", object:e} as ICustomError;
        }
}


export const AddNotification = async function(notification:INotification):Promise<INotificationDoc | IMongoError| ICustomError> {
    try{
     
        if(notification.type=="0"){
            const sendEmail = await sendMail(notification.email,
            "New Invite",
            `You have been invited to join a group, view more here`,
            `You have been invited to join a group, view more here. 
            <br/>
            <a href="personnel/notifications/"> View Notifications</a>
            <br/>
            <a href="/api/acceptinvite/${notification.targetUser}/${notification.reference}"> Accept</a>
            <br/>
            <a href="/api/declineinvite/${notification.targetUser}/${notification.reference}"> Decline</a>
            `
            )
        }


        const noti = Notification.build(notification);
        const res = await noti.save();
        console.log("noti",res )
        return noti;

    }catch(e){
        return e as IMongoError;
    }
}
export const UpdateNotification = async function(notification:INotification):Promise<INotificationDoc | IMongoError| ICustomError> {
    try{
     
        
        const noti = Notification.build(notification);
        await noti.updateOne(noti);
        return noti;

    }catch(e){
        return e as IMongoError;
    }
}




