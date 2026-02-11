import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { MenuProvider } from 'react-native-popup-menu';
import * as Keychain from 'react-native-keychain';

// components
import { useDataContext } from '../context/DataContext';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import Loading from '../components/Loading';
import axiosInstance from '../axios/AxiosInstance';
import { LOGIN_PROCESS } from '../utils/Constants';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF',
    primary: '#6FD09A',
    secondary: '#534FEE',
    // tertiary: '#534FEE',
    textPrimary: '#000000',
    textSecondary: '#D5D6FD',
  },
};

// exporting custom theme for use all over the app
export const useAppTheme = () => theme;

const Router = () => {
  const {
    authDetails: { isLoggedIn },
    setAuthDetails,
    setPasswordList,
  } = useDataContext();

  const [loading, setLoading] = useState(true);

  const getUserDetails = async () => {
    try {
      const isToken = await Keychain.getGenericPassword();
      if (isToken?.password) {
        const [profileRes, countRes] = await Promise.all([
          axiosInstance.get('/user/profile'),
          axiosInstance.get('/count'),
        ]);

        console.log('getUserDetails: ', profileRes, countRes);

        setAuthDetails({
          isLoggedIn: LOGIN_PROCESS.COMPLETE,
          userDetails: profileRes.data,
        });

        setPasswordList(prev => ({
          ...prev,
          count: countRes.data,
        }));
      }
    } catch (err) {
      console.log(err?.response?.data?.error || err?.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    // if isLoggedin value is 'COMPLETE' then it means i have already fetched the data so i am not calling getUserDetails() function again.
    isLoggedIn !== LOGIN_PROCESS.COMPLETE && getUserDetails();
  }, [isLoggedIn]);

  if (loading) return <Loading />;

  return (
    <NavigationContainer theme={theme}>
      <MenuProvider>
        {isLoggedIn === LOGIN_PROCESS.COMPLETE ? <AppStack /> : <AuthStack />}
      </MenuProvider>
    </NavigationContainer>
  );
};

export default Router;
