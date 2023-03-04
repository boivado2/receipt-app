import { Request, Response, NextFunction } from "express";
import jsonwebtoken from 'jsonwebtoken'



export default (req: Request, res: Response, next: NextFunction) => {

  const token = req.header('x-auth-token')
  if (!token) return res.status(401).json({ error: "Access denied. no token provided" })

  try {
    const decode = jsonwebtoken.verify(token, process.env.jsonWebToken!)
    req.user = decode

    next()
  } catch (error) {
    return res.status(400).json({error: "invalid token"})
  }

}