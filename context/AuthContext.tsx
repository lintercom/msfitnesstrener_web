
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<User | null>;
  logout: () => void;
  updateCredentials: (username: string, pass: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Helper to get stored credentials
  const getStoredCredentials = () => {
    const storedUser = localStorage.getItem('ms_admin_user');
    const storedPassHash = localStorage.getItem('ms_admin_pass'); // Simple base64 for obfuscation
    return {
      user: storedUser || 'admin',
      pass: storedPassHash ? atob(storedPassHash) : 'admin'
    };
  };

  const ADMIN_USER: User = {
    id: 'admin',
    name: 'Admin',
    email: getStoredCredentials().user,
    password: '', // Not stored in state for security
    isAdmin: true
  };

  useEffect(() => {
    // On app load, check session storage
    const loggedInUserId = sessionStorage.getItem('printcore-auth-userid');
    if (loggedInUserId === 'admin') {
      const credentials = getStoredCredentials();
      setCurrentUser({ ...ADMIN_USER, email: credentials.user });
    }
  }, []);

  const login = async (email: string, pass: string): Promise<User | null> => {
    const credentials = getStoredCredentials();

    if (email === credentials.user && pass === credentials.pass) {
      setCurrentUser({ ...ADMIN_USER, email: credentials.user });
      sessionStorage.setItem('printcore-auth-userid', 'admin');
      return { ...ADMIN_USER, email: credentials.user };
    }
    return null;
  };

  const updateCredentials = (username: string, pass: string) => {
    localStorage.setItem('ms_admin_user', username);
    localStorage.setItem('ms_admin_pass', btoa(pass));

    // Update current user state if logged in
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, email: username } : null);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('printcore-auth-userid');
  };

  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.isAdmin || false;

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      isAdmin,
      login,
      logout,
      updateCredentials
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
