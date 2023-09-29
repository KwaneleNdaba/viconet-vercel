import express, { Request, Response } from 'express'
import { User, IUser, ICreateStaffUser } from '../models/user'
import { ActivateUser, AddUser, ChangePassword, ChangePasswordAndActivate, DeleteUser, GetAllUsers, GetUserByEmail, GetUserById, SendOTP, UpdateUser, VerifyOTPAndResetPassword } from '../repositories/usersRepository';
import { HashPassword, LoginUser } from '../services/loginService';
import { instanceOfTypeCustomError, instanceOfTypeIUser } from '../lib/typeCheck';
import { ICustomError } from '../models/errors';
import { IStaff } from '../models/staff';
import { AddStaff } from '../repositories/staffRepository';
import { AddStaffToOrganisation, GetOrganisationById } from '../repositories/organisationRepository';
import { parsefile, } from '../services/documentService';
 import { uploadProfilePic } from '../services/documentService';

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

router.post('/api/users/verify', async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (email) {
    const user = await ActivateUser(otp, email);

    if (instanceOfTypeCustomError(user)) {
      const errorResponse = user as ICustomError;
      res.header("Access-Control-Allow-Origin", "*"); // Add this line to set the CORS headers
      return res.status(errorResponse.code).send(errorResponse);
    }
    
    res.header("Access-Control-Allow-Origin", "*"); // Add this line to set the CORS headers
    return res.status(200).send(user);
  } else {
    res.header("Access-Control-Allow-Origin", "*"); // Add this line to set the CORS headers
    return res.status(404).send("Cannot find user");
  }
})


router.post('/api/upload_profilepicture/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  await uploadProfilePic(req, id)
  .then((data:any) => {

    // res.header("Access-Control-Allow-Origin", "*");

        res.header("Access-Control-Allow-Origin", "*");
        res.status(200).json({
        message: "Success",
        data
      })   
   
  })
  .catch((error:any) => {

    res.header("Access-Control-Allow-Origin", "*");
    res.status(400).json({
      message: "An error occurred.",
      error
    })
  })
});


router.post('/api/users', async (req: Request, res: Response) => {
  const { title, firstName, surname, email, password,  mobileNumber, role } = req.body;
  
  const hashedPassword = await HashPassword(password);
  
  const dbUser = { title:title,
    firstName: firstName, 
    surname: surname, 
    email: email?.toLowerCase(),
    type: "0", 
    mobileNumber: mobileNumber,
    status:0,
    password:hashedPassword,
    role : role,
  } as IUser;

  const user = await AddUser(dbUser);

  if(instanceOfTypeIUser(user)){

    return res.status(200).send(user)
  }else{
    const error = user as ICustomError;
    return  res.status(400).send(error.message);
  }
})


router.post('/api/user/deleteUser', async (req: Request, res: Response) => {
  const { email, oldPassword, password } = req.body;
  
  const user = await GetUserByEmail(email) as IUser;
  const currPass = await HashPassword(oldPassword);
  if(user.password == currPass){

    const hashedPassword = await HashPassword(password);
    const newUser = {
      ...user,
      password:hashedPassword
    }
   
    const dbUser = await UpdateUser(newUser);
  
    if(instanceOfTypeIUser(dbUser)){
  
      return res.status(200).send(user)
    }else{
      const error = user as any;
      return  res.status(400).send(error.message);
    }
  }

})


router.post('/api/user/changePassword', async (req: Request, res: Response) => {
  const { email,  password } = req.body;
  
  const user = await ChangePassword(email, password);
  
    if(instanceOfTypeIUser(user)){
  
      return res.status(200).send(user)
    }else{
      const error = user as any;
      return  res.status(400).send(error.message);
    }
})

router.post('/api/user/resetPassword', async (req: Request, res: Response) => {
  const { email, otp, password } = req.body;
  
  const user = await VerifyOTPAndResetPassword(email, password, otp);
  
    if(instanceOfTypeIUser(user)){
  
      return res.status(200).send(user)
    }else{
      const error = user as any;
      return  res.status(400).send(error.message);
    }
})

router.post('/api/user/sendOTP', async (req: Request, res: Response) => {
  const { email} = req.body;
  console.log(email);
  const user = await SendOTP(email);
    if(!instanceOfTypeCustomError(user)){
  
      return res.status(200).send(user)
    }else{
      const error = user as any;
      return  res.status(400).send(error.message);
    }
})

router.post('/api/user/changePasswordAndActivate', async (req: Request, res: Response) => {
  const { email, oldPassword, password } = req.body;
  
  const user = await ChangePasswordAndActivate(email, password);
  
    if(instanceOfTypeIUser(user)){
  
      return res.status(200).send(user)
    }else{
      const error = user as any;
      return  res.status(400).send(error.message);
    }
})


router.post('/api/user/deleteUser', async (req: Request, res: Response) => {
  const { userId, password } = req.body;
  
  const user = GetUserById(userId) as any;
  const _userPass = user.password;
  const hashedPassword = await HashPassword(password);

  if(_userPass == hashedPassword){
    const newUser = {
      ...user._doc,
      status: "3"
    }
   
    const dbUser = await UpdateUser(newUser);
    if(instanceOfTypeIUser(dbUser)){

      return res.status(200).send(user)
    }else{
      const error = user as ICustomError;
      return  res.status(400).send(error.message);
    }
  }
 
    return  res.status(400).send("User not deleted");
})



router.post('/api/users/staff', async (req: Request, res: Response) => {
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


router.post('/api/users/:id', async (req: Request, res: Response) => {
  const { title, firstName, surname, email, password } = req.body;
  const id = req.params.id;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {// valid ObjectId
    
    const dbUser = { title, firstName, surname, email, password, ["_id"]:id } as IUser;
   
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

router.post('/api/user/delete/deleteUser', async (req: Request, res: Response) => {
  const { userId } = req.body;
  
  
      const _user = await DeleteUser(userId);
  
  
      return res.status(200).send(_user);
    
 

});

export { router as userRouter }