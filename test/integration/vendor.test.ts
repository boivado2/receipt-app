import request from 'supertest'
import server from './../../index';
import { Vendor } from '../../model/vendor';


describe('/Vendor', () => {

  beforeAll(() => {})

  afterAll(async() => {
    await Vendor.deleteMany()
    await server.close()
  })


  describe('/GET', () => {
    
    // it should get all products 
    it('should return 200', () => {})
  })

})

