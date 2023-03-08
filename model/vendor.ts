import mongoose, {  Model, Schema, Types } from 'mongoose'
import { IVendor } from '../interfaces/index'
import Joi from 'joi'
import bcrypt from 'bcrypt'
import jsonwebtoken  from 'jsonwebtoken'



interface IVendorMethods {
  hashPassword(data: string): Promise<string>
  generateAuthToken () : string
}

type VendorModel = Model<IVendor, {}, IVendorMethods>

const vendorSchema = new Schema<IVendor, VendorModel, IVendorMethods>({
  businessName: { type: String,  max: 225, required: true },
  companyType: { type: String, min: 4, max: 225, required: true },
  address: { type: String, min: 4, max: 225, required: true },
  ownerName: { type: String, min: 4, max: 50, required: true },
  email: { type: String, min: 4, max: 225, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  logoName: { type: String , required: true},
  logoUrl: {type: String},
  password: {type: String, required: true}
}, { timestamps: true, })


vendorSchema.methods.hashPassword = async(data) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(data, salt)
}

vendorSchema.methods.generateAuthToken = function () {

  return jsonwebtoken.sign({ email: this.email, _id: this._id }, process.env.jsonWebToken!)
}

const Vendor = mongoose.model<IVendor, VendorModel>("Vendor", vendorSchema)




const validateVendor = (data: IVendor) => {
  
  const schema = Joi.object<IVendor>({
    address: Joi.string().max(225).required(),  
    ownerName: Joi.string().max(50).required(),
    businessName : Joi.string().max(225).required(),
    companyType : Joi.string().max(225).required(),
    email: Joi.string().required().email(),
    logoName: Joi.string().required(),
    logoUrl : Joi.string(),
    phone: Joi.string().required(),
    password: Joi.string().min(4).optional().required()
  })

  return schema.validate(data, {abortEarly: true})
}


export {
  Vendor,
  validateVendor
}