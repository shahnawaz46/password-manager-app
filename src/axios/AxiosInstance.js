import axios from 'axios';
import * as Keychain from 'react-native-keychain';

const baseURL = 'https://password-manager-app-server.onrender.com/api';

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 60000,
});

axiosInstance.interceptors.request.use(async function (config) {
  const isToken = await Keychain.getGenericPassword();
  config.headers.Authorization = isToken.password
    ? `Token ${isToken.password}`
    : '';
  return config;
});

export default axiosInstance;
