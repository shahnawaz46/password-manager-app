import React from 'react';
import {StatusBar} from 'react-native';
import Toast from 'react-native-toast-message';

// components
import DataContextProvider from './src/context/DataContext';
import Router from './src/routes/Router';

const App = () => {
  return (
    <>
      <StatusBar />
      <DataContextProvider>
        <Router />
      </DataContextProvider>
      <Toast />
    </>
  );
};

export default App;
