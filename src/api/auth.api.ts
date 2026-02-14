import axiosInstance from './axiosInstance';

export const login = async (data: { email: string; password: string }) => {
  const res = await axiosInstance.post('/user/login', data);
  return res.data;
};

export const register = async (data: {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}) => {
  const res = await axiosInstance.post('/user/register', data);
  return res.data;
};

export const otpVerify = async (data: {
  otp: string;
  email: string;
  type: string;
}) => {
  const res = await axiosInstance.post('/user/otp-verify', data);
  return res.data;
};

export const resentOTP = async (data: { email: string; type: string }) => {
  const res = await axiosInstance.post('/user/resend-otp', data);
  return res.data;
};

export const updatePassword = async (data: {
  password: string;
  confirmPassword: string;
  email: string;
}) => {
  const res = await axiosInstance.post('/user/update-password', data);
  return res.data;
};
