import express, { Request, Response } from 'express'
import { HashPassword } from '../services/loginService';
import { AddOrganisation, GetAllOrganisations, GetFullOganisationById, GetOrganisationById } from '../repositories/organisationRepository';
import { ICompanyRegisterModel } from '../models/organisations';
import { instanceOfTypeCustomError, instanceOfTypeIOrganisation } from '../lib/typeCheck';

const router = express.Router()

router.get('/api/organisation', async (req: Request, res: Response) => {
  const user = await GetAllOrganisations();
  return res.status(200).send(user)
})


router.get('/api/organisation/:id', async (req: Request, res: Response) => {
  
    const id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {// valid ObjectId

      const user = await GetOrganisationById(id);
      res.header("Access-Control-Allow-Origin", "*");
      return res.status(200).send(user)
    }else{
      return res.status(404).send("Cannot find user");
    }

})


router.get('/api/organisationSummary/:id', async (req: Request, res: Response) => {
  
  const id = req.params.id;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {// valid ObjectId

    const user = await GetFullOganisationById(id);
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(200).send(user)
  }else{
    return res.status(404).send("Cannot find organisation");
  }

})


router.post('/api/organisation', async (req: Request, res: Response) => {
  const { 
    email,
    password,
    userName,
    userSurname,
    userNumber,
    companyNumber,
    companyReg,
    companyName,
    companyAdrress,
    position,
    title,
    userEmail  } = req.body;

    const hashedPassword = await HashPassword(password);

    const companyRegister = {
      email:email,
      password:hashedPassword,
      userName:userName,
      userSurname:userSurname,
      userNumber:userNumber,
      companyNumber:companyNumber,
      companyReg:companyReg,
      companyName:companyName,
      companyAdrress:companyAdrress,
      position:position,
      title:title,
      userEmail:userEmail
    } as ICompanyRegisterModel;

    const _organisation = await AddOrganisation(companyRegister);
  const  code = !instanceOfTypeIOrganisation(_organisation)? 500:200;

  return res.status(code).send(_organisation);

});


export { router as organiwsationRouter }