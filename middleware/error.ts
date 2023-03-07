import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import logger from "../starter/logger";



const errorHandler: ErrorRequestHandler =  (error: any, req :Request, res: Response, next: NextFunction) => {
  // winston.error(err.message, err);

  logger.error(error)
  // error
  // warn
  // info
  // verbose
  // debug 
  // silly
  res.status(500).send('Something failed.');
}


export default errorHandler