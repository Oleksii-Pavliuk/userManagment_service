import { Request, Response } from "express";
// Local modules
import {usersRedisRepo} from "../db/redis-connect"
import { AbstractUser } from "../models/redis-user-model";
import { level1KYCget } from "./level1KYC-get";

/* =================
   ROUTE HANDLER
================== */
export async function accountView(req : Request, res : Response) {
  const id : string = req.body.tokenUser
  try {
    let userEntity = await usersRedisRepo.search().where('id').equals(id).return.first();
    if (!userEntity.id){
      console.log(userEntity)
      console.log('going further')
      level1KYCget(req,res)
    }else{
      console.log(userEntity)
      let userAccount : AbstractUser = {
          id: userEntity.id as number,
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


