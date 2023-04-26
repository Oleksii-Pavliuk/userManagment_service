import config from "../config/config"
import { NewFiatStripeDepositEvent } from "../events/fiat-deposit";
import { dispatchEvent} from "../events/index"
import { Request, Response } from "express";






export async function depositFiatStripe(req: Request, res: Response) {
    const id : string = req.body.tokenUser

    const lineItems = req.body.products.forEach((product : {name : string, quantity: number}) => {
        return {price_data: {
            currency: "usd",
            product_data: {
                name: product.name,
            },
            unit_amount: product.quantity * 0.1,
            },
            quantity: product.quantity,
          }
    });


    await dispatchEvent(new NewFiatStripeDepositEvent(id,lineItems))

}

