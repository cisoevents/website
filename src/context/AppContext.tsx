import { createContext, useContext, useState, ReactNode } from 'react';
import { events as initialEvents } from '../data/mockData';
import type { CisoEvent, AppToast, AdminUser } from '../types';

interface AppContextValue {
  events: CisoEvent[];
  addEvent: (event: Omit<CisoEvent, 'id'>) => void;
  updateEvent: (id: number, data: Partial<CisoEvent>) => void;
  deleteEvent: (id: number) => void;
  toasts: AppToast[];
  addToast: (message: string, type?: AppToast['type']) => void;
  removeToast: (id: number) => void;
  adminUser: AdminUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  calendlyOpen: boolean;
  openCalendly: () => void;
  closeCalendly: () => void;
  registerOpen: boolean;
  openRegister: () => void;
  closeRegister: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<CisoEvent[]>(initialEvents as CisoEvent[]);
  const [toasts, setToasts] = useState<AppToast[]>([]);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [calendlyOpen, setCalendlyOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const openCalendly = () => setCalendlyOpen(true);
  const closeCalendly = () => setCalendlyOpen(false);
  const openRegister = () => setRegisterOpen(true);
  const closeRegister = () => setRegisterOpen(false);

  const addToast = (message: string, type: AppToast['type'] = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addEvent = (event: Omit<CisoEvent, 'id'>) => {
    const newEvent = { ...event, id: Date.now() } as CisoEvent;
    setEvents(prev => [...prev, newEvent]);
    addToast('Event created successfully!');
  };

  const updateEvent = (id: number, data: Partial<CisoEvent>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
    addToast('Event updated successfully!');
  };

  const deleteEvent = (id: number) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    addToast('Event deleted.', 'error');
  };

  const login = (username: string, password: string): boolean => {
    if (username === 'admin' && password === 'ciso2026') {
      setAdminUser({ username, role: 'admin' });
      return true;
    }
    return false;
  };

  const logout = () => setAdminUser(null);

  return (
    <AppContext.Provider value={{
      events, addEvent, updateEvent, deleteEvent,
      toasts, addToast, removeToast,
      adminUser, login, logout,
      calendlyOpen, openCalendly, closeCalendly,
      registerOpen, openRegister, closeRegister,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
