import { Request, Response, NextFunction } from "express";
import jwt, { VerifyErrors, VerifyOptions } from 'jsonwebtoken';
//Local modules

import config from "../config/config";

const ACCESS_TOKEN = config.get("jwtsecretkey")

export interface User{
  username:string,
  password: string,
  admin: boolean
}

// Middleware function to handle JWT authentication
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, ACCESS_TOKEN, (err: VerifyErrors | null, user: { id: number }) => {
      if (err) return res.sendStatus(403);
      req.body.tokenUser = user.id.toString();
      next();
    })
  }