import React, {createContext, useContext, useState} from 'react';
import axiosInstance from '../api/AxiosInstance';
import * as Keychain from 'react-native-keychain';
import Toast from 'react-native-toast-message';

const DataContext = createContext();

export const tempPassword = [
  {
    id: 1,
    name: 'GitHub',
    userName:
      'shahnawaz123@gmail.comshahnawaz123@gmail.comshahnawaz123@gmail.com',
    password: 'GitHub123456',
    category: 'Browser',
  },
  {
    id: 2,
    name: 'Figmashahnawaz123456789000000000',
    userName: 'shahnawaz123@gmail.com',
    password: 'Figma123456',
    category: 'Browser',
  },
  {
    id: 3,
    name: 'Linkedin',
    userName: 'shahnawaz123@gmail.com',
    password: 'Linkedin123456',
    category: 'App',
  },
  {
    id: 4,
    name: 'GitHub',
    userName:
      'shahnawaz123@gmail.comshahnawaz123@gmail.comshahnawaz123@gmail.com',
    password: '123456',
    category: 'Browser',
  },
  {
    id: 5,
    name: 'Figmashahnawaz123456789000000000',
    userName: 'shahnawaz123@gmail.com',
    password: '123456',
    category: 'Browser',
  },
  {
    id: 6,
    name: 'Linkedin',
    userName: 'shahnawaz123@gmail.com',
    password: '123456',
    category: 'App',
  },
  {
    id: 7,
    name: 'GitHub',
    userName:
      'shahnawaz123@gmail.comshahnawaz123@gmail.comshahnawaz123@gmail.com',
    password: '123456',
    category: 'Browser',
  },
  {
    id: 8,
    name: 'Figmashahnawaz123456789000000000',
    userName: 'shahnawaz123@gmail.com',
    password: '123456',
    category: 'Browser',
  },
  {
    id: 9,
    name: 'Linkedin',
    userName: 'shahnawaz123@gmail.com',
    password: '123456',
    category: 'App',
  },
  {
    id: 10,
    name: 'GitHub',
    userName:
      'shahnawaz123@gmail.comshahnawaz123@gmail.comshahnawaz123@gmail.com',
    password: '123456',
    category: 'Browser',
  },
  {
    id: 11,
    name: 'Figmashahnawaz123456789000000000',
    userName: 'shahnawaz123@gmail.com',
    password: '123456',
    category: 'Browser',
  },
  {
    id: 12,
    name: 'Linkedin',
    userName: 'shahnawaz123@gmail.com',
    password: '123456',
    category: 'App',
  },
];

const passwordListInitialState = {
  all: {status: 'loading', data: [], error: null},
  app: {status: 'loading', data: [], error: null},
  browser: {status: 'loading', data: [], error: null},
  count: {all: 0, app: 0, browser: 0},
};

const authDetailsInitialState = {
  isLoggedIn: false,
  token: '',
  userDetails: {},
};

const DataContextProvider = ({children}) => {
  const [passwordList, setPasswordList] = useState(passwordListInitialState);
  const [authDetails, setAuthDetails] = useState(authDetailsInitialState);

  const fetchPassword = async type => {
    try {
      if (type === 'All') {
        const res = await axiosInstance.get('/password?category=All');
        setPasswordList(prev => ({
          ...prev,
          all: {...prev.all, status: 'success', data: res.data.password},
          count: res.data.count,
        }));
      } else if (type === 'App') {
        const res = await axiosInstance.get('/password?category=App');
        setPasswordList(prev => ({
          ...prev,
          app: {...prev.app, status: 'success', data: res.data.password},
        }));
      } else if (type === 'Browser') {
        const res = await axiosInstance.get('/password?category=Browser');
        console.log(res.data);
        setPasswordList(prev => ({
          ...prev,
          browser: {
            ...prev.browser,
            status: 'success',
            data: res.data.password,
          },
        }));
      }
    } catch (err) {
      if (err?.response?.data?.error === 'Authorization denied') {
        logout();
        return null;
      }

      Toast.show({
        type: 'error',
        text1: err?.response?.data?.error || err?.message,
      });
    }
  };

  const logout = async () => {
    try {
      setPasswordList(passwordListInitialState);
      setAuthDetails(authDetailsInitialState);
      await Keychain.resetGenericPassword();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <DataContext.Provider
      value={{
        passwordList,
        authDetails,
        setAuthDetails,
        fetchPassword,
        logout,
      }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;

export const useDataContext = () => useContext(DataContext);
