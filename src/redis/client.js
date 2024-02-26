const redis = require("redis");
const {
  REDIS_HOST,
  REDIS_PORT,
  EXEC_ENV,
  REDIS_READER_HOST,
  REDIS_DEBUG_MODE,
} = require("../config");

const logs = (level, origin, message) =>
  console.log(`${level}-${origin}-${message}`);

// Schema to track the connection status of a Redis client
const redisClientSchema = { isConnected: false };

// Configuration for Redis clients
const redisClientConfig = {
  client: { host: REDIS_HOST, port: REDIS_PORT },
};

// Configuration for the Redis reader client
const redisReaderClientConfig = {
  common: { host: REDIS_READER_HOST, port: REDIS_PORT },
};

// Set Redis debug mode to false
redis.debug_mode = REDIS_DEBUG_MODE;

// Object to store instances of Redis clients
const redisClients = {
  client: redisClientSchema,
  user: redisClientSchema,
};

/**
 * Retry strategy for Redis connection attempts.
 *
 * @param {Object} options - Retry options provided by the Redis client.
 * @returns {number} The delay before the next connection attempt (in milliseconds).
 */
function redisConnectionRetryStrategy(options) {
  const { error, total_retry_time, attempt } = options;

  if (error && error.code === "ECONNREFUSED") {
    logs("info", "redisConnectionRetryStrategy", error.code);
  }

  if (total_retry_time > 1000 * 15) {
    // Retry time exhausted (15 seconds)
    logs("info", "redisConnectionRetryStrategy", "Retry time exhausted");
  }

  if (options.attempt > 10) {
    logs("info", "redisConnectionRetryStrategy", "10 attempts done");
  }

  logs("info", "redisConnectionRetryStrategy", "Attempting connection");

  // Reconnect after a delay, increasing with each attempt (up to a maximum of 3000 ms)
  return Math.min(attempt * 100, 3000);
}

/**
 * Creates a new Redis client based on the specified type and configuration.
 *
 * @param {string} type - The type of Redis client to create ('client' or 'user').
 * @param {boolean} isReader - Indicates whether the client is a reader client.
 * @param {string} readerType - The type of reader client if specified.
 * @returns {Promise<object>} A Promise that resolves to the created Redis client instance.
 */
function createRedisClientByType(
  type = "client",
  isReader = false,
  readerType = null
) {
  return new Promise((resolve, reject) => {
    logs("info", "[redis client creation]", `${EXEC_ENV} and ${type}`, true);

    const readerClientType = readerType || "common";
    const connectionConfig = isReader
      ? redisReaderClientConfig[readerClientType]
      : redisClientConfig[type];

    const client = redis.createClient({
      ...connectionConfig,
      retry_strategy: redisConnectionRetryStrategy,
    });

    // Event listener for connection errors
    client.on("error", (err) => {
      logs(
        "error",
        "createRedisClientByType",
        `Failed to connect to Redis, ${err}`
      );
      reject(err);
    });

    // Event listener for successful connection
    client.on("ready", () => resolve(client));
  });
}

/**
 * Retrieves a Redis client instance based on the specified type.
 *
 * @param {string} type - The type of Redis client to retrieve ('client' or 'user').
 * @param {boolean} isReader - Indicates whether the client is a reader client.
 * @returns {Promise<object>} A Promise that resolves to the Redis client instance.
 */
const getRedisClientByType = async (type = "client", isReader) => {
  const result = redisClients[type];
  if (result.isConnected) {
    return result;
  }

  // Create and store the Redis client instance
  redisClients[type] = await createRedisClientByType(type, isReader);
  return redisClients[type];
};

module.exports = { getRedisClientByType };
