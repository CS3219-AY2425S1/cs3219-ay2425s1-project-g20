import { initializeApp, applicationDefault } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

initializeApp({
  credential: applicationDefault(),
})

export const db = getFirestore().collection(
  process.env.COLLECTION_NAME || 'collaboration'
)
