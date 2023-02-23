import { Request, Response } from "express"


const getVendor = (req: Request, res: Response) => { 
  res.send("Vendors page")
}

const getVendorProducts = (req: Request,  res: Response) => { }

const getVendorProduct = (req: Request,  res: Response) => { }

const getVendorCustomers = (req: Request, res: Response) => { }

const getVendorCustomer = (req: Request, res: Response) => { }

const getVendorInvoices = (req: Request, res: Response) => { }

const getVendorInvoice = (req: Request,  res: Response) => {}




export default {
  getVendor,
  getVendorProducts,
  getVendorProduct,
  getVendorCustomer,
  getVendorCustomers,
  getVendorInvoices,
  getVendorInvoice
}