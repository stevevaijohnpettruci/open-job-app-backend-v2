import redisClient from '../utils/redis.js';

async function getCached(key) {
  try {
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return null;
  } catch (err) {
    console.error('Cache get error:', err);
    return null;
  }
}

// Middleware to set cached data with 1 hour expiration
async function setCached(key, data, ttl = 3600) {
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(data));
  } catch (err) {
    console.error('Cache set error:', err);
  }
}

// Middleware to invalidate cache
async function invalidateCache(key) {
  try {
    await redisClient.del(key);
  } catch (err) {
    console.error('Cache invalidate error:', err);
  }
}

// Middleware to invalidate multiple cache keys
async function invalidateMultipleCache(keys) {
  try {
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (err) {
    console.error('Cache invalidate multiple error:', err);
  }
}

export { getCached, setCached, invalidateCache, invalidateMultipleCache };
