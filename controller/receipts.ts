import { Request, Response } from "express"
import _ from 'lodash'
import { Product } from "../model/product";
import { Receipt, validateReceipt } from "../model/receipts";
import { Vendor } from "../model/vendor";
import {  IReceipt } from './../interfaces/index';

type MyResponse<T> = { error: string } | { msg : string}  | T

// get all receipts
const getReceipts = async(req:Request, res:Response<MyResponse<IReceipt[]>>) => {

  const receipts = await Receipt.find({"vendor.email": req.user.email})

  res.status(200).send(receipts)

  
}

// get single receipt
const getReceipt = async(req:Request<{id: string}, {}, {}>, res:Response<MyResponse<IReceipt>>) => {
  const receipt = await Receipt.findById(req.params.id)
  if(!receipt) return res.status(404).json({error: "receipt not found"})

  res.status(200).send(receipt)

}

// update receipt
const updateReceipt = async(req:Request<{id: string}, {}, IReceipt>, res:Response<MyResponse<IReceipt>>) => {

  const body = req.body
  const id = req.params.id


  const {error} =  validateReceipt(body)
  if(error) return res.status(400).json({error: error.message})

  let receipt = await Receipt.findById(id)
  if(!receipt) return res.status(404).json({error: "receipt not found."})

  const vendor = await Vendor.findById(req.user._id)
  if(!vendor) return res.status(404).json({error: "vendor not found"})


  const userPermitted = req.user.email === receipt.vendor.email
  if(!userPermitted) return res.status(401).json({error: "unauthorized"})

  const products = await Promise.all(body.items.map(async(item) => {

    const product =  await Product.findById(item.productId)
    if(!product) {
      return null
    }
  
  
    if(item.productId === product._id.toString()){
      return {
        categories: product?.categories, 
        description: product?.description, 
        imageName: product?.imageName, 
        imageUrl: product?.imageUrl,
        price: product?.price, 
        productName: product?.productName, 
        vendorId: product?.vendorId, 
        qty: item.qty 
      }
    }
  
    
   }))

   if(products.includes(null)) return res.status(404).json({error: "product not found"})

   body.vendorId
   receipt.set({ ...body, items: products})

  await receipt.save()
  
  res.status(201).send(receipt)  


}

// add receipt
const addReceipt = async(req: Request<{}, {}, IReceipt>, res:Response<MyResponse<IReceipt>>) => {
  const body = req.body

 const {error} =  validateReceipt(body)
 if(error) return res.status(400).json({error: error.message})

 const vendor = await Vendor.findById(req.user._id)
 if(!vendor) return res.status(404).json({error: "vendor not found"})


 let receipt = await Receipt.findOne({receiptNumber: body.receiptNumber})
 if(receipt) return res.status(400).json({error: "receipt already exist."})

 const products = await Promise.all(body.items.map(async(item) => {

  const product =  await Product.findById(item.productId)
  if(!product) {
    return null
  }


  if(item.productId === product._id.toString()){
    return {
      categories: product?.categories, 
      description: product?.description, 
      imageName: product?.imageName, 
      imageUrl: product?.imageUrl,
      price: product?.price, 
      productName: product?.productName, 
      vendorId: product?.vendorId, 
      qty: item.qty 
    }
  }

  
 }))


 if(products.includes(null)) return res.status(404).json({error: "product not found"})


  receipt = new Receipt({
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

// delete receipt
const deleteReceipt = async(req:Request<{id: string}, {}, {}>, res: Response<MyResponse<IReceipt>>) => {
  // check the receipt id
  const receipt = await Receipt.findById(req.params.id)
  if(!receipt) return res.status(404).json({error: "receipt not found."})

  // check if user has permission to delete receipt
  const userPermitted = req.user.email === receipt.vendor.email
  if(!userPermitted) return res.status(401).json({error: "unauthorized"})

  receipt.delete()

  res.status(200).json({msg: "receipt deleted successfully"})

}


export default {
  getReceipts,
  getReceipt,
  updateReceipt,
  addReceipt,
  deleteReceipt
}