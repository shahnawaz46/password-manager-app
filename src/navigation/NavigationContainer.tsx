import React, { useRef } from 'react';
import {
  DefaultTheme,
  NavigationContainer as RNNavigationContainer,
} from '@react-navigation/native';
import RootStack from './RootStack';
import { MenuProvider } from 'react-native-popup-menu';

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

const NavigationContainer = () => {
  return (
    <RNNavigationContainer theme={theme}>
      <MenuProvider>
        <RootStack />
      </MenuProvider>
    </RNNavigationContainer>
  );
};

export default NavigationContainer;
