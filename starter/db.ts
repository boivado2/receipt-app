import mongoose from 'mongoose'
import winston from 'winston';

export default async function (uri: string) {
 
  try {
    await mongoose.set('strictQuery', true)
    await mongoose.connect(uri)
    winston.info("db connected successfully")
  } catch (error) {
    winston.error(error) 
    process.exit(1)
  }

}