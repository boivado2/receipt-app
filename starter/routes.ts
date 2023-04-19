import express, {Express} from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import vendors from '../routes/vendors'
import products from '../routes/products'
import receipts from '../routes/receipts'
import auth from '../routes/auth'
import errorHandler from '../middleware/error'


export default (app: Express) => {
  const corsOptions ={
    origin:'*', 
    credentials:true,
    optionSuccessStatus:200,
 }
  app.use(cors(corsOptions))
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(express.json());
  app.use('/api/auth',auth )
  app.use('/api/vendors', vendors)
  app.use('/api/products', products)
  app.use('/api/receipts', receipts)

  app.get("/", (req, res) => {
    res.send("I love programming..")
  })
  app.use(errorHandler)


}