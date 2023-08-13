import { Request, Response } from "express";
// Local modules
import { User } from "../models/user-model";
import  redisClient, {AbstractUser}  from "../db/redis-connect"

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
        req.body.level = 1
        const user = new User(req.body);
        await user.save()
      } catch (err) {
        console.log(err);
        return res.sendStatus(500);
      }
    }
    try {
      // Update level and username of user
      let entity = await redisClient.get(id);
      let abstractUser : AbstractUser = JSON.parse(entity)
      if (!abstractUser.level || abstractUser.level < 1) {
        console.log('here')
        console.log(abstractUser)
        abstractUser.level = 1;
      }
      
      abstractUser.username = req.body.username 
      redisClient.set(id,JSON.stringify(abstractUser)).then((userEntity) => {
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
