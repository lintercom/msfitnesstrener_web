
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';
import emailjs from '@emailjs/browser';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<User | null>;
  logout: () => void;
  updateCredentials: (username: string, pass: string) => void;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
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

  const generateRandomPassword = (length: number = 12): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
    // Get EmailJS config from localStorage
    const storedData = localStorage.getItem('printcore-data');
    if (!storedData) {
      return { success: false, message: 'Konfigurace systému nebyla nalezena.' };
    }

    try {
      const data = JSON.parse(storedData);
      const emailConfig = data.integrations?.email;

      if (!emailConfig || !emailConfig.config.serviceId || !emailConfig.config.publicKey) {
        return { success: false, message: 'EmailJS není správně nakonfigurován.' };
      }

      const recoveryEmail = emailConfig.config.recoveryEmail;

      // Check if entered email matches stored recovery email
      if (email !== recoveryEmail) {
        return { success: false, message: 'Zadaný email neodpovídá registračnímu emailu pro obnovu.' };
      }

      if (!emailConfig.enabled) {
        return { success: false, message: 'Odesílání emailů je v systému deaktivováno.' };
      }

      // Generate new random password
      const newPassword = generateRandomPassword();

      // Check if reset template ID exists, otherwise use main template
      const templateId = emailConfig.config.resetTemplateId || emailConfig.config.templateId;

      // Send email with new password
      await emailjs.send(
        emailConfig.config.serviceId,
        templateId,
        {
          to_email: email,
          new_password: newPassword,
          title: 'Obnova hesla - Admin Hub'
        },
        emailConfig.config.publicKey
      );

      // Update stored password
      localStorage.setItem('ms_admin_pass', btoa(newPassword));

      return { success: true, message: 'Nové heslo bylo odesláno na váš email.' };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, message: 'Nepodařilo se odeslat email. Zkontrolujte konfiguraci EmailJS.' };
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
      updateCredentials,
      requestPasswordReset
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
