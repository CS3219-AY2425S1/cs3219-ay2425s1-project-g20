import { User } from "@common/shared-types";

const USER_KEY = "user";

const getUser = (): User | undefined => {
  const user = localStorage.getItem(USER_KEY);
  if (!user) return undefined;
  return JSON.parse(user);
};

const setUser = (user: User) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const userStorage = { getUser, setUser, removeUser };
