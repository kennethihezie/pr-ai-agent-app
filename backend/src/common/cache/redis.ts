import { redisStore } from 'cache-manager-ioredis-yet';
import { config } from '../config/config';

export const redisConfig = async () => ({
    store: await redisStore({
      host: config.redis.host,
      port: config.redis.port,
    }),
})
