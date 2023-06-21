import express, { Request, Response } from 'express'
import { User, IUser, ICreateStaffUser } from '../models/user'
import { ActivateUser, AddUser, GetAllUsers, GetUserByEmail, GetUserById, UpdateUser } from '../repositories/usersRepository';
import { HashPassword, LoginUser } from '../services/loginService';
import { instanceOfTypeCustomError, instanceOfTypeIUser } from '../lib/typeCheck';
import { ICustomError } from '../models/errors';
import { IStaff } from '../models/staff';
import { AddStaff } from '../repositories/staffRepository';
import { AddStaffToOrganisation, GetOrganisationById } from '../repositories/organisationRepository';

const router = express.Router()

router.get('/api/users', async (req: Request, res: Response) => {
  const user = await GetAllUsers();
  return res.status(200).send(user)
})


router.get('/api/users/:id', async (req: Request, res: Response) => {
  
    const id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {// valid ObjectId
      
      const user = await GetUserById(id);
      res.header("Access-Control-Allow-Origin", "*");
      return res.status(200).send(user)
    }else{
      return res.status(404).send("Cannot find user");
    }

})

router.post('/api/users/email/', async (req: Request, res: Response) => {
  const {  email } = req.body;
  if (email) {
    
    const user = await GetUserByEmail(email);
    return res.status(200).send(user);

  }else{
    return res.status(404).send("Cannot find user");
  }

})

router.post('/api/users/verify/', async (req: Request, res: Response) => {
  const {  email, otp } = req.body;
  if (email) {
    const user = await ActivateUser(otp, email);

    if(instanceOfTypeCustomError(user)){
      console.log("ERRERE")
      const errorResponse = user as ICustomError;
      return res.status(errorResponse.code).send(errorResponse);

    }
    return res.status(200).send(user);

  }else{
    return res.status(404).send("Cannot find user");
  }

})

router.post('/api/users', async (req: Request, res: Response) => {
  const { title, firstName, surname, email, password, type, mobileNumber } = req.body;
  
  const hashedPassword = await HashPassword(password);
  
  const dbUser = { title:title,
    firstName: firstName, 
    surname: surname, 
    email: email.toLowerCase(),
    type: type, 
    mobileNumber: mobileNumber,
    status:0,
    password:hashedPassword } as IUser;

  console.log(dbUser)

  const user = await AddUser(dbUser);

  if(instanceOfTypeIUser(user)){

    return res.status(200).send(user)
  }else{
    const error = user as ICustomError;
    return  res.status(400).send(error.message);
  }
})

router.post('/api/users/staff', async (req: Request, res: Response) => {
  const { title, firstName, surname, email, password, mobileNumber,position,profilePicture , _organisation} = req.body;
  
  const hashedPassword = await HashPassword(password);
  
  const dbUser = { title:title,
    firstName: firstName, 
    surname: surname, 
    email: email.toLowerCase(),
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


router.post('/api/users/:id', async (req: Request, res: Response) => {
  const { title, firstName, surname, email, password } = req.body;
  const id = req.params.id;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {// valid ObjectId
    
    const dbUser = { title, firstName, surname, email, password, ["_id"]:id } as IUser;
    console.log("user", dbUser)
    const user = await UpdateUser(dbUser);
 
    return res.status(201).send(user)
  } 
  else{
    return res.status(404).send("Cannot find user");
  }
})

router.post('/api/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await LoginUser(email, password);
  if(instanceOfTypeIUser(result)){
    return res.status(200).send(result)
  }else{
    return  res.status(result.code).send(result.message);
  }

})

export { router as userRouter }