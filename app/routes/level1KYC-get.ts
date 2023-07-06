import { Request, Response } from "express";
// Local modules
import {User} from "../models/user-model"

/* =================
   ROUTE HANDLER
================== */
export async function level1KYCget(req : Request, res : Response) {
    let id = req.body.tokenUser
    User.find({id: id})
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


