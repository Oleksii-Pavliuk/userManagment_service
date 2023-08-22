import config from "../config/config"
import { NewFiatDepositEvent } from "../models/fiat-deposit";
import { dispatchEvent} from "../events/index"
import { Request, Response } from "express";




/* =================
   ROUTE HANDLER
================== */

export async function paymentIntent(req: Request, res: Response) {
  const id : string =  "1";//req.body.tokenUser;
  const currency : string = req.body.currency;
  const amount = req.body.amount;
  const quantity = req.body.quantity;


  const item = {
    currency: currency,
    unit_amount: amount,
    quantity: quantity
  }
  const clinetSecret = await dispatchEvent(new NewFiatDepositEvent(id,item))
  res.status(200).send(clinetSecret);
}






