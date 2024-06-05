import React, {createContext, useContext, useState} from 'react';
import axiosInstance from '../axios/AxiosInstance';
import * as Keychain from 'react-native-keychain';
import Toast from 'react-native-toast-message';

// components
import {gettingData} from '../utils/EncDec';

const DataContext = createContext();

const passwordListInitialState = {
  all: {status: 'loading', data: [], error: null},
  app: {status: 'loading', data: [], error: null},
  browser: {status: 'loading', data: [], error: null},
  count: {all: 0, app: 0, browser: 0},
};

const authDetailsInitialState = {
  isLoggedIn: false,
  userDetails: {},
};

const DataContextProvider = ({children}) => {
  const [passwordList, setPasswordList] = useState(passwordListInitialState);
  const [authDetails, setAuthDetails] = useState(authDetailsInitialState);

  const fetchPassword = async type => {
    try {
      if (type === 'All') {
        const res = await axiosInstance.get('/password?category=All');
        const decryptedData = await gettingData(res.data.password);
        setPasswordList(prev => ({
          ...prev,
          all: {...prev.all, status: 'success', data: decryptedData},
          count: res.data.count,
        }));
      } else if (type === 'App') {
        const res = await axiosInstance.get('/password?category=App');
        const decryptedData = await gettingData(res.data.password);
        setPasswordList(prev => ({
          ...prev,
          app: {...prev.app, status: 'success', data: decryptedData},
        }));
      } else if (type === 'Browser') {
        const res = await axiosInstance.get('/password?category=Browser');
        const decryptedData = await gettingData(res.data.password);
        setPasswordList(prev => ({
          ...prev,
          browser: {
            ...prev.browser,
            status: 'success',
            data: decryptedData,
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
      Toast.show({
        type: 'error',
        text1: err?.response?.data?.error || err?.message,
        topOffset: 25,
      });
    }
  };

  return (
    <DataContext.Provider
      value={{
        passwordList,
        setPasswordList,
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
