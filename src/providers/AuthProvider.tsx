import { useEffect, useState } from 'react';
import * as Keychain from 'react-native-keychain';

// src
import { AuthContext } from '@/hooks/useAuthContext';
import axiosInstance from '@/axios/AxiosInstance';

// types/interface
import type { ReactNode } from 'react';
import type { IAuthContext } from '@/hooks/useAuthContext';

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] =
    useState<IAuthContext['isAuthenticated']>(null);
  const [user, setUser] = useState<IAuthContext['user']>(null);

  const userLogin = async (data: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.post('/user/login', data);

      const { _id: id, token } = res.data;
      // Keychain store username and password
      // so here username is id and password is token
      await Keychain.setGenericPassword(id, token);

      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getSession = async () => {
    try {
      setIsLoading(true);
      const isUserLoggedin = await Keychain.getGenericPassword();

      if (!isUserLoggedin) {
        setIsAuthenticated(false);
        return;
      }

      const res = await axiosInstance.get('/user/profile');
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      console.log('getUserDetails AuthProvider Error: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSession();
  }, []);

  return (
    <AuthContext value={{ isLoading, isAuthenticated, user, userLogin }}>
      {children}
    </AuthContext>
  );
};

export default AuthProvider;
