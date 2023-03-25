import { Request, Response } from "express"
import _ from 'lodash'
import { Product } from "../model/product";
import { Receipt, validateReceipt } from "../model/receipts";
import { Vendor } from "../model/vendor";
import { IReceipt } from './../interfaces/index';


const getReceipts = async(req:Request, res:Response) => {
  
}

const getReceipt = async(req:Request, res:Response) => {}

const updateReceipt = async(req:Request, res:Response) => {}

const addReceipt = async(req: Request, res:Response) => {
  const body = req.body as IReceipt

 const {error} =  validateReceipt(body)
 if(error) return res.status(400).json({error: error.message})

 const vendor = await Vendor.findById(body.vendor)
 if(!vendor) return res.status(404).json({error: "vendor not found"})

 const products = await Promise.all(body.items.map(async(item) => {
  return await Product.findById(item)
 }))

 if(products.includes(null)) return res.status(404).json({error: "product not found"})


 const receipt = new Receipt({
  className: body.className,
  customer: body.customer,
  items: products,
  vendor: vendor,
  receiptNumber: body.receiptNumber,
  narration: body.narration,
  totalPrice: body.totalPrice
 })


 await receipt.save()

 res.status(201).send(receipt)

}

const deleteReceipt = async(req:Request, res: Response) => {}


export default {
  getReceipts,
  getReceipt,
  updateReceipt,
  addReceipt,
  deleteReceipt
}