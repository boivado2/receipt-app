import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import sharp from 'sharp'
import dotenv from 'dotenv'

dotenv.config({path: `.env.${process.env.NODE_ENV}`})

const accessKeyId = process.env.AWS_ACCESS_KEY!
const secretAccessKey = process.env.AWS_SECRETE_KEY!
const region = process.env.AWS_REGION
const Bucket = process.env.AWS_BUCKET_NAME!


const s3 = new S3Client({
  region: region,
  credentials: {accessKeyId, secretAccessKey}
})


type PutCommand = {
  Bucket: string
  Body: Buffer,
  Key: string,
  ContentType: string
}


export const postImageToS3 = async (data: any, imageName: string) => {
  try {
  
  const buffer = await sharp(data.buffer).resize(1280, 1280, {fit: 'cover'}).toBuffer()

  const putCommand : PutCommand = {
    Bucket,
    Body: buffer,
    Key: imageName,
    ContentType: data.mimetype
    }
    
  const command = new PutObjectCommand(putCommand)

  await s3.send(command)
  } catch (error) {
    return
  }
  
  
}


// type GetCommand = {
//   Bucket: string,
//   Key: string
// }

// export const getImageFromS3 = async (data: any) => {
//  try {
//   const getCommand : GetCommand = {
//     Bucket,
//     Key: data.logo
//   }

//   const command = new GetObjectCommand(getCommand)

//  data.logoUrl =  await getSignedUrl(s3, command, {expiresIn: 3600})
//  } catch (error) {
//    console.log(error)
//  }
  
// }



type DeleteParams = {
  Bucket: string,
  Key: string
}

export const deleteImageFromS3 = async (key: string) => {
  
  const deleteParams: DeleteParams = {
    Bucket,
    Key : key
  }

  const command = new DeleteObjectCommand(deleteParams)
  await s3.send(command)
  

}