import React, { createContext, useContext, useState } from 'react';
import storageService from '../services/storageService';

const AuthContext = createContext();

export const AuthProvider = ({ children, onLoginSuccess, onLogoutSuccess }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const user = storageService.loadAuthUser();
    return user || {
      isLoggedIn: false,
      role: null, // 'artisan' | 'buyer' | 'admin'
      name: '',
      email: '',
      phone: '',
      avatar: '',
      clusterOrCompany: '',
      verifiedBadge: false
    };
  });

  const loginUser = (userData, customTarget = null) => {
    const user = {
      isLoggedIn: true,
      ...userData
    };
    setCurrentUser(user);
    storageService.saveAuthUser(user);

    if (onLoginSuccess) {
      onLoginSuccess(user, customTarget);
    }
  };

  const logoutUser = () => {
    const emptyUser = {
      isLoggedIn: false,
      role: null,
      name: '',
      email: '',
      phone: '',
      avatar: '',
      clusterOrCompany: '',
      verifiedBadge: false
    };
    setCurrentUser(emptyUser);
    storageService.clearAuthUser();

    if (onLogoutSuccess) {
      onLogoutSuccess();
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      loginUser,
      logoutUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
