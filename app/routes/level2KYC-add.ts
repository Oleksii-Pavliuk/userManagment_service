import { Request, Response } from "express";
// Local modules
import {UserKYC} from "../models/userKYC-model"
import {User} from "../models/user-model"
import redisClient ,{AbstractUser} from "../db/redis-connect"
 
/* =================
   ROUTE HANDLER
================== */
export async function level2KYCadd(req : Request, res : Response) {
  let id = req.body.tokenUser;
  req.body.id = id;
  UserKYC.findOneAndUpdate({id: id}, req.body, { new: true }).then(async (user) => {
    // If not - create
    if (!user) {
      try {
        const userKYC = new UserKYC(req.body);
        await userKYC.save();
      } catch (err) {
        console.log(err);
        return res.sendStatus(500);
      }
    }
    try {
      // Update level of user
      await User.findOneAndUpdate({id:id},{level: 2});
      let entity = await redisClient.get(id);
      let abstractUser = JSON.parse(entity);
      console.log('userRedis');
      console.log(abstractUser);
      if (!abstractUser.level || abstractUser.level < 2){
        console.log('here');
        abstractUser.level = 2;
      } 
      if (!abstractUser.username) abstractUser.username = req.body.username;
      console.log('updatedUserRedis');
      console.log(abstractUser);
      redisClient.set(id, JSON.stringify(abstractUser)).then(() => {
        return res.sendStatus(205);
      }).catch((err) => {
        console.log(err);
        return res.sendStatus(500);
      })
    } catch (error) {
      console.log(error);
      return res.status(500).send("Error");
    }
  })
}

