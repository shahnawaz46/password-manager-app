import { encrypt, gettingData } from '@/utils/EncDec';
import axiosInstance from './axiosInstance';

// types/interface
import type { IVaultItem } from '@/types/vault.interface';
import type { TCategories } from '@/types/vault.type';

export const vaultCount = async () => {
  const res = await axiosInstance.get('/count');
  return res.data;
};

export const getVaultItems = async ({ pageParam }: { pageParam: string }) => {
  const res = await axiosInstance.get(pageParam);

  let { next, password } = res.data;
  const decryptedData = await gettingData(password);

  return { next, password: decryptedData };
};

export const deleteVaultItem = async (id: string, category: TCategories) => {
  const res = await axiosInstance.delete('/password', { data: { id } });
  return { data: res.data, id, category };
};

export const addVaultItem = async (values: IVaultItem) => {
  // encrypting userName and password of vault
  const encrypted = await encrypt({
    userName: values.userName,
    password: values.password,
  });

  const newvalues = {
    data: encrypted,
    name: values.name,
    category: values.category,
  };

  const res = await axiosInstance.post('/password', newvalues);
  return { ...values, _id: res.data._id };
};

// during editing vault item, values contain _id
export const updateVaultItem = async (values: IVaultItem) => {
  // encrypting userName and password of vault
  const encrypted = await encrypt({
    userName: values.userName,
    password: values.password,
  });

  const newvalues = {
    data: encrypted,
    name: values.name,
    category: values.category,
    _id: values._id,
  };

  const res = await axiosInstance.patch('/password', newvalues);
  return res.data;
};
