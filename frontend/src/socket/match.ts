import { io, Socket } from "socket.io-client";
import { accessTokenStorage } from "../utils/accessTokenStorage";


export function initializeMatchSocket() {
  const token = accessTokenStorage.getAccessToken();
  return io(import.meta.env.VITE_MATCH_SERVICE_API_URL, {
    auth: {
      token,
    }
  })
}
