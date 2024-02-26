require('dotenv').config()
const { env } = process

const config = {
  PORT: parseInt(env.PORT) || 8021,
  APP_NAME: env.APP_NAME || 'sample-app',
  EXEC_ENV: env.EXEC_ENV || 'dev'
}

module.exports = config
