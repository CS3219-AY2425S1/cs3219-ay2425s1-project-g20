import { io } from "socket.io-client";
import { accessTokenStorage } from "../utils/accessTokenStorage";


export function initializeChatSocket() {
  const token = accessTokenStorage.getAccessToken();
  return io(import.meta.env.VITE_CHAT_SERVICE_WS_URL, {
    auth: {
      token,
    }
  })
}
