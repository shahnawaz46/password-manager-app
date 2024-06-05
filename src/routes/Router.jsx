import React, {useEffect, useState} from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {MenuProvider} from 'react-native-popup-menu';
import * as Keychain from 'react-native-keychain';

// components
import {useDataContext} from '../context/DataContext';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import Loading from '../components/Loading';
import axiosInstance from '../axios/AxiosInstance';

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
    authDetails: {isLoggedIn},
    setAuthDetails,
    fetchPassword,
  } = useDataContext();

  const [loading, setLoading] = useState(true);

  const getUserDetails = async () => {
    try {
      const isToken = await Keychain.getGenericPassword();
      if (isToken?.password) {
        const [res, _] = await Promise.all([
          axiosInstance.get('/user/profile'),
          fetchPassword('All'),
        ]);

        setAuthDetails({isLoggedIn: true, userDetails: res.data});
      }
    } catch (err) {
      console.log(err?.response?.data?.error || err?.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  if (loading) return <Loading />;

  return (
    <NavigationContainer theme={theme}>
      <MenuProvider>{isLoggedIn ? <AppStack /> : <AuthStack />}</MenuProvider>
    </NavigationContainer>
  );
};

export default Router;
