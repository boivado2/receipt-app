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
interface ICustomer {
  name: string
  phone: string
  address: Address
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

interface Invoice {

  // receiptId: string
  receiptNumber: string
  dateCreated: Date
  dateUpdated: Date
  className: string
  logoUrl: string

  vendor: {

    name: string
    phone: string
    email: string
    address: string
    branchNO: string
  }

  customerInfo : ICustomer
  totalPrice: number
  totalQuantity: number
}
