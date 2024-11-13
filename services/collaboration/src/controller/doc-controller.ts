import { db } from '../db/clients'

export async function getDocument(documentName: string): Promise<Uint8Array> {
  return new Promise(async (resolve, reject) => {
    const response = await db.doc(documentName).get()
    if (!response) {
      reject(response)
    }

    return resolve(response.data()?.data as Uint8Array)
  })
}

export async function storeDocument(
  documentName: string,
  state: Uint8Array
): Promise<void> {
  const response = await db.doc(documentName).set(
    {
      data: state,
    },
    { merge: true }
  )
}
