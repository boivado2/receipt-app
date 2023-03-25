import { Request, Response } from "express"
import { IProduct } from "../interfaces"
import {Product, validateProduct} from '../model/product'
import generateImageName from "../util/generateImageName"
import { postImageToS3, deleteImageFromS3 } from "../util/s3"
import validateRequestFileObject from '../util/validateRequestFileObject';

  const awsCloudFrontUrl = process.env.AWS_CLOUDFRONT_URL!


const addProduct = async(req: Request, res: Response) => { 

  if(!req.file) return res.status(400).json({error: "image is required"})
  const imageName = generateImageName() + req.file.originalname

  const body = req.body as IProduct
      
  const { error } = validateProduct({...body, imageName, vendorId: req.user._id})
  if (error) return res.status(400).json({ error: error.message })

  const {error: fileError}  = validateRequestFileObject(req.file!)
  if (fileError) return res.status(400).json({ error: fileError })

    
   await postImageToS3(req.file, imageName)
    
    const product = new Product<IProduct>({
      productName: body.productName,
      description: body.description,
      price: body.price,
      vendorId: req.user._id,
      imageName: imageName,
      categories: body.categories,
    })
    

    await product.save()
    
    res.status(201).send(product)


}


const getVendorProducts = async (req: Request, res: Response) => { 

  const products: IProduct[] = await Product.find({ vendorId: req.user._id })
  
  products.forEach((product) => {
    product.imageUrl = awsCloudFrontUrl + product.imageName
  })

  res.status(200).send(products)
}


// const getProducts = async (req: Request, res: Response) => {
  
//   const products: IProduct[] = await Product.find()

//   products.forEach((product) => {
//     product.imageUrl = awsCloudFrontUrl + product.imageName
//   })

//   res.status(200).send(products)
// }



const getProduct = async (req: Request, res: Response) => {
  const {id: productId} = req.params
  
  const product = await Product.findById(productId)
  if (!product) return res.status(404).json({ msg: "Product not found" })
  
  product.imageUrl = awsCloudFrontUrl + product.imageName
  


  res.status(200).send(product)
  
}

const updateProduct = async (req: Request, res: Response) => {

  let body = req.body as IProduct
  const {id: productId} = req.params
  let imageName : string


  let product = await Product.findById(productId)
  if (!product) return res.status(404).json({ msg: "Product not found" })


  imageName  = req.file ?  generateImageName() + req.file.originalname : product.imageName


  const { error } = validateProduct({...body, imageName, vendorId: req.user._id})
  if (error) return res.status(400).json({ error: error.message })

  const {error: fileError}  = validateRequestFileObject(req.file)
  if (fileError) return res.status(400).json({ error: fileError })


  const userPermitted = product.vendorId.toString() === req.user._id
  if(!userPermitted) return res.status(401).json({error: "unauthorized"})



   req.file && await deleteImageFromS3(product.imageName)
  
  await postImageToS3(req.file, imageName )

  product = await Product.findByIdAndUpdate(productId, { $set: {...body, imageName, vendorId: req.user._id} }, { new: true })
  

  res.status(200).send(product)
  
  
}


const deleteProduct = async (req: Request, res: Response) => {
  const {id: productId} = req.params

// check to see if product id exits
  let product = await Product.findById(productId)
  if (!product) return res.status(404).json({ msg: "Product not found" })
  
  // check if vendor is authorize to delete product
  const userPermitted = product.vendorId.toString() === req.user._id
  if(!userPermitted) return res.status(401).json({error: "unauthorized"})

  await deleteImageFromS3(product.imageName)

 product.delete()
  
  res.status(200).json({msg: "Product deleted successfully."})
}






export default {
  addProduct,
  getVendorProducts,
  // getProducts,
  getProduct,
  updateProduct,
  deleteProduct
}