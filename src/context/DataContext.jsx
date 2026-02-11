import React, { createContext, useContext, useState } from 'react';
import * as Keychain from 'react-native-keychain';
import Toast from 'react-native-toast-message';

// components
import axiosInstance from '../axios/AxiosInstance';
import { gettingData } from '../utils/EncDec';
import { API_STATUS, LOGIN_PROCESS } from '../utils/Constants';

const DataContext = createContext();

const passwordListInitialState = {
  all: { status: API_STATUS.LOADING, data: { vault: [] }, error: null },
  app: { status: API_STATUS.LOADING, data: { vault: [] }, error: null },
  browser: { status: API_STATUS.LOADING, data: { vault: [] }, error: null },
  count: { all: 0, app: 0, browser: 0 },
};

const authDetailsInitialState = {
  isLoggedIn: LOGIN_PROCESS.IDLE,
  userDetails: {},
};

const DataContextProvider = ({ children }) => {
  const [passwordList, setPasswordList] = useState(passwordListInitialState);
  const [authDetails, setAuthDetails] = useState(authDetailsInitialState);

  const fetchPassword = async (type, nextURL) => {
    try {
      if (type === 'All') {
        const res = await axiosInstance.get(
          nextURL || '/password?category=All',
        );
        const { next, password } = res.data;
        console.log('fetchPassword: ', next, password);
        const decryptedData = await gettingData(password);
        setPasswordList(prev => ({
          ...prev,
          all: {
            ...prev.all,
            status: API_STATUS.SUCCESS,
            data: { next, vault: [...prev.all.data.vault, ...decryptedData] },
          },
        }));
      } else if (type === 'App') {
        const res = await axiosInstance.get(
          nextURL || '/password?category=App',
        );
        const { next, password } = res.data;
        const decryptedData = await gettingData(password);
        setPasswordList(prev => ({
          ...prev,
          app: {
            ...prev.app,
            status: API_STATUS.SUCCESS,
            data: { next, vault: [...prev.app.data.vault, ...decryptedData] },
          },
        }));
      } else if (type === 'Browser') {
        const res = await axiosInstance.get(
          nextURL || '/password?category=Browser',
        );
        const { next, password } = res.data;
        const decryptedData = await gettingData(password);
        setPasswordList(prev => ({
          ...prev,
          browser: {
            ...prev.browser,
            status: API_STATUS.SUCCESS,
            data: {
              next,
              vault: [...prev.browser.data.vault, ...decryptedData],
            },
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
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;

export const useDataContext = () => useContext(DataContext);
