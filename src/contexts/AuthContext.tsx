import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@cashback.com',
    name: 'Administrador',
    role: 'admin'
  },
  {
    id: '2', 
    email: 'user@cashback.com',
    name: 'Usuário',
    role: 'user'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is logged in on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('cashback_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('cashback_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock authentication delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Find user by email (mock validation)
    const foundUser = mockUsers.find(u => u.email === email);
    
    // Simple mock validation: password should be 'admin' for admin or 'user' for user
    const validPassword = (
      (email === 'admin@cashback.com' && password === 'admin') ||
      (email === 'user@cashback.com' && password === 'user')
    );

    if (foundUser && validPassword) {
      setUser(foundUser);
      localStorage.setItem('cashback_user', JSON.stringify(foundUser));
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo(a), ${foundUser.name}!`,
      });
      setIsLoading(false);
      return true;
    } else {
      toast({
        title: "Erro no login",
        description: "Email ou senha inválidos.",
        variant: "destructive"
      });
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cashback_user');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
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