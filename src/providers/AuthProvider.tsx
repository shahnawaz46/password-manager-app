import { useEffect, useState } from 'react';
import * as Keychain from 'react-native-keychain';

// src
import { AuthContext } from '@/hooks/useAuthContext';
import axiosInstance from '@/api/axiosInstance';

// types/interface
import type { ReactNode } from 'react';
import type { IAuthContext } from '@/hooks/useAuthContext';
import type { IUpdateSessionArgs } from '@/types/user.interface';

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] =
    useState<IAuthContext['isAuthenticated']>(null);
  const [user, setUser] = useState<IAuthContext['user']>(null);

  const updateSession = async (data: IUpdateSessionArgs) => {
    const { token, ...rest } = data;
    // Keychain store username and password
    // so here username is _id and password is token
    await Keychain.setGenericPassword(rest._id, token);

    setUser(rest);
    setIsAuthenticated(true);
  };

  const updateAuthUser = (data: IAuthContext['user']) => {
    setUser(data);
  };

  const logout = async () => {
    setIsAuthenticated(false);
    await Keychain.resetGenericPassword();
    setUser(null);
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
    <AuthContext
      value={{
        isLoading,
        isAuthenticated,
        user,
        updateSession,
        updateAuthUser,
        logout,
      }}
    >
      {children}
    </AuthContext>
  );
};

export default AuthProvider;
