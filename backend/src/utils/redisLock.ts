import IORedis from "ioredis";

const redis = new IORedis(process.env.REDIS_URL || "redis://localhost:6379");

export const acquireLock = async (
  key: string,
  ttl = 30000,
): Promise<boolean> => {
  const result = await redis.set(key, "locked", "PX", ttl, "NX");
  return result === "OK";
};

export const releaseLock = async (key: string): Promise<void> => {
  await redis.del(key);
};

export default redis;
