import mongoose from 'mongoose'

export default async function (uri: string) {
 
  mongoose.connect(uri).then(() => {
     console.log("Db connected successfully")
   }).catch((err) => console.log("db connection failed" + err) )

}