import { Request, Response } from "express"
import { IProduct } from "../interfaces"
import {Product, validateProduct} from '../model/product'
import generateImageName from "../util/generateImageName"
import { postImageToS3 } from "../util/s3"


  const awsCloudFrontUrl = process.env.AWS_CLOUDFRONT_URL!


const addProduct = async(req: Request, res: Response) => { 

  const imageName = generateImageName()

  const body = req.body as IProduct
  
  try {
    
    const { error } = validateProduct({...body, imageName})
    
    if (error) return res.status(400).json({ error: error.message })
    

   await postImageToS3(req.file, imageName)
    
    const product = new Product<IProduct>({
      productName: body.productName,
      description: body.description,
      price: body.price,
      vendorId: body.vendorId,
      imageName: imageName,
      categories: body.categories,
    })
    

    await product.save()
    
    res.status(201).send(product)
    
  } catch (error) {
    console.log('error', error)
    
  }

}


const getVendorProducts =async (req :Request, res: Response) => {}

const getProducts = async (req: Request, res: Response) => {
  
  const products: IProduct[] = await Product.find()

  products.forEach((product) => {
    product.imageUrl = awsCloudFrontUrl + product.imageName
  })

  res.status(200).send(products)
}


const getProduct = async (req: Request, res: Response) => {
  
  const product = await Product.findById(req.params.productId)
  if (!product) return res.status(404).json({ msg: "Product not found" })
  
  product.imageUrl = awsCloudFrontUrl + product.imageName
  


  res.status(200).send(product)
  
}

const updateProduct = async (req: Request, res: Response) => {

  const body = req.body as IProduct
  
  // check to see if vendor as permission to update product

  const product = await Product.findByIdAndUpdate(req.params.productId, { $set: body }, { new: true })

  if (!product) return res.status(404).json({ msg: "Product not found" })

  res.status(200).send(product)
  
  
}


const deleteProduct = async (req: Request, res: Response) => {
  const {vendorId, productId} = req.params

// check to see if product id exits
  const product = await Product.findById(productId)
  if (!product) return res.status(404).json({ msg: "Product not found" })
  
// check to see if vendor as permissions to delete products

  
// delete the product if all checks out
  // await Product.findByIdAndDelete(productId)
  res.status(200).json({msg: "Product deleted successfully."})
}






export default {
  addProduct,
  getVendorProducts,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
}