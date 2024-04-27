import axios from 'axios';

const baseURL = 'http://192.168.1.14:9000/api';

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 60000,
});

export default axiosInstance;
