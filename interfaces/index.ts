import { Document, Types } from "mongoose"

export interface IVendor  {

  businessName:		string
  OwnerName: string
  companyType: string
  Address: string
  email: string
  phone: string
  logo: string
  password: string
}

interface ICustomer {
  name: string
  phone: string
}

export interface IProduct {

  productName: string
  description: string
  price: number
  imageUrl?: string
  imageName: string
  categories: Types.Array<string>
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
