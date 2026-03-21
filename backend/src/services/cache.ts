import { redisConnection } from "../queue/connection";

export async function getJsonCache<T>(key: string): Promise<T | null> {
  const raw = await redisConnection.get(key);
  if (!raw) return null;
  return JSON.parse(raw) as T;
}

export async function setJsonCache(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  await redisConnection.set(key, JSON.stringify(value), "EX", ttlSeconds);
}

export async function deleteCacheByPrefix(prefix: string): Promise<void> {
  const keys = await redisConnection.keys(`${prefix}*`);
  if (keys.length === 0) return;
  await redisConnection.del(...keys);
}
