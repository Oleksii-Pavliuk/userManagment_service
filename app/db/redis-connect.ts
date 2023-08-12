import { createClient } from 'redis';
import { Repository } from 'redis-om'

import config from "../config/config";
import {abstractUserSchema} from "../models/redis-user-model"

const REDIS_STRING = config.get('redisstring')

const redis = createClient({url: REDIS_STRING})
// Create a Redis client
export const connectRedis = async () => {
    redis.on('error', err => console.log('Redis Client Error', err));
    redis.connect().then(() =>{
		console.log("Connected to the redis");}
        ).catch((err) => {
		    console.error("Error redis: ", err);
        })
};


export const usersRedisRepo = new Repository(abstractUserSchema, redis)
