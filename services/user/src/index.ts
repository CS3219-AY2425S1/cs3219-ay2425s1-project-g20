import cors from 'cors'
import dotenv from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'
import authRoutes from './routes/auth-routes'
import userRoutes from './routes/user-routes'
import logger from './utils/logger'
if (process.env.NODE_ENV) {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
} else {
  dotenv.config({ path: '.env' })
}

// Custom Error Interface to add status property
interface CustomError extends Error {
  status?: number
}

const app = express()
const port = process.env.PORT || 3002

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(
  cors({
    origin: process.env.CORS_ORIGINS ? JSON.parse(process.env.CORS_ORIGINS) : '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
  })
)

// Route handling
app.use('/users', userRoutes)
app.use('/auth', authRoutes)

// Handle when no route matches
app.use((req: Request, res: Response, next: NextFunction) => {
  const error: CustomError = new Error('Route Not Found')
  error.status = 404
  next(error)
})

// Error handling middleware
app.use((error: CustomError, req: Request, res: Response, next: NextFunction) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message,
    },
  })
})

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`)
})
