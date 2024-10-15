import axios, { InternalAxiosRequestConfig } from "axios";
import { accessTokenStorage } from "../utils/accessTokenStorage";

export const createAuthAxiosInstance = (baseURL: string) => {
  const authAxios = axios.create({
    baseURL
  })

  authAxios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const accessToken = accessTokenStorage.getAccessToken()
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config
    }, (error) => {
      return Promise.reject(error);
    })

  return authAxios
}