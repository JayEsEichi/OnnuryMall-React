import axios from "axios";

// 온누리 DEV 서버 URL
const BASE_URL = "http://116.125.141.139:8091/";

// 토큰이 필요없는 API
const axiosApi = (url, options) => {
  const instance = axios.create({ baseURL: url, ...options });
  return instance;
};

// 토큰이 필요한 API
const axiosAuthApi = (url, options) => {
  const sessionStorage = window.sessionStorage;
  const localStorage = window.localStorage;

  const accessToken =
    sessionStorage.getItem("Authorization") != null
      ? sessionStorage.getItem("Authorization")
      : localStorage.getItem("Authorization");

  const refreshToken =
    sessionStorage.getItem("RefreshToken") != null
      ? sessionStorage.getItem("RefreshToken")
      : localStorage.getItem("RefreshToken");

  const AccessTokenExpireTime =
    sessionStorage.getItem("AccessTokenExpireTime") != null
      ? sessionStorage.getItem("AccessTokenExpireTime")
      : localStorage.getItem("AccessTokenExpireTime");

  const instance = axios.create({
    baseURL: url,
    headers: {
      Authorization: accessToken,
      RefreshToken: refreshToken,
      AccessTokenExpireTime: AccessTokenExpireTime,
    },
    ...options,
  });

  return instance;
};

export const defaultInstance = axiosApi(BASE_URL);
export const authInstance = axiosAuthApi(BASE_URL);
