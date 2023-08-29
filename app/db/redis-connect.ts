import { createClient } from 'redis';

import config from "../config/config";

export interface AbstractUser{
  id: number;
  username: string;
  level: 0 | 1 | 2;
  balance: number;
  ETH: number;
  wallets: string[];
}

const REDIS_STRING = config.get('redisstring')

const redisClient = createClient({url: REDIS_STRING})
// Create a Redis client
redisClient.on('error', err => console.log('Redis Client Error', err));
export const connectRedis = async () => {
  try {
    await redisClient.connect()
    console.log('Connceted to Redis')
  } catch(err) {
    console.error(err);
  }
}
export default redisClient