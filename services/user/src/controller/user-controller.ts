import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { Query } from 'firebase-admin/firestore'
import { db } from '../db/clients'
import {
  User,
  SensitiveUser,
  registerFormSchema,
  updatePrivilegeSchema,
} from '@common/shared-types'

export async function getAllUsers(req: Request, res: Response): Promise<Response> {
  try {
    const usersSnapshot = await db.get()
    const users = usersSnapshot.docs.map((doc) => {
      const userData = doc.data() as User
      return { id: doc.id, ...userData }
    })

    return res.status(200).json({ message: `Found users`, data: users })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Unknown error when getting all users!' })
  }
}

export async function getUser(req: Request, res: Response): Promise<Response> {
  try {
    const userId = req.params.id
    const userDoc = await db.doc(userId).get()

    if (!userDoc.exists) {
      return res.status(404).json({ message: `User ${userId} not found` })
    } else {
      const userData = userDoc.data() as User

      return res.status(200).json({
        message: `Found user`,
        data: { id: userDoc.id, ...userData },
      })
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Unknown error when getting user!' })
  }
}

export async function createUser(req: Request, res: Response): Promise<Response> {
  try {
    const parsedRequest = registerFormSchema.safeParse(req.body)
    if (!parsedRequest.success) {
      return res
        .status(400)
        .json({ message: 'username and/or email and/or password are missing' })
    }
    const { data } = parsedRequest

    const existingUser = await findUserByUsernameOrEmail(data.username, data.email)
    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already exists' })
    }

    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(data.password, salt)

    const createdUser: SensitiveUser = {
      username: data.username,
      email: data.email,
      password: hashedPassword,
      isAdmin: false,
      createdAt: new Date(),
    }

    const userDoc = await db.add(createdUser)

    const { password: _, ...userResponse } = createdUser

    return res.status(201).json({
      message: `Created new user ${data.username} successfully`,
      data: { id: userDoc.id, ...userResponse },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Unknown error when creating a user!' })
  }
}

export async function updateUser(req: Request, res: Response): Promise<Response> {
  try {
    const parsedRequest = registerFormSchema
      .partial()
      .refine(
        (val) =>
          Object.keys(val).map((key) => val[key as keyof typeof val] !== undefined),
        {
          message: 'Please provide at least one field',
        }
      )
      .safeParse(req.body)
    if (!parsedRequest.success) {
      return res.status(400).json({
        message: 'No field to update: username, email, and password are all missing!',
      })
    }
    const { data } = parsedRequest

    const userId = req.params.id

    const userDoc = await db.doc(userId).get()
    if (!userDoc.exists) {
      return res.status(404).json({ message: `User ${userId} not found` })
    }

    const userData = userDoc.data() as SensitiveUser
    if (data.username || data.email) {
      const existingUser = await findUserByUsernameOrEmail(data.username, data.email)
      if (existingUser && existingUser.id !== userId) {
        return res.status(409).json({ message: 'Username or email already exists' })
      }
    }

    let hashedPassword: string | undefined
    if (data.password) {
      const salt = bcrypt.genSaltSync(10)
      hashedPassword = bcrypt.hashSync(data.password, salt)
    }

    await db.doc(userId).update({
      username: data.username || userData.username,
      email: data.email || userData.email,
      password: hashedPassword || userData.password,
    })

    const updatedUserDoc = await db.doc(userId).get()
    const updatedUserData = updatedUserDoc.data() as User

    return res.status(200).json({
      message: `Updated data for user ${userId}`,
      data: { id: updatedUserDoc.id, ...updatedUserData },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Unknown error when updating user!' })
  }
}

export async function updateUserPrivilege(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const parsedRequest = updatePrivilegeSchema.safeParse(req.body)
    if (!parsedRequest.success) {
      return res.status(400).json({ message: 'isAdmin is missing!' })
    }
    const { data } = parsedRequest

    const userId = req.params.id

    const userDoc = await db.doc(userId).get()
    if (!userDoc.exists) {
      return res.status(404).json({ message: `User ${userId} not found` })
    }

    await db.doc(userId).update({ isAdmin: data.isAdmin })

    const updatedUserDoc = await db.doc(userId).get()
    const updatedUserData = updatedUserDoc.data() as User

    return res.status(200).json({
      message: `Updated privilege for user ${userId}`,
      data: { id: userDoc.id, ...updatedUserData },
    })
  } catch (err) {
    console.error(err)
    return res
      .status(500)
      .json({ message: 'Unknown error when updating user privilege!' })
  }
}

export async function deleteUser(req: Request, res: Response): Promise<Response> {
  try {
    const userId = req.params.id
    const userDoc = await db.doc(userId).get()
    if (!userDoc.exists) {
      return res.status(404).json({ message: `User ${userId} not found` })
    }

    await db.doc(userId).delete()
    return res.status(200).json({ message: `Deleted user ${userId} successfully` })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Unknown error when deleting user!' })
  }
}

async function findUserByUsernameOrEmail(
  username: string | undefined,
  email: string | undefined
) {
  let usernameQuery: Query = db
  let emailQuery: Query = db
  if (username) {
    usernameQuery = usernameQuery.where('username', '==', username)
    const usernameSnapshot = await usernameQuery.get()
    if (!usernameSnapshot.empty) {
      const userDoc = usernameSnapshot.docs[0]
      return { id: userDoc.id, ...(userDoc.data() as User) }
    }
  }
  if (email) {
    emailQuery = emailQuery.where('email', '==', email)

    const emailSnapshot = await emailQuery.get()

    if (!emailSnapshot.empty) {
      const userDoc = emailSnapshot.docs[0]
      return { id: userDoc.id, ...(userDoc.data() as User) }
    }
  }
  return null
}
