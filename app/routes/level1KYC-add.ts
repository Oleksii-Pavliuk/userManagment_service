import { Request, Response } from "express";
// Local modules
import { User } from "../models/user-model";
import {usersRedisRepo} from "../db/redis-connect";

/* =================
   ROUTE HANDLER
================== */
export async function level1KYCadd(req: Request, res: Response) {
	let id = req.body.tokenUser;
  req.body.id = id;
	User.findOneAndUpdate({id: id}, req.body, { new: true }).then(async (user) => {
    // If not - create
    if (!user) {
      try {
        const user = new User(req.body);
        await user.save()
      } catch (err) {
        console.log(err);
        return res.sendStatus(500);
      }
    }
    try {
      // Update level of user
      let abstractUser = await usersRedisRepo.search().where('id').equals(id).return.all();

      abstractUser = req.body;
      console.log(abstractUser)
      abstractUser[0].level = 1;
      usersRedisRepo.save(abstractUser[0]).then((userEntity) => {
        console.log(userEntity)
        return res.sendStatus(205);
      }).catch((err) => {
        console.log(err);
        return res.sendStatus(500);
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Error");
    };
  }).catch((error) => {
    console.log(error);
    return res.status(500).send("Error");
  });
}
