import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'

import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(helmet());

app.get('/', (req, res) => {
  res.json('Hello World')
})

app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)

export default app
