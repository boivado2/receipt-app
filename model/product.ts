import mongoose, {  Schema } from 'mongoose'
import { IProduct } from '../interfaces/index'
import Joi from 'joi'




const productSchema = new Schema<IProduct>({
  productName: { type: String, max: 225, required: true },
  description: { type: String, min: 4, max: 225, required: true },
  price: { type: Number, minlength: 0, required: true },
  imageUrl: { type: String },
  categories: [{ type: String, min: 3, max: 225, required: true }],
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  imageName: { type: String, required:true },

}, { timestamps: true, })



const Product = mongoose.model<IProduct>("Product", productSchema)




const validateProduct = (data: IProduct) => {
  
  const schema = Joi.object<IProduct>({
    productName: Joi.string().max(50).required(),  
    description: Joi.string().max(225).required(),
    categories : Joi.array().items(Joi.string().min(3).max(225)).required(),
    imageUrl: Joi.string(),
    imageName: Joi.string().required(),
    price : Joi.number().min(0).required(),
    vendorId : Joi.string().required(),
  })

  return schema.validate(data, {abortEarly: true})
}


export {
  Product,
  validateProduct
}
