import mongoose from 'mongoose'

export default async function (uri: string) {
 
  try {
    await mongoose.connect(uri)
    console.log("db connected successfully")
  } catch (error) {
    console.log("db connection failed" + error) 
  }

}