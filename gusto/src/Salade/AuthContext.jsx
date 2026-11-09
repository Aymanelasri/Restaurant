import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

function clearStaleAuthOnFreshSession() {
  const hasStarted = sessionStorage.getItem('gusto_session_started');
  if (hasStarted) return;

  sessionStorage.setItem('gusto_session_started', '1');
  ['token', 'auth_token', 'user', 'gustoUser'].forEach((key) => localStorage.removeItem(key));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('gustoUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('gustoUser');
  };

  // Clear stale auth that was saved in a previous browser session before hydrating the app.
  React.useEffect(() => {
    clearStaleAuthOnFreshSession();

    const savedUser = localStorage.getItem('gustoUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};