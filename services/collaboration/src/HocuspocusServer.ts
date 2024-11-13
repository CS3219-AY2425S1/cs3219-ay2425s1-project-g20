import { getDocument, storeDocument } from './controller/doc-controller'
import { closeRoom, verifyRoomOpen, verifyRoomUser } from './controller/room-controller'
import { verifyUser } from './utils/verifyToken'

async function createHocuspocusServer(port: number) {
  const { Server } = await import('@hocuspocus/server')
  const { Logger } = await import('@hocuspocus/extension-logger')
  const { Database } = await import('@hocuspocus/extension-database')

  const server = Server.configure({
    port: port,
    timeout: 30000,
    // debounce: 5000,
    // maxDebounce: 30000,
    // quiet: true,
    async onAuthenticate(data) {
      const { token, documentName } = data
      const user = await verifyUser(token)
      if (!user) {
        throw new Error('Not authorized!')
      }

      // Seems like normal request will pass through here
      if (!documentName) {
        return
      }
      const isRoomUser = await verifyRoomUser(user, documentName)
      if (!isRoomUser) {
        throw new Error('User is not part of the room')
      }

      const isRoomOpen = await verifyRoomOpen(documentName)
      if (!isRoomOpen) {
        console.log('Room is not open')
        data.connection.readOnly = true
      }

      return {
        user: {
          id: user.id,
          name: user.username,
        },
      }
    },
    async onDisconnect(payload) {
      if (payload.clientsCount <= 0) {
        closeRoom(payload)
      }
    },
    extensions: [
      new Logger({
        log: (message) => {
          // do something custom here
          console.log(message)
        },
      }),
      new Database({
        // Retrieve the document in firestore
        fetch: async ({ documentName }) => {
          return getDocument(documentName)
        },
        // Store the document in firestore
        store: async ({ documentName, state }) => {
          storeDocument(documentName, state)
        },
      }),
    ],
  })

  return server
}

export default createHocuspocusServer
