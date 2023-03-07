import request from 'supertest'
import server from '../../index';
import { Product } from '../../model/product';
import { Vendor } from '../../model/vendor';


describe('/Products', () => {

  let url = '/products'

  beforeAll(() => {
    console.log("Fuck you ...")
  })

  afterEach(async() => {
    await Product.deleteMany()
    await server.close()
  })


  describe('/GET', () => {

    let token
    let vendor
    let products

    beforeEach(() => {
      vendor = new Vendor({
      businessName: "testing 1",
      address: "testing address",
      companyType: "Tech Hub",
      ownerName: "john",
      email: "testing@gmail.com",
      logoName: "testing.png",
      password: "testing",
      phone: "090909",
      })
      vendor.save()
      
    })


    // check if vendor is authenticated
    it('should return 401 if vendor is  not authenticated', async() => {
      const res = await request(server).get(url)
      expect(res.status).toBe(401)
    })

    // check if jsonToken is valid
    //  check  if vendorId is valid
    // rerun all products
    it('should return 200', () => {})
  })

})
