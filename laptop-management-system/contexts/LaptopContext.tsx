"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { Laptop, Session, LaptopRequest, User } from '@/types';

interface LaptopContextType {
  user: User | null;
  sessions: Session[];
  rentalLaptops: Laptop[];
  ownedLaptops: Laptop[];
  requests: LaptopRequest[];
  login: (isAdmin: boolean, name?: string) => void;
  logout: () => void;
  addSession: (session: Omit<Session, 'id'>) => void;
  deleteSession: (id: string) => void;
  addLaptop: (type: 'rental' | 'owned', count: number) => void;
  deleteLaptop: (type: 'rental' | 'owned', id: number) => void;
  requestLaptops: (request: Omit<LaptopRequest, 'id' | 'status' | 'createdAt'>) => void;
  returnLaptops: (requestId: string) => void;
  approveRequest: (requestId: string) => void;
  changePassword: (newPassword: string) => void;
}

const LaptopContext = createContext<LaptopContextType | undefined>(undefined);

export const LaptopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [rentalLaptops, setRentalLaptops] = useState<Laptop[]>([]);
  const [ownedLaptops, setOwnedLaptops] = useState<Laptop[]>([]);
  const [requests, setRequests] = useState<LaptopRequest[]>([]);
  const [password, setPassword] = useState<string>('00000');

  // Load data from localStorage on component mount
  useEffect(() => {
    const loadedSessions = localStorage.getItem('sessions');
    const loadedRentalLaptops = localStorage.getItem('rentalLaptops');
    const loadedOwnedLaptops = localStorage.getItem('ownedLaptops');
    const loadedRequests = localStorage.getItem('requests');
    const loadedPassword = localStorage.getItem('adminPassword');
    
    if (loadedSessions) setSessions(JSON.parse(loadedSessions));
    if (loadedRentalLaptops) setRentalLaptops(JSON.parse(loadedRentalLaptops));
    if (loadedOwnedLaptops) setOwnedLaptops(JSON.parse(loadedOwnedLaptops));
    if (loadedRequests) setRequests(JSON.parse(loadedRequests));
    if (loadedPassword) setPassword(loadedPassword);
    
    // Initialize with default data if empty
    if (!loadedRentalLaptops) {
      const initialRentalLaptops = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        type: 'rental' as const,
        status: 'available' as const
      }));
      setRentalLaptops(initialRentalLaptops);
      localStorage.setItem('rentalLaptops', JSON.stringify(initialRentalLaptops));
    }
    
    if (!loadedOwnedLaptops) {
      const initialOwnedLaptops = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        type: 'owned' as const,
        status: 'available' as const
      }));
      setOwnedLaptops(initialOwnedLaptops);
      localStorage.setItem('ownedLaptops', JSON.stringify(initialOwnedLaptops));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('rentalLaptops', JSON.stringify(rentalLaptops));
  }, [rentalLaptops]);

  useEffect(() => {
    localStorage.setItem('ownedLaptops', JSON.stringify(ownedLaptops));
  }, [ownedLaptops]);

  useEffect(() => {
    localStorage.setItem('requests', JSON.stringify(requests));
  }, [requests]);

  const login = (isAdmin: boolean, name?: string) => {
    if (isAdmin) {
      setUser({
        id: 'admin',
        name: 'Administrator',
        role: 'admin'
      });
    } else if (name) {
      setUser({
        id: `intern-${Date.now()}`,
        name,
        role: 'intern'
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  const addSession = (sessionData: Omit<Session, 'id'>) => {
    const newSession = {
      ...sessionData,
      id: `session-${Date.now()}`
    };
    setSessions([...sessions, newSession]);
  };

  const deleteSession = (id: string) => {
    setSessions(sessions.filter(session => session.id !== id));
  };

  const addLaptop = (type: 'rental' | 'owned', count: number) => {
    if (type === 'rental') {
      const lastId = rentalLaptops.length > 0 ? Math.max(...rentalLaptops.map(laptop => laptop.id)) : 0;
      const newLaptops = Array.from({ length: count }, (_, i) => ({
        id: lastId + i + 1,
        type: 'rental' as const,
        status: 'available' as const
      }));
      setRentalLaptops([...rentalLaptops, ...newLaptops]);
    } else {
      const lastId = ownedLaptops.length > 0 ? Math.max(...ownedLaptops.map(laptop => laptop.id)) : 0;
      const newLaptops = Array.from({ length: count }, (_, i) => ({
        id: lastId + i + 1,
        type: 'owned' as const,
        status: 'available' as const
      }));
      setOwnedLaptops([...ownedLaptops, ...newLaptops]);
    }
  };

  const deleteLaptop = (type: 'rental' | 'owned', id: number) => {
    if (type === 'rental') {
      setRentalLaptops(rentalLaptops.filter(laptop => laptop.id !== id));
    } else {
      setOwnedLaptops(ownedLaptops.filter(laptop => laptop.id !== id));
    }
  };

  const requestLaptops = (requestData: Omit<LaptopRequest, 'id' | 'status' | 'createdAt'>) => {
    const newRequest: LaptopRequest = {
      ...requestData,
      id: `request-${Date.now()}`,
      status: 'requested',
      createdAt: new Date().toISOString()
    };
    
    setRequests([...requests, newRequest]);
    
    // Update laptop status to in-use
    if (requestData.laptopType === 'rental') {
      setRentalLaptops(prevLaptops => 
        prevLaptops.map(laptop => 
          requestData.laptopIds.includes(laptop.id) 
            ? { ...laptop, status: 'in-use' as const, assignedTo: newRequest } 
            : laptop
        )
      );
    } else {
      setOwnedLaptops(prevLaptops => 
        prevLaptops.map(laptop => 
          requestData.laptopIds.includes(laptop.id) 
            ? { ...laptop, status: 'in-use' as const, assignedTo: newRequest } 
            : laptop
        )
      );
    }
  };

  const returnLaptops = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    // Update request status
    setRequests(prevRequests => 
      prevRequests.map(r => 
        r.id === requestId 
          ? { ...r, status: 'returned' } 
          : r
      )
    );

    // Update laptop status back to available
    if (request.laptopType === 'rental') {
      setRentalLaptops(prevLaptops => 
        prevLaptops.map(laptop => 
          request.laptopIds.includes(laptop.id) 
            ? { ...laptop, status: 'available' as const, assignedTo: undefined } 
            : laptop
        )
      );
    } else {
      setOwnedLaptops(prevLaptops => 
        prevLaptops.map(laptop => 
          request.laptopIds.includes(laptop.id) 
            ? { ...laptop, status: 'available' as const, assignedTo: undefined } 
            : laptop
        )
      );
    }
  };

  const approveRequest = (requestId: string) => {
    setRequests(prevRequests => 
      prevRequests.map(r => 
        r.id === requestId 
          ? { ...r, status: 'approved' } 
          : r
      )
    );
  };

  const changePassword = (newPassword: string) => {
    setPassword(newPassword);
    localStorage.setItem('adminPassword', newPassword);
  };

  return (
    <LaptopContext.Provider value={{
      user,
      sessions,
      rentalLaptops,
      ownedLaptops,
      requests,
      login,
      logout,
      addSession,
      deleteSession,
      addLaptop,
      deleteLaptop,
      requestLaptops,
      returnLaptops,
      approveRequest,
      changePassword
    }}>
      {children}
    </LaptopContext.Provider>
  );
};

export const useLaptopContext = () => {
  const context = useContext(LaptopContext);
  if (context === undefined) {
    throw new Error('useLaptopContext must be used within a LaptopProvider');
  }
  return context;
};