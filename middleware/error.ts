import { ErrorRequestHandler, NextFunction, Request, Response } from "express";



const errorHandler: ErrorRequestHandler =  (error: any, req :Request, res: Response, next: NextFunction) => {
  // winston.error(err.message, err);

  console.log(error)
  // error
  // warn
  // info
  // verbose
  // debug 
  // silly
  res.status(500).send('Something failed.');
}


export default errorHandler