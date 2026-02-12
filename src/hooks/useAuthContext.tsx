import { createContext, useContext } from 'react';

interface IUser {
  _id: string;
  email: string;
  fullName: string;
  profileImage: string;
}

export interface IAuthContext {
  isLoading: boolean;
  isAuthenticated: boolean | null;
  user: IUser | null;
  userLogin: (data: { email: string; password: string }) => Promise<void>;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider'");
  }
  return context;
};
