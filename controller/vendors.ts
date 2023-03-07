import { Request, Response } from "express"
import _ from 'lodash'
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
  
  

  res.status(201).send( _.pick(body, ['businessName', "_id", 'companyType', 'address', 'logoUrl', 'logoName', 'ownerName', 'phone', 'email']))
  
}


const updateVendor = async (req: Request, res: Response) => {

  // const {id: vendorId} = req.params
  // const body = req.body as IVendor
  //   const logoName = generateImageName()

  //   console.log(req.file)


  // const { error } = validateVendor({...body, logoName})
  // if (error && !error?.details[0].path[0]) return res.status(400).json({ error: error.message })

  // let vendor = await Vendor.findOne({ email: body.email })
  // if(vendor) return res.status(400).json({error: "Vendor with this email already exist"})

  // const updatedVendor = _.pick(body, ['businessName', 'companyType', 'address', 'logoUrl', 'logoName', 'ownerName', 'phone', 'email'])


  // vendor = await Vendor.findByIdAndUpdate(vendorId, { $set:updatedVendor }, { new: true })
  // if(!vendor) return res.status(404).json({error: "The vendor withe given id not found."})

  // deleteImageFromS3(vendor.logoName)

  // postImageToS3(req.file, vendor.logoName)

  res.status(201).send('updated')
}

const getVendor =async (req: Request, res: Response) => { 
  const vendor = await Vendor.findById(req.user._id)

  res.send( _.pick(vendor, ['businessName', "_id", 'companyType', 'address', 'logoUrl', 'logoName', 'ownerName', 'phone', 'email']))
}






export default  {
  getVendor,
  addVendor,
  updateVendor
}