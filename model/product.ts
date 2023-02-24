import mongoose, {  Schema } from 'mongoose'
import { IProduct } from '../interfaces/index'
import Joi from 'joi'




const productSchema = new Schema<IProduct>({
  productName: { type: String, max: 225, required: true },
  description: { type: String, min: 4, max: 225, required: true },
  price: { type: Number, minlength: 0, required: true },
  Images: [{ type: String }],
  categories: [{ type: String, min: 4, max: 225, required: true }],
  VendorId: {type: mongoose.Schema.Types.ObjectId, ref: "Vendor"}

}, { timestamps: true, })



const Product = mongoose.model<IProduct>("Product", productSchema)




const validateProduct = (data: IProduct) => {
  
  const schema = Joi.object<IProduct>({
    productName: Joi.string().max(225).required(),  
    description: Joi.string().max(50).required(),
    categories : Joi.array().items(Joi.string().min(4).max(225)).required(),
    Images : Joi.array().items(Joi.string()),
    price : Joi.number().min(0).required(),
    VendorId : Joi.string().required(),
  })

  return schema.validate(data, {abortEarly: true})
}


export default {
  Product,
  validateProduct
}
