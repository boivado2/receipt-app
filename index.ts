import express from 'express'
import vendors from './routes/vendors'
import products from './routes/products'
import auth from './routes/auth'

import dotenv from 'dotenv'
import db from './starter/db'
dotenv.config()


const app = express()
db('mongodb://localhost/invoice')

app.use(express.json());
app.use('/api/login',auth )
app.use('/api/vendors', vendors)
app.use('/api/products', products)



app.get("/", (req, res) => {
  res.send("I love programming..")
})

const PORT = process.env.PORT || 9000
app.listen(PORT, () => console.log(`app running on ${PORT}`))