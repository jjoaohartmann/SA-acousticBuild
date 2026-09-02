import { useState } from 'react';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
  // Inicialização lazy: lê o usuário salvo uma única vez na criação do estado
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('acousticbuild_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('acousticbuild_user', JSON.stringify(userData));
    localStorage.setItem('acousticbuild_token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('acousticbuild_user');
    localStorage.removeItem('acousticbuild_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}