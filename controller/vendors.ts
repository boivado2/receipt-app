import { Request, Response } from "express"
import _ from 'lodash'
import { IVendor } from "../interfaces"
import {validateVendor,Vendor} from "../model/vendor"
import generateImageName from "../util/generateImageName"
import { deleteImageFromS3, postImageToS3 } from "../util/s3"
import validateRequestFileObject from './../util/validateRequestFileObject';


const awsCloudFrontUrl = process.env.AWS_CLOUDFRONT_URL!



const addVendor = async (req: Request, res: Response) => {
  const logoName = generateImageName() + req.file?.originalname

  const body = req.body as IVendor

  const { error } = validateVendor({...body, logoName})
  if (error) return res.status(400).json({ error: error.message })


  const {error: fileError} = validateRequestFileObject(req.file!)
  if(fileError) return res.status(400).json({error: fileError})

  let vendor = await Vendor.findOne({ email: body.email })
  if(vendor) return res.status(400).json({error: "Vendor already exist"})

  
  vendor = new Vendor<IVendor>({ ...body, logoName })

  vendor.password =  await vendor.hashPassword(vendor.password)

  await postImageToS3(req.file, logoName)

  await vendor.save()

  
  const token  = vendor.generateAuthToken()

  res.status(201)
    .header('x-auth-token', token)
    .header("access-control-expose-headers", "x-auth-token")
    .send( _.pick(vendor, ['businessName', "_id", 'companyType', 'address', 'logoUrl', 'logoName', 'ownerName', 'phone', 'email']))
  
}


const updateVendor = async (req: Request, res: Response) => {

  const {id: vendorId} = req.params
  const body = req.body as IVendor
  let logoName : string

  
  let vendor = await  Vendor.findById(vendorId)
  if (!vendor) return res.status(404).json({ msg: "Vendor not found" })


  const vendorLogoName = vendor.logoName

  logoName  = req.file ?  generateImageName() + req.file.originalname : vendorLogoName



  const { error } = validateVendor({...body, logoName})
  if (error && error?.details[0].path[0] !== "password") return res.status(400).json({ error: error.message })

  const {error: fileError}  = validateRequestFileObject(req.file!)
  if (fileError) return res.status(400).json({ error: fileError })

  vendor = await Vendor.findOne({ email: body.email })
  if(vendor?.email !== req.user.email && vendor) return res.status(400).json({error: "Vendor with this email already exist"})

  req.file && await deleteImageFromS3(vendorLogoName)
  
  await postImageToS3(req.file, logoName )


  vendor = await Vendor.findByIdAndUpdate(vendorId, { $set:{...body, logoName} }, { new: true })


  res.status(200).send(_.pick(vendor, ['businessName', "_id", 'companyType', 'address', 'logoUrl', 'logoName', 'ownerName', 'phone', 'email']))

}

const getVendor =async (req: Request, res: Response) => { 
  const vendor = await Vendor.findById(req.user._id)
  if(!vendor) return res.status(404).json({error: "vendor not found"})

  vendor.logoUrl = awsCloudFrontUrl + vendor.logoName

  res.send( _.pick(vendor, ['businessName', "_id", 'companyType', 'address', 'logoUrl', 'logoName', 'ownerName', 'phone', 'email']))
}






export default  {
  getVendor,
  addVendor,
  updateVendor
}