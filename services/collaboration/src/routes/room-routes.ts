import {
  Attempt,
  ExtractedUser,
  userMatchDoneDataSchema,
  userRoomCreatedDataSchema
} from '@common/shared-types'
import { getApiKey } from '@common/utils'
import { NextFunction, Request, Response, Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import roomController, { createRoom, getRoom } from '../controller/room-controller'
import { verifyUser } from '../utils/verifyToken'

const router = Router()

async function requireLogin(req: Request, res: Response, next: NextFunction) {
  const userToken = req.headers.authorization
  if (!userToken || !userToken.startsWith('Bearer ')) {
    res.status(StatusCodes.UNAUTHORIZED).send()
    return
  }

  console.log('Verifying user token:', userToken)
  const user: ExtractedUser | null = await verifyUser(userToken.split('Bearer ')[1])
  if (user === null) {
    res.status(StatusCodes.UNAUTHORIZED).send()
    return
  }
  res.locals.user = user
  next()
}

async function requireApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers.authorization

  if (
    !apiKey ||
    (!apiKey.startsWith('Bearer ') && apiKey.split('Bearer ')[1] !== getApiKey())
  ) {
    res.status(StatusCodes.UNAUTHORIZED).send()
    return
  }
  next()
}

router.get('/:roomId', requireLogin, async (req: Request, res: Response) => {
  try {
    const roomId = req.params.roomId
    if (!roomId) {
      throw new Error('Room Id not found in request')
    }

    const roomData = await getRoom(roomId, res.locals.user)

    res.json(userRoomCreatedDataSchema.safeParse(roomData))
  } catch (err) {
    if (err instanceof Error && err.message.includes('User is not part of the room')) {
      res.status(StatusCodes.UNAUTHORIZED).json('User is not part of the room')
      return
    }

    console.error(err)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json('Error when getting room:\n' + err)
  }
})

router.post('/', requireApiKey, async (req: Request, res: Response) => {
  try {
    const userMatchDoneData = userMatchDoneDataSchema.safeParse(req.body).data
    if (!userMatchDoneData) {
      throw new Error('Invalid request body found when creating room')
    }

    const newRoomData = await createRoom(userMatchDoneData)

    res.json(userRoomCreatedDataSchema.safeParse(newRoomData))
  } catch (err) {
    console.error(err)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json("Error when creating room:\n' + err")
  }
})

// GET history for user with specified ID
router.get('/hist/:userId', requireApiKey, async (req: Request, res: Response) => {
  let userId: string = req.params.userId

  let attempts: Attempt[] = await roomController.getAttempts(userId);

  res.status(StatusCodes.OK)
  res.json(attempts)
})

export default router
