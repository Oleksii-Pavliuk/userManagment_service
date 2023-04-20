import jwt from 'jsonwebtoken';

import config from "../config/config";
const ACCESS_TOKEN = config.get("jwtsecretkey")


// Middleware function to generate JWT token
export const generateAccessToken = (id: number) => {
    return jwt.sign({"id" : id}, ACCESS_TOKEN, { expiresIn: '2h' })
  }
  