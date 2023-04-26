import { Request, Response } from "express";
// Local modules
import {usersRedisRepo} from "../db/redis-connect"
import { AbstractUser } from "../models/abstract-user-model";
import { level1KYCget } from "./level1KYC-get";

/* =================
   ROUTE HANDLER
================== */
export async function accountView(req : Request, res : Response) {
    const id : string = req.body.tokenUser
    let userEntity = await usersRedisRepo.fetch(id)
    if (!userEntity.id){
        level1KYCget(req,res)
    }else{
        let userAccount : AbstractUser = {
            id: userEntity.id as number,
            level: userEntity.level as 0 | 1 | 2,
            balance: userEntity.balance as number,
            ETH: userEntity.ETH as number,
            wallets: userEntity.wallets as string[]
        }
        res.status(200).send(userAccount)
    }
}


