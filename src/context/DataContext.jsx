import React, {createContext, useContext, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DataContext = createContext();

export const tempPassword = [
  {
    id: 1,
    name: 'GitHub',
    userName:
      'shahnawaz123@gmail.comshahnawaz123@gmail.comshahnawaz123@gmail.com',
    password: 'GitHub123456',
    category: 'Browser',
  },
  {
    id: 2,
    name: 'Figmashahnawaz123456789000000000',
    userName: 'shahnawaz123@gmail.com',
    password: 'Figma123456',
    category: 'Browser',
  },
  {
    id: 3,
    name: 'Linkedin',
    userName: 'shahnawaz123@gmail.com',
    password: 'Linkedin123456',
    category: 'App',
  },
  {
    id: 4,
    name: 'GitHub',
    userName:
      'shahnawaz123@gmail.comshahnawaz123@gmail.comshahnawaz123@gmail.com',
    password: '123456',
    category: 'Browser',
  },
  {
    id: 5,
    name: 'Figmashahnawaz123456789000000000',
    userName: 'shahnawaz123@gmail.com',
    password: '123456',
    category: 'Browser',
  },
  {
    id: 6,
    name: 'Linkedin',
    userName: 'shahnawaz123@gmail.com',
    password: '123456',
    category: 'App',
  },
  {
    id: 7,
    name: 'GitHub',
    userName:
      'shahnawaz123@gmail.comshahnawaz123@gmail.comshahnawaz123@gmail.com',
    password: '123456',
    category: 'Browser',
  },
  {
    id: 8,
    name: 'Figmashahnawaz123456789000000000',
    userName: 'shahnawaz123@gmail.com',
    password: '123456',
    category: 'Browser',
  },
  {
    id: 9,
    name: 'Linkedin',
    userName: 'shahnawaz123@gmail.com',
    password: '123456',
    category: 'App',
  },
  {
    id: 10,
    name: 'GitHub',
    userName:
      'shahnawaz123@gmail.comshahnawaz123@gmail.comshahnawaz123@gmail.com',
    password: '123456',
    category: 'Browser',
  },
  {
    id: 11,
    name: 'Figmashahnawaz123456789000000000',
    userName: 'shahnawaz123@gmail.com',
    password: '123456',
    category: 'Browser',
  },
  {
    id: 12,
    name: 'Linkedin',
    userName: 'shahnawaz123@gmail.com',
    password: '123456',
    category: 'App',
  },
];

const passwordListInitialState = {
  all: {status: 'loading', data: [], error: null},
  app: {status: 'loading', data: [], error: null},
  browser: {status: 'loading', data: [], error: null},
  count: {all: 20, app: 8, browser: 12},
};

const authDetailsInitialState = {
  isLoggedIn: false,
  token: '',
  userDetails: {},
};

const DataContextProvider = ({children}) => {
  const [passwordList, setPasswordList] = useState(passwordListInitialState);
  const [authDetails, setAuthDetails] = useState(authDetailsInitialState);

  const fetchPassword = async type => {
    try {
      if (type === 'All') {
        setTimeout(() => {
          setPasswordList(prev => ({
            ...prev,
            all: {...prev.all, status: 'success', data: tempPassword},
          }));
        }, 3000);
      } else if (type === 'App') {
        setTimeout(() => {
          setPasswordList(prev => ({
            ...prev,
            app: {
              ...prev.app,
              status: 'success',
              data: tempPassword.filter(item => item.category === 'App'),
            },
          }));
        }, 3000);
      } else if (type === 'Browser') {
        setTimeout(() => {
          setPasswordList(prev => ({
            ...prev,
            browser: {
              ...prev.browser,
              status: 'success',
              data: tempPassword.filter(item => item.category === 'Browser'),
            },
          }));
        }, 3000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const logout = async () => {
    try {
      setPasswordList(passwordListInitialState);
      setAuthDetails(authDetailsInitialState);
      await AsyncStorage.removeItem('__ut_');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <DataContext.Provider
      value={{
        passwordList,
        authDetails,
        setAuthDetails,
        fetchPassword,
        logout,
      }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;

export const useDataContext = () => useContext(DataContext);
