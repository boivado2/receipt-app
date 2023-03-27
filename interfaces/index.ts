import { Document, Types } from "mongoose"

export interface IVendor  {
  _id?: Types.ObjectId
  businessName:		string
  ownerName: string
  companyType: string
  address: Address,
  email: string
  phone: string
  logoName: string
  logoUrl?: string
  password: string
}

type Address = {
  street: string
  city: string
  state: string
}
export interface ICustomer {
  name: string
  phone: string
  address: Address
  email : string
}

interface IVendorInfo  extends ICustomer {
  branchNO?: string | number
}

export interface IProduct {

  productName: string
  description: string
  price: number
  imageUrl?: string
  imageName: string
  categories: string []
  vendorId: Types.ObjectId
}

export interface IReceiptProduct extends IProduct {
  qty: number
  productId?: string
}



export interface IReceipt {
  _id?: Types.ObjectId
  receiptNumber: string
  className: string
  narration: string
  vendor: IVendorInfo | Types.ObjectId
  customer : ICustomer
  items : IReceiptProduct [] 
  totalPrice: number
}
