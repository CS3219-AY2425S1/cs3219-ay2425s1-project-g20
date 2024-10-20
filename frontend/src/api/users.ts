import { SensitiveUser, User } from "@common/shared-types";
import { accessTokenStorage } from "../utils/accessTokenStorage";
import { userStorage } from "../utils/userStorage";
import { createAuthAxiosInstance } from "./axios";

// for public routes
const usersAxios = createAuthAxiosInstance(import.meta.env.VITE_USER_SERVICE_API_URL);

const USER_API_URL = "/users";
const AUTH_API_URL = "/auth";

const loginUser = async (
  user: Omit<SensitiveUser, "isAdmin" | "username" | "createdAt">
) => {
  try {
    const response = await usersAxios.post(`${AUTH_API_URL}/login`, user);
    const { accessToken, ...userData } = response.data.data;
    accessTokenStorage.setAccessToken(accessToken);
    userStorage.setUser(userData);
    return userData as User;
  } catch (error) {
    console.error("Error logging in: ", error);
    throw error;
  }
};

const registerUser = async (
  user: Omit<SensitiveUser, "isAdmin" | "createdAt">
) => {
  try {
    const response = await usersAxios.post(USER_API_URL, user);
    const { accessToken, ...userData } = response.data.data;
    accessTokenStorage.setAccessToken(accessToken);
    userStorage.setUser(userData);
    return userData as User;
  } catch (error) {
    console.error("Error registering: ", error);
    throw error;
  }
};

const verifyToken = async () => {
  try {
    const response = await usersAxios.get(`${AUTH_API_URL}/verify-token`)
    return response.data.data as User
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const userClient = {
  loginUser,
  registerUser,
  verifyToken
};
