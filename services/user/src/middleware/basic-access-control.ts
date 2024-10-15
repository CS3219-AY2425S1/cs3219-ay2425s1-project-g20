import dotenv from 'dotenv'
if (process.env.NODE_ENV) {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
} else {
  dotenv.config({ path: '.env' })
}
import { Response, Request, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { db } from '../db/clients'
import { User, ExtractedUser } from '@common/shared-types'
import { jwtSecret } from '../utils/jwt-secret'

interface VerifyRequest extends Request {
  user?: ExtractedUser
}

export function verifyAccessToken(
  req: VerifyRequest,
  res: Response,
  next: NextFunction
): void | Response {
  const authHeader = req.headers['authorization']
  if (!authHeader) {
    return res.status(401).json({ message: 'Authentication failed' })
  }

  const token = authHeader.split(' ')[1]
  jwt.verify(token, jwtSecret, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Authentication failed' })
    }

    const user = decoded as JwtPayload & { id: string }
    const userDoc = await db.doc(user.id).get()
    if (!userDoc.exists) {
      return res.status(401).json({ message: 'Authentication failed' })
    }
    const userData = userDoc.data() as User
    req.user = {
      id: userDoc.id,
      username: userData.username,
      email: userData.email,
      isAdmin: userData.isAdmin,
    }

    next()
  })
}

export function verifyIsAdmin(req: VerifyRequest, res: Response, next: NextFunction) {
  if (req.user?.isAdmin) {
    next()
  } else {
    return res.status(403).json({ message: 'Not authorized to access this resource' })
  }
}

export function verifyIsOwnerOrAdmin(
  req: VerifyRequest,
  res: Response,
  next: NextFunction
) {
  if (req.user?.isAdmin) {
    return next()
  }

  const userIdFromReqParams = req.params.id
  const userIdFromToken = req.user?.id

  if (userIdFromReqParams === userIdFromToken) {
    return next()
  }

  return res.status(403).json({ message: 'Not authorized to access this resource' })
}
