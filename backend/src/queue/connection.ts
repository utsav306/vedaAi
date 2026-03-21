import IORedis from "ioredis";
import { env } from "../config/env";

const redisUrl = new URL(env.REDIS_URL);

const baseRedisConfig = {
  host: redisUrl.hostname,
  port: Number(redisUrl.port || (redisUrl.protocol === "rediss:" ? 6380 : 6379)),
  username: redisUrl.username || undefined,
  password: redisUrl.password || undefined,
  tls: redisUrl.protocol === "rediss:" ? {} : undefined,
  maxRetriesPerRequest: null as null,
};

export const bullConnection = baseRedisConfig;

export const redisConnection = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});
