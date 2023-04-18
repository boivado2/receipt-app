import express, { Request, Response } from 'express';
import  Joi from 'joi';
import { Vendor } from '../model/vendor';
import bcrypt from 'bcrypt'
import auth from '../middleware/auth';
const router = express.Router()

interface ILogin {
  email: string
  password: string
}

interface IResetPassword {
  currentPassword: string
  newPassword: string
}

type MyResponse<T> = { error: string } | { msg : string}  | T


router.post('/login', async(req: Request, res: Response) => {

  const body = req.body as ILogin
  
  const { error } = validate(body)
  if (error) return res.status(400).json({ error: error.message })
  
  let vendor = await Vendor.findOne({ email: body.email })
  if (!vendor) return res.status(400).json({ error: "Invalid email or password" })
  
  const validPassword = await bcrypt.compare(body.password, vendor.password)
  if (!validPassword) return res.status(400).json({ error: "Invalid email or password" })
  
  
  const token = vendor.generateAuthToken()

  res.json({token})
 
})

router.patch('/reset-password', auth, async(req : Request<{}, {}, IResetPassword>, res: Response<MyResponse<{}>>) => {

  const { error } = validateResetPassword(req.body)
  if (error) return res.status(400).json({ error: error.message })

  const vendor = await Vendor.findById(req.user._id)
  if(!vendor) return res.status(401).json({error: "user not found."})


  let validPassword = await bcrypt.compare(req.body.currentPassword, vendor.password)
  if (!validPassword) return res.status(400).json({ error: "Invalid email or password" })


  validPassword = await bcrypt.compare(req.body.newPassword, vendor.password)
  if(validPassword) return res.status(400).json({error: "Please use a different password."})

  vendor.password = await vendor.hashPassword(req.body.newPassword)

  await vendor.save()

  res.status(201).send({ msg: "password reset successfully."})
  
})

const validateResetPassword = (data: IResetPassword) => {
  const schema = Joi.object<IResetPassword>({ currentPassword: Joi.string().min(5).required(), newPassword: Joi.string().min(5).required() })

  return schema.validate(data, { abortEarly: true })
  
  
}


const validate = (data: ILogin) => {
  const schema = Joi.object<ILogin>({ email: Joi.string().email().required(), password: Joi.string().required() })

  return schema.validate(data, { abortEarly: true })
  
  
}


export default router