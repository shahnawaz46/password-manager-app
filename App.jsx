import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
// import SplashScreen from 'react-native-splash-screen';

// components
import DataContextProvider from './src/context/DataContext';
import SearchContextProvider from './src/context/SearchContext';
import NavigationContainer from '@/navigation/NavigationContainer';

const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#6FD09A', width: '90%' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
      }}
      text1NumberOfLines={3}
    />
  ),
  error: props => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: '#FF4C00', width: '90%' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
      }}
      text1NumberOfLines={3}
    />
  ),
};

const App = () => {
  // useEffect(() => {
  //   SplashScreen.hide();
  // }, []);

  return (
    <>
      <StatusBar />
      <DataContextProvider>
        <SearchContextProvider>
          <NavigationContainer />
        </SearchContextProvider>
        <Toast config={toastConfig} />
      </DataContextProvider>
    </>
  );
};

export default App;
