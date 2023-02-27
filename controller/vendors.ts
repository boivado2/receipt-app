import { Request, Response } from "express"
import { IVendor } from "../interfaces"
import {validateVendor,Vendor} from "../model/vendor"


const addVendor = async (req: Request, res: Response) => {

  const body = req.body as IVendor

  const { error } = validateVendor(body)
  if (error) return res.status(400).json({ error: error.message })

  let vendor = await Vendor.findOne({ email: body.email })
  if(vendor) return res.status(400).json({error: "Vendor already exist"})

  vendor = new Vendor<IVendor>({ ...body })

  vendor.password =  await vendor.hashPassword(vendor.password)

  await vendor.save()

  res.status(201).send(vendor)
  
}


const updateVendor = async (req: Request, res: Response) => {

  const body = req.body as IVendor

  const { error } = validateVendor(body)
  if (error) return res.status(400).json({ error: error.message })


  const vendor = await Vendor.findByIdAndUpdate(req.params.vendorId, { $set: body }, { new: true })
  if(!vendor) return res.status(404).json({error: "The vendor withe given id not found."})
  
  await vendor.save()

  res.status(201).send(vendor)
  
}

const getVendor = (req: Request, res: Response) => { 
  res.send("Vendors page")
}






export default  {
  getVendor,
  addVendor,
  updateVendor
}