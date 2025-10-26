import { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import axios from 'axios';
import { getNotifications, markNotificationsAsRead } from '../api/notifications';

// --- TYPE DEFINITIONS (No changes needed here) ---
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'staff' | 'admin';
  token: string;
}

interface Notification {
  _id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

interface AuthContextType {
  user: User | null;
  notifications: Notification[];
  unreadCount: number;
  login: (userData: User) => void;
  logout: () => void;
  fetchNotifications: () => Promise<void>; // Changed to Promise<void> for clarity
  markAsRead: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- THE PROVIDER COMPONENT (Corrected) ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // --- LOGIC MOVED AND CORRECTED ---

  // 1. Define `fetchNotifications` first, so it can be used by other functions.
  // We wrap it in useCallback for performance optimization.
  const fetchNotifications = useCallback(async () => {
      try {
          const response = await getNotifications();
          setNotifications(response.data);
          const unread = response.data.filter((n: Notification) => !n.isRead).length;
          setUnreadCount(unread);
      } catch (error) {
          console.error("Failed to fetch notifications", error);
      }
  }, []);

  // 2. The main useEffect now correctly calls the defined function.
  useEffect(() => {
    const initializeAuth = async () => {
        const storedUser = localStorage.getItem('futofind_user');
        if (storedUser) {
            const userData: User = JSON.parse(storedUser);
            setUser(userData);
            axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
            await fetchNotifications(); // Now correctly calls the function
        }
    };
    initializeAuth();
  }, [fetchNotifications]);

  // 3. The `login` function is now correct.
  const login = (userData: User) => {
    localStorage.setItem('futofind_user', JSON.stringify(userData));
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    fetchNotifications(); // This also correctly calls the function
  };
  
  // 4. The `logout` and `markAsRead` functions are correct as they were.
  const logout = () => {
    localStorage.removeItem('futofind_user');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    setNotifications([]);
    setUnreadCount(0);
  };

  const markAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await markNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark notifications as read", error);
    }
  };

  // 5. The Provider `value` now includes all the required properties.
  return (
    <AuthContext.Provider value={{ 
        user, 
        login, 
        logout, 
        notifications, 
        unreadCount, 
        fetchNotifications, 
        markAsRead 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// The `useAuth` hook remains the same.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};