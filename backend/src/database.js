import mongoose from "mongoose"
import config from "./config"

mongoose.set('strictQuery', false)

const mongoURI = config.DB_DOMAIN === 'localhost' ?
  `mongodb://${config.DB_USER}:${config.DB_PASSWORD}@${config.DB_DOMAIN}:${config.DB_PORT}/`
  : `mongodb://${config.DB_USER}:${config.DB_PASSWORD}@${config.DB_DOMAIN}/`

mongoose.connect(`mongodb://${config.DB_USER}:${config.DB_PASSWORD}@${config.DB_DOMAIN}:${config.DB_PORT}/`, {
  authMechanism: config.DB_AUTH_MECHANISM,
  dbName: config.DB_NAME
})
  .then(db => console.log('db is connected'))
  .catch(err => console.error(err))
