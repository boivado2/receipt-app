interface IVendor {

  businessName:		string
  name: string
  accountCreationDate: Date
  companyType: string
  Address: string
  email: string
  phone: string
  logo: string
}

interface ICustomer {
  name: string
  phone: string
}

interface IProduct {

  productName: string
  // productId: string
  description: string
  price: number
  dateAdded: Date
  dateUpdated: Date
  Images: string[]
  categories: string[]
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

