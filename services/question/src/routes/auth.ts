import { ExtractedUser, User, extractedUserSchema } from '@common/shared-types'
import axios, { AxiosResponse } from 'axios'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

/* [Main] */

async function verifyUser(token: string): Promise<ExtractedUser | null> {
  // Contact user service
  let verificationResponse: AxiosResponse = await axios.get('/auth/verify-token', {
    baseURL: process.env.USER_SERVICE_URL,
    headers: {
      Authorization: token,
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
}

/* [Exports] */

// Provides the verified user to subsequent middleware
export async function requireLogin(req: Request, res: Response, next: NextFunction) {
  let userToken = req.headers.authorization
  if (!userToken || !userToken.startsWith('Bearer ')) {
    res.status(StatusCodes.UNAUTHORIZED).send()
    return
  }

  let user: ExtractedUser | null = await verifyUser(userToken)
  if (user === null) {
    res.status(StatusCodes.UNAUTHORIZED)
    res.send()
    return
  }

  res.locals.user = user
  next()
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  let user: User = res.locals.user
  if (!user.isAdmin) {
    res.status(StatusCodes.FORBIDDEN)
    res.send()
    return
  }
  next()
}
