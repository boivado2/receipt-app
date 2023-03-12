import express, {Express} from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import vendors from '../routes/vendors'
import products from '../routes/products'
import auth from '../routes/auth'
import errorHandler from '../middleware/error'


export default (app: Express) => {
  app.use(cors())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(express.json());
  app.use('/api/login',auth )
  app.use('/api/vendors', vendors)
  app.use('/api/products', products)

  app.get("/", (req, res) => {
    res.send("I love programming..")
  })
  app.use(errorHandler)


}