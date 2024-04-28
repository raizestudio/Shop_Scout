import axios from "axios";
import { createAxiosConfig } from "../axios/axios";

export const authenticate = async (username, password) => {
  const axionsConfig = createAxiosConfig('POST', {},`${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/api/v1/users/auth`, { username, password });
  const response = await axios(axionsConfig);

  return response.data;
};

export const identifyUserByToken = async (token) => {
  const axionsConfig = createAxiosConfig('POST', {"auth-token": token}, `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/api/v1/users/identify`, { token });
  const response = await axios(axionsConfig);

  return response.data;
};  

export const createAccount = async (email, username, password, firstName, lastName) => {
  const axionsConfig = createAxiosConfig('POST', {},`${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/api/v1/users/register`, { email, username, password, firstName, lastName});
  const response = await axios(axionsConfig);

  return response.data;
};

export const refreshToken = async (refreshToken, access) => {
  const axionsConfig = createAxiosConfig('POST', {'auth-token': access},`${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/api/v1/users/refresh`, { refreshToken });
  const response = await axios(axionsConfig);

  return response.data;
}