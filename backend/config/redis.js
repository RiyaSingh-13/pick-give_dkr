const redis = require('redis');

let redisClient = null;
global.isRedisConnected = false;

const connectRedis = async () => {
  const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

  try {
    redisClient = redis.createClient({ url: redisUrl });

    redisClient.on('error', (err) => {
      // Silently log and flag status instead of crashing Node process
      if (global.isRedisConnected) {
        console.log('⚠️ [Redis] Connection lost. Falling back to primary database.');
      }
      global.isRedisConnected = false;
    });

    redisClient.on('connect', () => {
      console.log('✅ [Redis] Connection handshake initialized.');
    });

    redisClient.on('ready', () => {
      console.log('🚀 [Redis] Connected successfully. Cache layer is active.');
      global.isRedisConnected = true;
    });

    await redisClient.connect();
  } catch (error) {
    console.log('⚠️ [Redis] Server not found/refused connection. Caching bypassed.');
    global.isRedisConnected = false;
  }
};

const getCache = async (key) => {
  if (!global.isRedisConnected || !redisClient) return null;
  try {
    return await redisClient.get(key);
  } catch (err) {
    console.error('Redis Get Error:', err);
    return null;
  }
};

const setCache = async (key, value, ttlSeconds = 60) => {
  if (!global.isRedisConnected || !redisClient) return;
  try {
    await redisClient.set(key, value, {
      EX: ttlSeconds
    });
  } catch (err) {
    console.error('Redis Set Error:', err);
  }
};

const clearCache = async (key) => {
  if (!global.isRedisConnected || !redisClient) return;
  try {
    await redisClient.del(key);
    console.log(`🧹 [Redis] Cache invalidated for key: "${key}"`);
  } catch (err) {
    console.error('Redis Del Error:', err);
  }
};

module.exports = {
  connectRedis,
  getCache,
  setCache,
  clearCache
};
