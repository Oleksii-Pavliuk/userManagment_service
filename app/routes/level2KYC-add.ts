import { Request, Response } from "express";
// Local modules
import {UserKYC} from "../models/userKYC-model"
import {usersRedisRepo} from "../db/redis-connect"
 
/* =================
   ROUTE HANDLER
================== */
export async function level2KYCadd(req : Request, res : Response) {
    let id = req.body.tokenUser
    UserKYC.findByIdAndUpdate(id, req.body, { new: true })
		.then(async (user) => {
            // If not - create
			if (!user) {
                const user = new UserKYC(req.body);
                user
                    .save()
                    .then(async () => {
                        // Update level of user
                        let abstractUser = await usersRedisRepo.fetch(id)
						abstractUser.level = 1
						usersRedisRepo.save(abstractUser).then(() => {
							return res.sendStatus(201);
						}).catch((err) => {
							console.log(err)
							return res.sendStatus(500)
						})
                    })
                    .catch((error) => {
                        console.log(error);
                        return res.status(500).send("Error");
                    });
			}
            // Update level of user
            let abstractUser = await usersRedisRepo.fetch(id)
            abstractUser.level = 1
            usersRedisRepo.save(abstractUser).then(() => {
                return res.sendStatus(205);
            }).catch((err) => {
                console.log(err)
                return res.sendStatus(500)
            })
		})
		.catch((error) => {
			console.log(error);
			return res.status(500).send("Error");
		});
}


