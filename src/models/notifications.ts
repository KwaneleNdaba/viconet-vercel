import mongoose from 'mongoose'


export interface INotification {
  _id?:string;
  targetUser:string;
  reference:string;
  message:string;
  status:string
  type:string;
  email:string;
  phone:string;
}

interface notificationInterface extends mongoose.Model<INotificationDoc> {
  build(attr: INotification): INotificationDoc
}

export interface INotificationDoc extends mongoose.Document {

  _id?:string;
  targetUser:string;
  reference:string;
  message:string;
  status:string;
  type:string;
  email:string;
  phone?:string;
  date?:string;
}

const notificationSchema = new mongoose.Schema({
  targetUser:{
    type: String,
    required: true
  },
  reference:{
    type: String,
    required: true
  },  
  message:{
    type: String,
    required: true
  },
  status:{
    type: String,
    required:true
  },
  type:{
    type: String,
    required:true
  },
  email:{
    type: String,
    required:true
  },
  phone:{
    type: String,
    required:true
  },
  date:{
    type: String,
    required:true
  },
  
})

notificationSchema.statics.build = (attr: INotification) => {
  return new Notification(attr)
}

const Notification = mongoose.model<INotificationDoc, notificationInterface>('notifications', notificationSchema, "notifications")


export { Notification }




