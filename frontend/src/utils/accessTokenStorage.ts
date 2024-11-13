const TOKEN_KEY = "access_token";

const getAccessToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const setAccessToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

const removeAccessToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const accessTokenStorage = { getAccessToken, setAccessToken, removeAccessToken };
