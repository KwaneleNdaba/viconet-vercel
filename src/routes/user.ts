import express, { Request, Response } from 'express'
import { User, IUser } from '../models/user'
import { AddUser, GetAllUsers, GetUserByEmail, GetUserById, UpdateUser } from '../repositories/usersRepository';
import { LoginUser } from '../services/loginService';
import { instanceOfTypeIUser } from '../lib/typeCheck';

const router = express.Router()

router.get('/api/users', async (req: Request, res: Response) => {
  const user = await GetAllUsers();
  return res.status(200).send(user)
})
  router.get('/api/users/:id', async (req: Request, res: Response) => {
  
    const id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {// valid ObjectId
      
      const user = await GetUserById(id);
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

router.post('/api/users', async (req: Request, res: Response) => {
  const { title, firstName, surname, email, password, type } = req.body;
  const dbUser = { title, firstName, surname, email, password, type } as IUser;
  
  const user = await AddUser(dbUser);
 
  return res.status(201).send(user)
})

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