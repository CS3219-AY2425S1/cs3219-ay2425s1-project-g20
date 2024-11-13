import {
  Attempt,
  ExtractedUser,
  UserMatchDoneData,
  UserRoomCreatedData,
} from '@common/shared-types';
import { getQuestion, pickQuestion } from '../api/question';
import { db } from '../db/clients';
import model from '../db/model';

/**
 * Create a room based on the user match done data. Called by matching service when match is done.
 * @param userMatchDoneData
 * @returns Promise of the created room data
 */
export async function createRoom(
  userMatchDoneData: UserMatchDoneData
): Promise<UserRoomCreatedData> {
  // Pick a question
  const question = await pickQuestion({
    difficulty: userMatchDoneData?.difficulty,
    topic: userMatchDoneData?.topic,
  })
  if (!question) {
    throw new Error('Error retrieving questions')
  }

  // Create a room
  //TODO the state managed in Firebase is not typed
  const response = await db.add({
    userMatchDoneData,
    questionId: question.id,
    isOpen: true,
    createdAt: Date.now()
  })
  if (!response) {
    throw new Error('Error creating room')
  }

  // Construct the room data with the question and users matched
  const newRoomData: UserRoomCreatedData = {
    id: response.id,
    question: question,
    userMatchDoneData,
    isOpen: true,
  }
  console.log('Room created successfully', newRoomData)
  return newRoomData
}

export async function getRoom(
  roomId: string,
  user: ExtractedUser
): Promise<UserRoomCreatedData> {
  const response = await db.doc(roomId).get()
  if (!response) {
    throw new Error('Error getting room')
  }

  const room = response.data()
  if (!room) {
    throw new Error('Room does not exist')
  }
  // Check if user part of the matched room
  if (!room.userMatchDoneData.userIds.includes(user.id)) {
    throw new Error('User is not part of the room')
  }

  const question = await getQuestion(room.questionId)
  if (!question) {
    throw new Error('Error retrieving question')
  }

  const userRoomCreatedData = {
    id: response.id,
    question: question,
    userMatchDoneData: room.userMatchDoneData,
    isOpen: room.isOpen,
  }
  console.log('Room fetched successfully:', userRoomCreatedData)
  return userRoomCreatedData
}

/**
 * To internally verify if the user is part of the room
 * @param user
 * @param roomId
 * @returns Promise of boolean
 */
export async function verifyRoomUser(
  user: ExtractedUser,
  roomId: string
): Promise<boolean> {
  const response = await db.doc(roomId).get()
  if (!response) {
    throw new Error('Error verifying room user')
  }

  const room = response.data()
  console.log('Room:', room)
  if (!room) {
    throw new Error('Room does not exist')
  }

  // Check if user part of the matched room
  if (!room.userMatchDoneData.userIds.includes(user.id)) {
    return false
  }
  return true
}

/**
 * To internally verify if the room is open
 * @param roomId
 * @returns Promise of boolean
 */
export async function verifyRoomOpen(roomId: string): Promise<boolean> {
  const response = await db.doc(roomId).get()
  if (!response) {
    throw new Error('Error verifying room user')
  }

  const room = response.data()
  if (!room) {
    throw new Error('Room does not exist')
  }

  if (!room.isOpen) {
    return false
  }
  return true
}

/**
 * Close the room
 * @param roomId
 */
export async function closeRoom(onDisconnectPayload: any) {
  const { Doc, Text } = await import('yjs')

  let yDoc: InstanceType<typeof Doc> = onDisconnectPayload.document
  let roomId: string = onDisconnectPayload.documentName

  let yText: InstanceType<typeof Text> = yDoc.getText("codemirror")
  let code: string = yText.toString()

  await db.doc(roomId).update({
    isOpen: false,
    code,
  })
  console.log('Room closed successfully')
}

async function getAttempts(userId: string): Promise<Attempt[]> {
  return model.getAttempts(userId);
}

let roomController = {
  getAttempts
};
export default roomController;
