import axiosInstance from './axiosInstance';

export const updateUser = async (formData: FormData) => {
  const res = await axiosInstance.patch('/user/update-profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Required for FormData uploads
    },
  });

  return res.data;
};
