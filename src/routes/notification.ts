import express, { Request, Response } from 'express'
import { HashPassword } from '../services/loginService';
import { AddOrganisation, GetAllOrganisations, GetOrganisationById } from '../repositories/organisationRepository';
import { instanceOfTypeCustomError, instanceOfTypeIOrganisation } from '../lib/typeCheck';
import { AddNotification, CloseNotification, GetAllNotifications, GetNotificationById, GetNotificationByTargetUser } from '../repositories/notificatonsRepository';
import { INotification, INotificationDoc } from '../models/notifications';
import { IMongoError } from '../models/errors';
import { sendMail } from '../services/emailService';
import { ICustomError } from '../models/errors';

const router = express.Router()

router.get('/api/notification', async (req: Request, res: Response) => {
  const user = await GetAllNotifications();
  return res.status(200).send(user)
})

export const AddBatchNotification = async function(notifications:INotification[]):Promise<INotificationDoc | IMongoError| ICustomError> {
  try{


      notifications.map(async(notification)=>{
            if(notification.type=="0"){
          // const sendEmail = await sendMail(notification.email,
          
          //     "New Invite",
          // `You have been invited to join a group, view more here`,
          // `You have been invited to join a group, view more here. 
          // <br/>
          // <a href="https://viconet-dev.netlify.app/personnel/notifications/"> View Notifications</a>
          // <br/>         
          // `
          // )
      }


      // const noti = Notification.build(notification);
      // const res = await noti.save();

      // return noti;
      })
    

  }catch(e){
      return e as IMongoError;
  }
}

router.get('/api/notification/:id', async (req: Request, res: Response) => {
  
    const id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {// valid ObjectId

      const user = await GetNotificationById(id);
      res.header("Access-Control-Allow-Origin", "*");
      return res.status(200).send(user)
    }else{
      return res.status(404).send("Cannot find user");
    }

})

router.get('/api/notificationByUser/:userId', async (req: Request, res: Response) => {
  
  const id = req.params.userId;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {// valid ObjectId

    const user = await GetNotificationByTargetUser(id);
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(200).send(user)
  }else{
    return res.status(404).send("Cannot find user");
  }

})


router.get('/api/closeNotification/:notificationId', async (req: Request, res: Response) => {
  
  const id = req.params.notificationId;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {// valid ObjectId

    const user = await CloseNotification(id);
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(200).send(user)
  }else{
    return res.status(404).send("Cannot find user");
  }

})


router.post('/api/notification', async (req: Request, res: Response) => {
  const { 
    targetUser,
    reference,
    message,
    status,
    type,
    email,
    phone } = req.body;

    const notification = {
      targetUser:targetUser,
      reference:reference,
      message:message,
      status:"0",
      type:type,
      email:email,
      phone:phone
    
    } as INotification;

    const _project = await AddNotification(notification) as INotification;


  return res.status(200).send(_project);

});

router.post('/api/notification/update', async (req: Request, res: Response) => {
  const { 
    targetUser,
    reference,
    message,
    status,
    type,
    email,
    phone } = req.body;

    const notification = {
      targetUser:targetUser,
      reference:reference,
      message:message,
      status:status,
      type:type,
      email:email,
      phone:phone
    
    } as INotification;

    const _project = await AddNotification(notification) as INotification;


  return res.status(200).send(_project);

});



export { router as notificationRouter }