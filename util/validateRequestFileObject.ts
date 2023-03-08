import { Request, request } from 'express';

type FileObject = {
  fieldname: string,
  originalname: string,
  encoding: string,
  mimetype: string,
  buffer: Buffer,
  size: number
}

function validateRequestFileObject ( data: FileObject )  {

  const array_of_allowed_files = ['image/png', 'image/jpeg', 'image/jpg']
  const allowed_file_size = 2;
  let error: string | undefined

  if (!array_of_allowed_files.includes(data.mimetype!)) {
    error = 'file type not allowed'
  }else if((data.size! / (1024 * 1024)) > allowed_file_size) {
    error = "maximum file size allow should not be greater than 2mb"
  }

  return {
    error
  }


}


export default validateRequestFileObject