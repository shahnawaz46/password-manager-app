import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {MenuProvider} from 'react-native-popup-menu';

// components
import Stack from './src/navigation/Stack';
import DataContextProvider from './src/context/DataContext';

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

const App = () => {
  return (
    <>
      <StatusBar />
      <DataContextProvider>
        <NavigationContainer theme={theme}>
          <MenuProvider>
            <Stack />
          </MenuProvider>
        </NavigationContainer>
      </DataContextProvider>
      <Toast />
    </>
  );
};

export default App;
