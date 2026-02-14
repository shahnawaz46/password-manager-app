import { createContext, useContext } from 'react';

// types/interface
import { IUpdateSessionArgs, IUser } from '@/types/user.interface';

export interface IAuthContext {
  isLoading: boolean;
  isAuthenticated: boolean | null;
  user: IUser | null;
  updateSession: (data: IUpdateSessionArgs) => Promise<void>;
  updateAuthUser: (data: IAuthContext['user']) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider'");
  }
  return context;
};
