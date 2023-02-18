import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'

import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'
import characterRoutes from './routes/character.routes'
import config from './config'

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(helmet())
app.use(cors({ origin: config.AUTHORIZED_ORIGIN, credentials: true }))

app.get('/', (req, res) => {
  res.json('Hello World')
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/characters', characterRoutes)

export default app
