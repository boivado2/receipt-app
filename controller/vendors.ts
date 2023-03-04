import { Request, Response } from "express"
import { IVendor } from "../interfaces"
import {validateVendor,Vendor} from "../model/vendor"
import generateImageName from "../util/generateImageName"
import { deleteImageFromS3, postImageToS3 } from "../util/s3"


const addVendor = async (req: Request, res: Response) => {
  const logoName = generateImageName()

  const body = req.body as IVendor

  const { error } = validateVendor({...body, logoName})
  if (error) return res.status(400).json({ error: error.message })

  let vendor = await Vendor.findOne({ email: body.email })
  if(vendor) return res.status(400).json({error: "Vendor already exist"})

  
  vendor = new Vendor<IVendor>({ ...body, logoName })

  vendor.password =  await vendor.hashPassword(vendor.password)

  await vendor.save()

  await postImageToS3(req.file, logoName)
  

  res.status(201).send(vendor)
  
}


const updateVendor = async (req: Request, res: Response) => {

  const {id: vendorId} = req.params
  const body = req.body as IVendor

  const { error } = validateVendor(body)
  if (error) return res.status(400).json({ error: error.message })


  const vendor = await Vendor.findByIdAndUpdate(vendorId, { $set: body }, { new: true })
  if(!vendor) return res.status(404).json({error: "The vendor withe given id not found."})

  deleteImageFromS3(vendor.logoName)
  await vendor.save()

  postImageToS3(req.file, vendor.logoName)

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