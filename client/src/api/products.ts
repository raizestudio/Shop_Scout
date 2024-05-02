import axios from "axios";
import { createAxiosConfig } from "../axios/axios";

export const fetchProducts = async (searchTerm, filter, topN, country, comparisonWebsites) => {
  const axionsConfig = createAxiosConfig('POST', `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/products`, { searchTerm, filter, topN, country, comparisonWebsites });
  const response = await axios(axionsConfig);

  return response.data;
};