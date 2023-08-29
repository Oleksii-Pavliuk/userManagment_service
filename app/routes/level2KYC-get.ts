import { Request, Response } from "express";
// Local modules
import {UserKYC} from "../models/userKYC-model"

/* =================
   ROUTE HANDLER
================== */
export async function level2KYCget(req : Request, res : Response) {
  
  try{
    let id = req.body.tokenUser;
    let user = await UserKYC.findOne({id: id})

    if(!user) return res.sendStatus(404)
    return res.status(200).send(user)
  }catch(error){
      console.error(error);
      return res.status(500).send("Error");
  };
}