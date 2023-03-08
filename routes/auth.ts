import express, { Request, Response } from 'express';
import  Joi from 'joi';
import { Vendor } from '../model/vendor';
import bcrypt from 'bcrypt'
const router = express.Router()

interface ILogin {
  email: string
  password: string
}

router.post('/', async(req: Request, res: Response) => {

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


const validate = (data: ILogin) => {
  const schema = Joi.object<ILogin>({ email: Joi.string().email().required(), password: Joi.string().required() })

  return schema.validate(data, { abortEarly: true })
  
  
}


export default router