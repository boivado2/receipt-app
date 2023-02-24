import mongoose, { HydratedDocument, Model, Schema } from 'mongoose'
import { IVendor } from '../interfaces/index'
import Joi from 'joi'




const vendorSchema = new Schema<IVendor>({
  businessName: { type: String,  max: 225, required: true },
  companyType: { type: String, min: 4, max: 225, required: true },
  Address: { type: String, min: 4, max: 225, required: true },
  OwnerName: { type: String, min: 4, max: 50, required: true },
  email: { type: String, min: 4, max: 225, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  logo: { type: String },
  password: {type: String, required: true}
}, { timestamps: true, })


const Vendor = mongoose.model<IVendor>("Vendors", vendorSchema)




const validateVendor = (data: IVendor) => {
  
  const schema = Joi.object<IVendor>({
    Address: Joi.string().max(225).required(),  
    OwnerName: Joi.string().max(50).required(),
    businessName : Joi.string().max(225).required(),
    companyType : Joi.string().max(225).required(),
    email : Joi.string().required().email(),
    logo : Joi.string(),
    phone: Joi.string().required(),
    password: Joi.string().min(4).required()
  })

  return schema.validate(data, {abortEarly: true})
}


export default {
  Vendor,
  validateVendor
}