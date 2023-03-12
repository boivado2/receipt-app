import request from 'supertest'
import server from './../../index';
import { Vendor } from '../../model/vendor';
import { IVendor } from '../../interfaces';
const testImage1 = `${__dirname}/../../assets/pexels-veeterzy-303383.jpg`
const testImage2 = `${__dirname}/../../assets/alt-testpng.gif`

describe('/Vendor', () => {

  const url = '/api/vendors'

  afterEach(async() => {
    await Vendor.deleteMany()
    await server.close()
  })


  describe('/POST', () => {

    let body : IVendor
    beforeEach(() => {

      body = {
        businessName: "testing 1",
        ownerName: "testing name",
        email: "testing@gmail.com",
        companyType: "testing company",
        address: "testing address",
        phone: "090988989",
        logoName: "image.jpeg",
        password: "password"
      }

    })
    const exec  = (logo?: string) => request(server)
      .post(url)
      .field("businessName", body.businessName)
      .field("ownerName", body.ownerName)
      .field("companyType", body.companyType)
      .field("logoName", body.logoName)
      .field("password", body.password)
      .field("email", body.email)
      .field("phone", body.phone)
      .field("address", body.address)
      .attach("logo", logo! )


    
    it('should return 400 if  business name is empty ', async () => {
      body.businessName = ""
      const res = await exec(testImage2)
      
      expect(res.status).toBe(400)
    })

    it('should return 400 if  email is not valid ', async () => {
      body.email = "email"
      const res = await exec(testImage2)
      
      expect(res.status).toBe(400)
    })


    it('should return 400 if vendor logo is not valid ', async () => {
      const res = await exec(testImage2)
      expect(res.status).toBe(400)
    })

    it("should return 400 if vendor already exist", async() => {
        const vendor = {  
          businessName: "testing 1",
          ownerName: "testing name",
          email: "testing@gmail.com",
          companyType: "testing company",
          address: "testing address",
          phone: "090988989",
          logoName: "image.jpeg",
          password: "password"
        }
     
       await Vendor.insertMany([vendor])
       
      const res = await exec(testImage1)

      expect(res.status).toBe(400)

    })

    it('should save the vendor if it is valid ', async () => {
      const res = await exec(testImage1)
      const vendor =  await Vendor.find({email: body.email})

      expect(res.status).toBe(201)
      expect(vendor).not.toBeNull()
    })


    it('should return the vendor if it is valid ', async () => {
      const res = await exec(testImage1)
      
      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty("companyType")
    })

    it("should store hash password in db", async () => {
      const res = await exec(testImage1)

      const vendor = await Vendor.findById(res.body._id)

      expect(vendor?.password).not.toBe(body.password)
    })

    it("should not return password if vendor is save", async () => {
      const res = await exec(testImage1)

      expect(res.body).not.toHaveProperty("password")
    })

    it("should have auth custom header", async () => {
      const res = await exec(testImage1)

      expect(res.header).toHaveProperty("x-auth-token")
      expect(res.headers['x-auth-token']).not.toBeFalsy()

    })
  })

  describe("GET", () => {

    let token : string
    beforeEach(async() => {
      const vendor = new Vendor({
        businessName: "testing 1",
        ownerName: "testing name",
        email: "testing@gmail.com",
        companyType: "testing company",
        address: "testing address",
        phone: "090988989",
        logoName: "image.jpeg",
        password: "password"
      })

      await vendor.save()
      token = vendor.generateAuthToken()
    })

    const exec = () => request(server)
      .get(url)
      .set("x-auth-token", token)


      it('should return 401 if  jwt token is not provided', async () => {
        token = ""
        const res = await exec()
        expect(res.status).toBe(401)
      })
  
      it('should return 400 if  invalid jwt token is  provided', async () => {
        token = "token"
        const res = await exec()
        expect(res.status).toBe(400)
      })  

      it('should return 404 if  vendor is not found', async () => {
        token = new Vendor().generateAuthToken()
        const res = await exec()
        expect(res.status).toBe(404)
      })  

      it('should return vendor', async () => {
        const res = await exec()

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty("ownerName")
      })  
  })
})

