import { Request, Response } from "express";
// Local modules
import  redisClient, {AbstractUser}  from "../db/redis-connect"
import { level1KYCget } from "./level1KYC-get";

/* =================
   ROUTE HANDLER
================== */
export async function accountView(req : Request, res : Response) {
  const id : string = req.body.tokenUser
  try {
    let entity = await redisClient.get(id)
    if (!entity){
      level1KYCget(req,res)
    }else{
      let userEntity : AbstractUser = JSON.parse(entity);
      let userAccount : AbstractUser = {
          id: userEntity.id as number,
          username: userEntity.username as string,
          level: userEntity.level as 0 | 1 | 2,
          balance: userEntity.balance as number,
          ETH: userEntity.ETH as number,
          wallets: userEntity.wallets as string[]
      }
      res.status(200).send(userAccount)
    }
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
  
}


