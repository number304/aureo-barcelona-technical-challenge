import { config } from "dotenv"

config()

export default {
  JWT_SECRET: process.env.JWT_SECRET,

  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DOMAIN: process.env.DB_DOMAIN,
  DB_PORT: process.env.DB_PORT,
  DB_AUTH_MECHANISM: process.env.DB_AUTH_MECHANISM
}