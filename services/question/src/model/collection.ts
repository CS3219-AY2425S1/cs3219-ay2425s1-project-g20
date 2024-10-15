import { applicationDefault, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// set GOOGLE_APPLICATION_CREDENTIALS to the path of the service account key
initializeApp({
  credential: applicationDefault(),
})

export const collection = getFirestore().collection(process.env.COLLECTION_NAME || 'questions')
