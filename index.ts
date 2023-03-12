import express from 'express'
import dotenv from 'dotenv'
import db from './starter/db'
import logger from './starter/logger'
import routes from './starter/routes'
import prod from './starter/prod'
import config from './starter/config'
import winston from 'winston';

dotenv.config({path: `.env.${process.env.NODE_ENV}`})


const app = express()


logger()
routes(app)
db(process.env.MONGODB_URI!)
config()
prod(app)






const PORT = process.env.PORT || 9000
const server = app.listen(PORT, () => winston.info(`app running on ${PORT}`))

export default server