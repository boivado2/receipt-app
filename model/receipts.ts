import mongoose, {  Schema } from 'mongoose'
import { ICustomer, IReceipt, IReceiptProduct, IVendor, IVendorInfo } from '../interfaces/index'
import Joi from 'joi'



const receiptSchema = new Schema<IReceipt>({
  className: { type: String, max: 225, required: true },
  narration: { type: String, min: 4, max: 225, required: true },
  receiptNumber: { type: String, required: true, unique: true },
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
  items: [ 
    { 
      type: new Schema<IReceiptProduct>({
        productName: { type: String, max: 225, required: true },
        description: { type: String, min: 4, max: 225, required: true },
        price: { type: Number, minlength: 0, required: true },
        imageUrl: { type: String },
        vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
        imageName: { type: String, required:true },
        qty: {type: Number, minlength:1}

      }), 
      required: true
    }
   ],
  vendor: { type: new Schema<IVendorInfo | IVendor>({
    address: {
      city:{ type: String, required: true, min: 3, max: 50},
       street: { type: String, required: true, min: 3, max: 50},
        state: { type: String, required: true, min: 3, max: 50}
    },    
    email: {type: String, require: true },
    phone: {type: String, require: true },
    businessName: {type: String, require: true },
    branchNO: {type: String}
  }),
   required: true 
  },
  dateIssued: {type:Date, required: true},
  totalPrice: {type: Number, required: true, min:0}

}, { timestamps: true, })



const Receipt = mongoose.model<IReceipt>("Receipts", receiptSchema)




const validateReceipt = (data: IReceipt) => {
  
  const schema = Joi.object<IReceipt>({
    className: Joi.string().max(50).required(),  
    narration: Joi.string().max(225).required(),

    items : Joi.array().items(
      Joi.object<IReceiptProduct>({productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, {name: "Object id"}).message("invalid id"),
       qty:Joi.number().required() 
      })
    ).required(),
    receiptNumber : Joi.string().min(0).required(),
    totalPrice: Joi.number().min(0),
    dateIssued: Joi.date().required(),
    customer :Joi.object<ICustomer>({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone : Joi.string().required(), 
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
