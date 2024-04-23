import React, {useEffect, useState} from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {MenuProvider} from 'react-native-popup-menu';
import AsyncStorage from '@react-native-async-storage/async-storage';

// components
import {useDataContext} from '../context/DataContext';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import Loading from '../components/Loading';

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
  } = useDataContext();

  const [loading, setLoading] = useState(true);

  const getUserDetails = async () => {
    try {
      const isToken = await AsyncStorage.getItem('__ut_');
      console.log(isToken);
      if (isToken) {
        // const res = await
        setAuthDetails({
          isLoggedIn: true,
          token: isToken,
          userDetails: {
            fullName: 'Mohammad Shahnawaz',
            email: 'shahanwaz@gamil.com',
            image: '',
          },
        });
      }
    } catch (err) {
      console.log(err);
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
