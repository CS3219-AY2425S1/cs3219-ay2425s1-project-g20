import { configEnv } from '@common/utils'
configEnv()

import cors from 'cors'
import express from 'express'
import router from './routes/routes'
import logger from './utils/logger'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(
  cors({
    origin: process.env.CORS_ORIGINS ? JSON.parse(process.env.CORS_ORIGINS) : '*',
  })
)

app.use('/questions', router)

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`)
})
