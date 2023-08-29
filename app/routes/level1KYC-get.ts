import { Request, Response } from "express";
// Local modules
import {User} from "../models/user-model"

/* =================
   ROUTE HANDLER
================== */
export async function level1KYCget(req : Request, res : Response) {
	try {
		let id = req.body.tokenUser
		let user = await User.findOne({id: id})
		
		if (!user) return res.sendStatus(404)
		return res.status(200).send(user)
	} catch(error) {
		console.log(error);
		return res.status(500).send("Error");
	};
}