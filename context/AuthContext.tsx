'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'dg' | 'secretary' | 'com' | 'admin' | 'company';

export interface AuthUser {
  username: string;
  role: UserRole;
  name: string;
  companyId?: string; // For company users
}

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Company data
export interface Company {
  id: string;
  nif: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  contactPerson: string;
}

// Mock company data
export const mockCompanies: Company[] = [
  {
    id: '1',
    nif: '123456789',
    name: 'SEPCO',
    email: 'sepco@example.com',
    password: 'sepco123',
    phone: '+22212345678',
    contactPerson: 'أحمد السيد',
  },
];

// Valid accounts
const validAccounts: Record<string, { password: string; role: UserRole; name: string; companyId?: string }> = {
  dg: { password: 'dg', role: 'dg', name: 'المدير العام' },
  secretary: { password: 'secretary', role: 'secretary', name: 'السكرتيرة' },
  com: { password: 'com', role: 'com', name: 'إدارة المراسلات' },
  // Company accounts
  sepco: { password: 'sepco123', role: 'company', name: 'SEPCO', companyId: '1' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for stored user session
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          localStorage.removeItem('user');
        }
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Check regular accounts
    const account = validAccounts[username];
    if (account && account.password === password) {
      const authUser: AuthUser = {
        username,
        role: account.role,
        name: account.name,
        companyId: account.companyId,
      };
      setUser(authUser);
      localStorage.setItem('user', JSON.stringify(authUser));
      return true;
    }
    
    // Check company accounts by email
    const company = mockCompanies.find(c => 
      (c.email.toLowerCase() === username.toLowerCase() || c.name.toLowerCase() === username.toLowerCase()) && 
      c.password === password
    );
    if (company) {
      const authUser: AuthUser = {
        username: company.email,
        role: 'company',
        name: company.name,
        companyId: company.id,
      };
      setUser(authUser);
      localStorage.setItem('user', JSON.stringify(authUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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
