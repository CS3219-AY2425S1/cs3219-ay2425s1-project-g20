import dotenv from 'dotenv'
if (process.env.NODE_ENV) {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
} else {
  dotenv.config({ path: '.env' })
}
import { Request, Response } from 'express'
import { db } from '../db/clients'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { SensitiveUser, loginFormSchema, ExtractedUser } from '../model'
import { jwtSecret } from '../utils/jwt-secret'

interface VerifyRequest extends Request {
  user?: ExtractedUser
}

export async function handleLogin(req: Request, res: Response) {
  try {
    const parsedRequest = loginFormSchema.safeParse(req.body)
    if (!parsedRequest.success) {
      return res.status(400).json({ message: 'Email and/or password are missing' })
    }
    const { data } = parsedRequest

    const userSnapshot = await db.where('email', '==', data.email).get()
    if (!userSnapshot || userSnapshot.empty) {
      return res.status(401).json({ message: 'Wrong email and/or password' })
    }

    const userDoc = userSnapshot.docs[0]
    const userData = userDoc.data() as SensitiveUser

    const match = await bcrypt.compare(data.password, userData.password)
    if (!match) {
      return res.status(401).json({ message: 'Wrong email and/or password' })
    }

    const accessToken = jwt.sign({ id: userDoc.id }, jwtSecret, {
      expiresIn: '1d',
    })

    const { password: _, ...userResponse } = userData

    return res.status(200).json({
      message: 'User logged in',
      data: {
        id: userDoc.id,
        accessToken,
        ...userResponse,
      },
    })
  } catch (err) {
    return res.status(500).json({ message: 'Unknown error when handling log in' })
  }
}

export async function handleVerifyToken(
  req: VerifyRequest,
  res: Response
): Promise<Response> {
  try {
    const verifiedUser = req.user
    return res.status(200).json({ message: 'Token verified', data: verifiedUser })
  } catch (err) {
    return res.status(500).json({ message: 'Unknown error when handling verify token' })
  }
}
