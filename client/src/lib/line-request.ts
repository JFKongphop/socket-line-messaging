import { VITE_API_ENDPOINT } from '@/configs/enviroment';
import axios from 'axios';
import type { AxiosInstance } from 'axios';


const LineRequest: AxiosInstance = axios.create({
  baseURL: VITE_API_ENDPOINT,
});

const setInterceptor = (axiosInstance: AxiosInstance): AxiosInstance => {
  return axiosInstance;
};

setInterceptor(LineRequest);

export default LineRequest;