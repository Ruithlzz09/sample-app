const logs = (level, origin, message) =>
  console.log(`${level}-${origin}-${message}`);

const { getRedisClientByType } = require("./client");

/**
 * Retrieves data from Redis using the provided client and key.
 *
 * @param {object} client - The Redis client instance.
 * @param {string} key - The key to retrieve data from Redis.
 * @returns {Promise<string>} A Promise that resolves to the retrieved data.
 */
async function getFromRedis(client, key) {
  return new Promise((resolve, reject) => {
    client.get(key, (e, data) => {
      if (e) {
        reject(e);
      }
      resolve(data);
    });
  });
}

/**
 * Saves data to Redis using the provided client, key, data, and optional expiry time.
 *
 * @param {object} client - The Redis client instance.
 * @param {string} key - The key to save data to in Redis.
 * @param {string|object} data - The data to be saved in Redis.
 * @param {number} expiryInSeconds - Optional. Expiry time for the key in seconds.
 * @returns {Promise<string>} A Promise that resolves to 'Saved' upon successful save.
 */
async function saveToRedis(client, key, data, expiryInSeconds) {
  return new Promise((resolve, reject) => {
    if (expiryInSeconds) {
      client.setex(key, expiryInSeconds, data, function (e) {
        if (e) reject(e);
        resolve("Saved");
      });
    } else {
      client.set(key, data, function (e) {
        if (e) reject(e);
        resolve("Saved");
      });
    }
  });
}

/**
 * Sets a key-value pair in Redis.
 *
 * @param {string} key - The key to be set in Redis.
 * @param {string|object} payload - The value to be associated with the key.
 * @param {number} expiryInSeconds - Optional. Expiry time for the key in seconds.
 * @param {string} type - Optional. Type of Redis client (default is 'client').
 * @throws {Error} Throws an error if there is a failure in connecting to or saving to Redis.
 */
const setKeyValue = async (key, payload, expiryInSeconds, type = "client") => {
  try {
    const client = await getRedisClientByType(type, false);
    try {
      const body =
        typeof payload === "object" ? JSON.stringify(payload) : payload;
      logs(
        "info",
        "redis [setKeyValue]",
        `Saving data for [' + ${key} + ']`,
        true
      );
      await saveToRedis(client, key, body, expiryInSeconds);
    } catch (err) {
      const errorMessage = err.stack || err;
      logs("error", "redis [setKeyValue]", errorMessage);
    } finally {
      client.quit();
    }
  } catch (err) {
    logs(
      "error",
      "redis [setKeyValue]",
      `Failed to connect to Redis while saving to Redis, Error ${
        err.stack || err
      }`
    );
    throw err;
  }
};

/**
 * Retrieves the value associated with a key from Redis.
 *
 * @param {string} key - The key to retrieve from Redis.
 * @param {string} type - Optional. Type of Redis client (default is 'client').
 * @returns {Promise<string|object>} A Promise that resolves to the retrieved value.
 * @throws {Error} Throws an error if there is a failure in connecting to or retrieving from Redis.
 */
const getKeyValue = async (key, type = "client") => {
  try {
    const client = await getRedisClientByType(type);
    try {
      logs("info", "redis [getKeyValue]", `getting id from Redis ${key}`, true);
      const data = await getFromRedis(client, key);
      try {
        return JSON.parse(data);
      } catch (err) {
        return data;
      }
    } catch (err) {
      const errorMessage = err.stack || err;
      logs("error", "redis [getKeyValue]", `Error ${errorMessage}`);
    } finally {
      client.quit();
    }
  } catch (error) {
    logs(
      "error",
      "redis [getKeyValue]",
      `Failed to connect to Redis, Error ${error.stack || error}`
    );
    throw error;
  }
};

/**
 * Removes a key from Redis.
 *
 * @param {string} key - The key to be removed from Redis.
 * @param {string} type - Optional. Type of Redis client (default is 'client').
 * @throws {Error} Throws an error if there is a failure in connecting to or removing from Redis.
 */
const removeKey = async (key, type = "client") => {
  try {
    const client = await getRedisClientByType(type);
    try {
      logs("info", "redis [removeKey]", `removing key - ${key}`, true);
      await client.del(key);
    } catch (err) {
      const errorMessage = err.stack || err;
      logs("error", "redis [removeKey]", `Error ${errorMessage}`);
    } finally {
      client.quit();
    }
  } catch (error) {
    logs(
      "error",
      "redis [removeKey]",
      `Failed to connect to Redis, Error ${error.stack || error}`
    );
    throw error;
  }
};

// Export the functions for setting, getting, and removing keys in Redis
module.exports = {
  setKeyValue,
  getKeyValue,
  removeKey,
};
