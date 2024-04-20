import React, {useState} from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {MenuProvider} from 'react-native-popup-menu';

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
    data: {isLoggedIn},
  } = useDataContext();

  const [loading, setLoading] = useState(true);

  // if (loading) return <Loading />;

  return (
    <NavigationContainer theme={theme}>
      <MenuProvider>{isLoggedIn ? <AppStack /> : <AuthStack />}</MenuProvider>
    </NavigationContainer>
  );
};

export default Router;
