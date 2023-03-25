import mongoose, {  Schema } from 'mongoose'
import { IReceipt } from '../interfaces/index'
import Joi from 'joi'
import { productSchema } from './product'



const receiptSchema = new Schema<IReceipt>({
  className: { type: String, max: 225, required: true },
  narration: { type: String, min: 4, max: 225, required: true },
  receiptNumber: { type: String || Number, required: true },
  customer: {
    name: { type: String, required: true, min: 3, max: 50},
    email: { type: String, required: true},
    phone: {type: String, required: true}, 
    address: {
      city:{ type: String, required: true, min: 3, max: 50},
       street: { type: String, required: true, min: 3, max: 50},
        state: { type: String, required: true, min: 3, max: 50}
    },
  },
  items: [ { type: productSchema , required: true} ],
  vendor: { type: new Schema({
    address: {
      city:{ type: String, required: true, min: 3, max: 50},
       street: { type: String, required: true, min: 3, max: 50},
        state: { type: String, required: true, min: 3, max: 50}
    },    
    email: {type: String, require: true },
    phone: {type: String, require: true },
    businessName: {type: String, require: true }

  }),
   required: true 
  },
  totalPrice: {type: Number, required: true, min:0}

}, { timestamps: true, })



const Receipt = mongoose.model<IReceipt>("Receipts", receiptSchema)




const validateReceipt = (data: IReceipt) => {
  
  const schema = Joi.object<IReceipt>({
    className: Joi.string().max(50).required(),  
    narration: Joi.string().max(225).required(),
    items : Joi.array().items(
      Joi.string().regex(/^[0-9a-fA-F]{24}$/, {name: "Object id"}).message("invalid id")
    ).required(),
    vendor: Joi.string().regex(/^[0-9a-fA-F]{24}$/, {name: "object id"}).message("invalid id") ,
    receiptNumber : Joi.number().min(0).required(),
    totalPrice: Joi.number().min(0),
    customer :Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone : Joi.string().required(), 
      branchNO: Joi.string().required(),
      address: Joi.object({
        street: Joi.string().required(), 
        city: Joi.string().required(),
        state: Joi.string().required()
      })
    }).required(),

  })

  return schema.validate(data, {abortEarly: true})
}


export {
  Receipt,
  validateReceipt,

}
