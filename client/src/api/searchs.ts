import axios from "axios";
import { createAxiosConfig } from "../axios/axios";

/*
 * Search endpoint
 *
 * @param {string} searchTerm
 * @param {string} token
 * 
 * @returns {Promise}
 */
export const search = async (search: {}, token: string) => {
  const axionsConfig = createAxiosConfig('POST', { 'auth-token': token },`${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/api/v1/searchs`, search );
  const response = await axios(axionsConfig);

  return response.data;
};

export const searchIntent = async (searchTerm, token) => {
  const axionsConfig = createAxiosConfig('POST', { 'auth-token': token },`${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/api/v1/searchs/intent`, { searchsearchTerm });
  const response = await axios(axionsConfig);

  return response.data;
};

/*
 * Get search history
 *
 * @param {string} token
 * 
 * @returns {Promise}
 */
export const getSearchHistory = async (token) => {
  const axionsConfig = createAxiosConfig('GET', { 'auth-token': token },`${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/api/v1/searchs/history`);
  const response = await axios(axionsConfig);

  return response.data;
};

