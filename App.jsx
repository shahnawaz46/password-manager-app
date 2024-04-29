import React from 'react';
import {StatusBar} from 'react-native';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';

// components
import DataContextProvider from './src/context/DataContext';
import Router from './src/routes/Router';

const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={{borderLeftColor: '#6FD09A', width: '90%'}}
      contentContainerStyle={{paddingHorizontal: 15}}
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
      style={{borderLeftColor: '#FF4C00', width: '90%'}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
      }}
      text1NumberOfLines={3}
    />
  ),
};

const App = () => {
  return (
    <>
      <StatusBar />
      <DataContextProvider>
        <Router />
      </DataContextProvider>
      <Toast config={toastConfig} />
    </>
  );
};

export default App;
