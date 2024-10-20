import dotenv from 'dotenv'
if (process.env.NODE_ENV) {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
} else {
  dotenv.config({ path: '.env' })
}
import { extractedUserSchema, ExtractedUser } from '@common/shared-types'
import axios, { AxiosResponse } from 'axios'
import { StatusCodes } from 'http-status-codes'
import logger from './logger'

export async function verifyUser(token: string): Promise<ExtractedUser | null> {
  try {
    let verificationResponse: AxiosResponse = await axios.get('/auth/verify-token', {
      baseURL: process.env.USER_SERVICE_URL,
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
    if (verificationResponse.status !== StatusCodes.OK) {
      return null
    }

    let jsonBody: any = verificationResponse.data // Expect object containing message, data
    let rawUser: unknown = jsonBody.data
    let extractedUser = extractedUserSchema.safeParse(rawUser)

    if (!extractedUser.success) {
      return null
    }
    return extractedUser.data
  } catch (error) {
    logger.error(`Error verifying user token: ${error}`)
    if (error instanceof Error) {
      logger.error(error.stack)
    }
    return null
  }
}
