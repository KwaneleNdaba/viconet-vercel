import express, { Request, Response } from 'express'
import { User, IUser, ICreateStaffUser } from '../models/user'
import { AddUser } from '../repositories/usersRepository';
import { HashPassword } from '../services/loginService';
import { ICreateStaffModel, IStaff } from '../models/staff';
import { AddStaff, AddStaffToOrganisaion, AddToShortlist, DeleteStaff, GetAllStaff, GetFullStaffById, GetStaffById, RemoveFromShortlist } from '../repositories/staffRepository';
import { AddStaffToOrganisation, GetOrganisationById } from '../repositories/organisationRepository';

const router = express.Router()

router.get('/api/staff', async (req: Request, res: Response) => {
  const user = await GetAllStaff();
  return res.status(200).send(user)
})

router.get('/api/staff/:id', async (req: Request, res: Response) => {
  
  const id = req.params.id;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {// valid ObjectId
    
    const user = await GetStaffById(id);
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(200).send(user)
  }else{
    return res.status(404).send("Cannot find user");
  }
})

router.get('/api/staffuser/:id', async (req: Request, res: Response) => {
  
  const id = req.params.id;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {// valid ObjectId
    
    const user = await GetFullStaffById(id);
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(200).send(user)
  }else{
    return res.status(404).send("Cannot find user");
  }
})


router.post('/api/staff/delete/', async (req: Request, res: Response) => {
  const { staffId } = req.body;
  
  
      const _staff = await DeleteStaff(staffId);
  
  
      return res.status(200).send(_staff);
    
 

});


router.get('/api/staff/removeShortlist/:personnelId/:staffId', async (req: Request, res: Response) => {
  
  const id = req.params.personnelId;
  const staffId = req.params.staffId;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {// valid ObjectId
    
    const user = await RemoveFromShortlist(id,staffId);
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(200).send(user)
  }else{
    return res.status(404).send("Cannot find user");
  }

})

router.get('/api/staff/shortlist/:personnelId/:staffId', async (req: Request, res: Response) => {
  
  const id = req.params.personnelId;
  const staffId = req.params.staffId;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {// valid ObjectId
    
    const user = await AddToShortlist(id,staffId);
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(200).send(user)
  }else{
    return res.status(404).send("Cannot find user");
  }

})


router.post('/api/staff', async (req: Request, res: Response) => {
  const { title, firstName, surname, email, password, mobileNumber,position,profilePicture , _organisation} = req.body;
  
  const hashedPassword = await HashPassword(password);
  
  const dbUser = { title:title,
    firstName: firstName, 
    surname: surname, 
    email: email?.toLowerCase(),
    type: "2", 
    mobileNumber: mobileNumber,
    status:0,
    password:hashedPassword } as IUser;


  const user = await AddUser(dbUser) as IUser;

  const staff = {
    profilePicture : profilePicture,
    position : position,
    _organisation : _organisation,

  }as IStaff

  const staffUser ={
    staff:staff,
    user:user
  } as ICreateStaffUser;

  const _staffUser = await AddStaff(staffUser) as IStaff;

  const organisation = await AddStaffToOrganisation(_organisation, _staffUser);

  return res.status(200).send(_staffUser);

});

router.post('/api/addStaffToOrganisation', async (req: Request, res: Response) => {
  const { firstName, surname, email,mobileNumber, password,position,profilePicture , _organisation} = req.body ;
 
const request = {
  firstName,
  surname,
  email,
  mobileNumber,
  password,
  position,
  profilePicture ,
  _organisation,
  
} as ICreateStaffModel;
  const staff = await AddStaffToOrganisaion(request);

  return res.status(200).send(staff);

});
export { router as staffRouter }