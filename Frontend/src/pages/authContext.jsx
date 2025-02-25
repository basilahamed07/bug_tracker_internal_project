import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Read the session data (username and access_token) from sessionStorage
  const storedToken = sessionStorage.getItem('access_token');
  const storedUsername = sessionStorage.getItem('username');
  
  const [user, setUser] = useState(storedToken ? { username: storedUsername, access_token: storedToken } : null);

  const login = (userData) => {
    // Store user data and token in sessionStorage
    sessionStorage.setItem('access_token', userData.access_token);
    sessionStorage.setItem('username', userData.username);
    setUser(userData);
  };

  const logout = () => {
    // Remove session data on logout
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('username');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
