import { Request, Response } from "express";
// Local modules
import {UserKYC} from "../models/userKYC-model"

/* =================
   ROUTE HANDLER
================== */
export async function level2KYCget(req : Request, res : Response) {
    let id = req.body.tokenUser
    UserKYC.findById(id)
	    .then((user) => {
            if(!user){
                return res.sendStatus(404)
            }
            return res.status(200).send(user)
        })
                    .catch((error) => {
                        console.log(error);
                        return res.status(500).send("Error");
                    });
}


