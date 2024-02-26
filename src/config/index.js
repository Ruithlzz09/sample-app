require('dotenv').config()
const { env } = process

const config = {
  PORT: parseInt(env.PORT) || 8021,
  APP_NAME: env.APP_NAME || 'sample-app',
  EXEC_ENV: env.EXEC_ENV || 'dev',
  REDIS_HOST: env.REDIS_HOST || 'localhost',
  REDIS_PORT: Number(env.REDIS_PORT || 6379),
  REDIS_READER_HOST: env.REDIS_HOST || 'localhost',
  REDIS_DEBUG_MODE: env.REDIS_DEBUG_MODE==='true',
}

module.exports = config
