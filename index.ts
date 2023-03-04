import 'express-async-errors'
// import joiObjectId from 'joi-objectid'
import express from 'express'
import vendors from './routes/vendors'
import products from './routes/products'
import auth from './routes/auth'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import db from './starter/db'
import errorHandler from './middleware/error'
dotenv.config()


const app = express()
db(process.env.MONGODB_URI_DEV!)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());
app.use('/api/login',auth )
app.use('/api/vendors', vendors)
app.use('/api/products', products)
app.use(errorHandler)


app.get("/", (req, res) => {
  res.send("I love programming..")
})

const PORT = process.env.PORT || 9000
app.listen(PORT, () => console.log(`app running on ${PORT}`))