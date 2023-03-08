import { string } from 'joi';
import { Document, Schema, Types } from 'mongoose';
import request from 'supertest'
import server from '../../index';
import { IProduct } from '../../interfaces';
import { Product } from '../../model/product';
import { Vendor } from '../../model/vendor';

const testImage1 = `${__dirname}/../../assets/pexels-veeterzy-303383.jpg`
const testImage2 = `${__dirname}/../../assets/alt-testpng.gif`



console.log(testImage1)

describe('/Products', () => {

  let url = '/api/products/'


  afterEach(async() => {
    await Product.deleteMany()
    await server.close()
  })


  describe('/GET', () => {

    let token : string
    let vendor 
    let products
    let vendorId : Types.ObjectId

    beforeEach(async () => {
 
      vendor = new Vendor()

      vendorId = vendor._id

      token = vendor.generateAuthToken()

    })

    const exec = async () => await request(server)
    .get(url)
    .set("x-auth-token", token)

    // check if vendor is authenticated
    it('should return 401 if  jwt token is not provided', async () => {
      token = ""
      const res = await exec()
      expect(res.status).toBe(401)
    })

    it('should return 404 if  invalid jwt token is  provided', async () => {
      token = "token"
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should return 200 if  valid jwt token is  provided', async () => {

      const res = await exec()
      expect(res.status).toBe(200)
    })

    it('should return products if vendor is authenticated', async () => {

      products = [
        {
        productName: "Mac-book lite 2",
        description: "branded with m2 chip 2tb and 64gb ram. fast as light",
        price: 1500,
        vendorId: vendorId,
        imageName: "pro2.jpeg",
        categories: ["tech", "laptops"]

        },
        
        {
        productName: "Mac-book lite 2",
        description: "branded with m2 chip 2tb and 64gb ram. fast as light",
        price: 1500,
        vendorId: vendorId,
        imageName: "pro3.jpeg",
        categories: ["tech", "laptops"]

      }
      ]

      await Product.collection.insertMany(products)
      const res = await exec()
      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(2)
    })

  })


  describe('POST', () => {

    let token : string
    let vendor 
    let product
    let vendorId : Types.ObjectId
    let body : IProduct

    beforeEach(async () => {
 
      vendor = new Vendor()

      vendorId = vendor._id

      token = vendor.generateAuthToken()

      body = {
        productName: "Mac-book lite 2",
        description: "branded with m2 chip 2tb and 64gb ram. fast as light",
        price: 1500,
        vendorId: vendorId,
        imageName: "pro3.jpeg",
        categories: ["tech", "laptops"],
      }

    })

    const exec = async (image? : string) => await request(server)
    .post(url)
    .set("x-auth-token", token)
    .field('productName', body.productName)
    .field('description', body.description)
    .field('categories', body.categories)
    .field('price', body.price)
    .field('vendorId', vendorId.toString())
    .attach('image', image!)


    it('should return 401 if  jwt token is not provided', async () => {
      token = ""
      const res = await exec()
      expect(res.status).toBe(401)
    })

    it('should return 404 if  invalid jwt token is  provided', async () => {
      token = "token"
      const res = await exec()
      expect(res.status).toBe(400)
    })  
    
    it('should return 400 if  product name is empty ', async () => {
      body.productName = ""
      const res = await exec()
      
      expect(res.status).toBe(400)
    })

    it('should return 400 if  price is less than 0 ', async () => {
      body.price = -12
      const res = await exec()
      
      expect(res.status).toBe(400)
    })


    it('should save the product if it is valid ', async () => {
      const res = await exec(testImage1)
     product =  await Product.find({_id : res.body._id})
      expect(res.status).toBe(201)
      expect(product).not.toBeNull()
    })

    it('should return 404 if image is not valid ', async () => {
      const res = await exec(testImage2)
      expect(res.status).toBe(400)
    })



    it('should return the product if it is valid ', async () => {
      const res = await exec(testImage1)
      
      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty("price")
    })


  })


  describe('/GET: ID', () => {

    let token : string
    let id : string | Types.ObjectId
    let vendorId : Types.ObjectId

    beforeEach(async() => {

     token  =  new Vendor().generateAuthToken()
    })

    
    const exec = async () => request(server)
      .get(url + id)
      .set("x-auth-token", token)

    test('should return 401 if auth token is not passed', async() => { 
      token = ""
      const res = await exec()
      expect(res.status).toBe(401);

     })

    test('should return 400 if invalid auth token is  passed', async() => { 
      token ="testing"
      const res = await exec()
      expect(res.status).toBe(400);

     })

    test('should return 404 if no product with the given id exist', async() => { 
      id = new Types.ObjectId()

      const res = await exec()
      expect(res.status).toBe(404);
     })

    test('should return 404 if invalid id is passed', async() => { 
      id = "token"

      const res = await exec()
      expect(res.status).toBe(404);
     })   
     
     test('should return product if valid id is passed', async() => { 

      const product  = new Product(
        {
          productName: "Mac-book lite 2",
          description: "branded with m2 chip 2tb and 64gb ram. fast as light",
          price: 1500,
          vendorId: vendorId,
          imageName: "pro3.jpeg",
          categories: ["tech", "laptops"],
        }
      )

      await product.save()

      id  = product._id

      const res = await exec()
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('price', product.price);

     })


  })


  describe('/DELETE :ID', () => {

    let token: string
    let vendorId : Types.ObjectId
    let productId : Types.ObjectId | string

    beforeEach(async() => {
      let vendor  =  new Vendor()
      token = vendor.generateAuthToken()
      vendorId = vendor._id

    })




    const exec = async(id?: string) => request(server)
      .delete(url + id)
      .set("x-auth-token", token)

    test('should return 401 if auth token is not passed', async() => { 
      token = ""
      const res = await exec()
      expect(res.status).toBe(401);

     })

    test('should return 400 if invalid auth token is  passed', async() => { 
      token ="testing"
      const res = await exec()
      expect(res.status).toBe(400);

     })

     test('should return 404 if product id is not found', async() => { 


      productId  = new Types.ObjectId()

      const res = await exec(productId.toString())
      expect(res.status).toBe(404);

     })



     test('should return 404 if invalid id is passed', async() => { 

      productId  = ""
      const res = await exec(productId)
      expect(res.status).toBe(404);

     })
     



     test('should return 404 if vendorId those match the vendorId reference on product', async() => { 

      vendorId = new Types.ObjectId()

      const product  = new Product(
        {
          productName: "Mac-book lite 2",
          description: "branded with m2 chip 2tb and 64gb ram. fast as light",
          price: 1500,
          vendorId: vendorId,
          imageName: "pro3.jpeg",
          categories: ["tech", "laptops"],
        }
      )

      await product.save()

      productId  = product._id

      const res = await exec(productId.toString())
      expect(res.status).toBe(404);

     })



     test('should return 200 if product is deleted', async() => { 


      const product  = new Product(
        {
          productName: "Mac-book lite 2",
          description: "branded with m2 chip 2tb and 64gb ram. fast as light",
          price: 1500,
          vendorId: vendorId,
          imageName: "pro3.jpeg",
          categories: ["tech", "laptops"],
        }
      )

      await product.save()

      productId  = product._id

      const res = await exec(productId.toString())
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("msg");


     })



  })

})
