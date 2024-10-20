import { configEnv } from '@common/utils'
configEnv()

import { Question } from "@common/shared-types"
import fs from 'fs/promises'
import { collection } from "../model/collection"
import logger from '../utils/logger'

const dataPath = './data/questions.json'

fs.readFile(dataPath, 'utf-8').then(
  (raw) => {
    try {
      const data = JSON.parse(raw) as Question[]
      Promise.all(data.map(async (question) => {
        await collection.add(question)
      }))
    } catch (error) {
      logger.error(error)
    }
  }
)
