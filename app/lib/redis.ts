import Redis from "ioredis";

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = process.env.REDIS_PORT || "6379";

const redis = new Redis({
  host: REDIS_HOST,
  port: parseInt(REDIS_PORT),
});

export default redis;
