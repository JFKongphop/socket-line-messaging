import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { ACCESS_TOKEN } from '../environment';

const headers = {
  'Authorization': `Bearer ${ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
};

const LineRequest: AxiosInstance = axios.create({
  baseURL: 'https://api.line.me/v2/bot',
  headers,
});

const setInterceptor = (axiosInstance: AxiosInstance): AxiosInstance => {
  return axiosInstance;
};

setInterceptor(LineRequest);

export default LineRequest;