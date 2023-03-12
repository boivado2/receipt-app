import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import logger from "winston";



const errorHandler: ErrorRequestHandler =  (error: any, req :Request, res: Response, next: NextFunction) => {
  logger.error(error)

  res.status(500).send('Something failed.');
}


export default errorHandler