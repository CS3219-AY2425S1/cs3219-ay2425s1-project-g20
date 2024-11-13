import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// set GOOGLE_APPLICATION_CREDENTIALS to the path of the service account key
initializeApp({
  credential: applicationDefault(),
});

export const db = getFirestore().collection(
  process.env.COLLECTION_NAME || "users"
);
