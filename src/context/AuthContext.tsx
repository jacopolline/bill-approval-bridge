
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

type UserRole = 'company' | 'buyer' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = (email: string, password: string, role: UserRole) => {
    // Simple validation
    if (!email || !password || !role) {
      toast.error("Please fill in all fields");
      return;
    }

    // Mock authentication logic
    const mockUser: User = {
      id: role === 'company' ? 'comp-123' : 'buy-456',
      name: role === 'company' ? 'Demo Company' : 'Demo Buyer',
      email,
      role
    };

    setUser(mockUser);
    toast.success(`Welcome, ${mockUser.name}!`);
    
    // Redirect based on role
    if (role === 'company') {
      navigate('/company');
    } else {
      navigate('/buyer');
    }
  };

  const logout = () => {
    setUser(null);
    toast.info("You have been logged out");
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout,
      isAuthenticated: user !== null 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
