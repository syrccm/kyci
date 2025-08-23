"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { Laptop, Session, LaptopRequest, User, Manager, RegisteredUser } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface LaptopContextType {
  user: User | null;
  sessions: Session[];
  rentalLaptops: Laptop[];
  additionalLaptops: Laptop[];
  ownedLaptops: Laptop[];
  requests: LaptopRequest[];
  managers: Manager[];
  registeredUsers: RegisteredUser[];
  login: (isAdmin: boolean, isManager?: boolean, name?: string) => void;
  logout: () => void;
  addSession: (session: Omit<Session, 'id'>) => void;
  deleteSession: (id: string) => void;
  addLaptop: (type: 'rental' | 'additional' | 'owned', count: number) => void;
  deleteLaptop: (type: 'rental' | 'additional' | 'owned', id: number) => void;
  requestLaptops: (request: Omit<LaptopRequest, 'id' | 'status' | 'createdAt'>) => void;
  cancelRequest: (requestId: string) => void;
  returnRequestLaptops: (requestId: string) => void;
  completeReturnLaptops: (requestId: string, laptopId?: number) => void;
  completeLaptopCheckout: (requestId: string, laptopId?: number) => void;
  changePassword: (newPassword: string) => void;
  changeSitePassword: (newPassword: string) => void;
  addManager: (name: string, password: string) => void;
  removeManager: (id: string) => void;
  updateManagerPassword: (id: string, newPassword: string) => void;
  addRegisteredUser: (name: string) => void;
  removeRegisteredUser: (id: string) => void;
  resetAllData: () => void;
  cleanupOrphanedLaptops: () => void;
}

const LaptopContext = createContext<LaptopContextType | undefined>(undefined);

export const LaptopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [rentalLaptops, setRentalLaptops] = useState<Laptop[]>([]);
  const [additionalLaptops, setAdditionalLaptops] = useState<Laptop[]>([]);
  const [ownedLaptops, setOwnedLaptops] = useState<Laptop[]>([]);
  const [requests, setRequests] = useState<LaptopRequest[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [adminPassword, setAdminPassword] = useState<string>('3086');
  const [sitePassword, setSitePassword] = useState<string>('11111');

  // Load data from localStorage on component mount
  useEffect(() => {
    const loadedSessions = localStorage.getItem('sessions');
    const loadedRentalLaptops = localStorage.getItem('rentalLaptops');
    const loadedAdditionalLaptops = localStorage.getItem('additionalLaptops');
    const loadedOwnedLaptops = localStorage.getItem('ownedLaptops');
    const loadedRequests = localStorage.getItem('requests');
    const loadedManagers = localStorage.getItem('managers');
    const loadedRegisteredUsers = localStorage.getItem('registeredUsers');
    const loadedAdminPassword = localStorage.getItem('adminPassword');
    const loadedSitePassword = localStorage.getItem('sitePassword');
    
    if (loadedSessions) setSessions(JSON.parse(loadedSessions));
    if (loadedRentalLaptops) setRentalLaptops(JSON.parse(loadedRentalLaptops));
    if (loadedAdditionalLaptops) setAdditionalLaptops(JSON.parse(loadedAdditionalLaptops));
    if (loadedOwnedLaptops) setOwnedLaptops(JSON.parse(loadedOwnedLaptops));
    if (loadedRequests) setRequests(JSON.parse(loadedRequests));
    if (loadedManagers && JSON.parse(loadedManagers).length > 0) {
      // Check if managers have passwords, add them if not
      const parsedManagers = JSON.parse(loadedManagers);
      const updatedManagers = parsedManagers.map(manager => {
        if (!manager.password) {
          return { ...manager, password: '1234' }; // Default password
        }
        return manager;
      });
      setManagers(updatedManagers);
      localStorage.setItem('managers', JSON.stringify(updatedManagers));
    } else {
      // Initialize with a default manager if none exists
      const defaultManagers = [{ id: 'manager-default', name: '관리자1', password: '1234' }];
      setManagers(defaultManagers);
      localStorage.setItem('managers', JSON.stringify(defaultManagers));
    }
    
    // Load registered users or initialize with default examples
    if (loadedRegisteredUsers && JSON.parse(loadedRegisteredUsers).length > 0) {
      setRegisteredUsers(JSON.parse(loadedRegisteredUsers));
    } else {
      // Initialize with a default registered users if none exists
      const defaultRegisteredUsers = [
        { id: 'user-1', name: '이인턴' },
        { id: 'user-2', name: '김교육' },
        { id: 'user-3', name: '박상담' },
      ];
      setRegisteredUsers(defaultRegisteredUsers);
      localStorage.setItem('registeredUsers', JSON.stringify(defaultRegisteredUsers));
    }
    
    if (loadedAdminPassword) setAdminPassword(loadedAdminPassword);
    if (loadedSitePassword) setSitePassword(loadedSitePassword);
    
    // Set default passwords if not set
    if (!loadedAdminPassword) {
      localStorage.setItem('adminPassword', '3086');
    }
    if (!loadedSitePassword) {
      localStorage.setItem('sitePassword', '11111');
    }
    
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
    
    if (!loadedAdditionalLaptops) {
      const initialAdditionalLaptops = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        type: 'additional' as const,
        status: 'available' as const
      }));
      setAdditionalLaptops(initialAdditionalLaptops);
      localStorage.setItem('additionalLaptops', JSON.stringify(initialAdditionalLaptops));
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
    localStorage.setItem('additionalLaptops', JSON.stringify(additionalLaptops));
  }, [additionalLaptops]);

  useEffect(() => {
    localStorage.setItem('ownedLaptops', JSON.stringify(ownedLaptops));
  }, [ownedLaptops]);

  useEffect(() => {
    localStorage.setItem('requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('managers', JSON.stringify(managers));
  }, [managers]);

  useEffect(() => {
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const login = (isAdmin: boolean, isManager: boolean = false, name?: string) => {
    if (isAdmin) {
      setUser({
        id: 'admin',
        name: 'Administrator',
        role: 'admin'
      });
    } else if (isManager) {
      setUser({
        id: `manager-${Date.now()}`,
        name: name || 'Manager',
        role: 'manager'
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
    // Clear session authorization to force re-login
    sessionStorage.removeItem('siteAuthorized');
  };

  const addSession = (sessionData: Omit<Session, 'id'>) => {
    const newSession = {
      ...sessionData,
      id: `session-${Date.now()}-${sessionData.grade}-${sessionData.round}`
    };
    setSessions(prevSessions => [...prevSessions, newSession]);
    toast({
      title: "회차 추가 완료",
      description: `${sessionData.grade}급 ${sessionData.round}회차가 추가되었습니다.`,
    });
  };

  const deleteSession = (id: string) => {
    setSessions(sessions.filter(session => session.id !== id));
    toast({
      title: "회차 삭제 완료",
      description: "선택한 회차가 삭제되었습니다.",
    });
  };

  const addLaptop = (type: 'rental' | 'additional' | 'owned', count: number) => {
    if (type === 'rental') {
      const lastId = rentalLaptops.length > 0 ? Math.max(...rentalLaptops.map(laptop => laptop.id)) : 0;
      const newLaptops = Array.from({ length: count }, (_, i) => ({
        id: lastId + i + 1,
        type: 'rental' as const,
        status: 'available' as const
      }));
      setRentalLaptops([...rentalLaptops, ...newLaptops]);
    } else if (type === 'additional') {
      const lastId = additionalLaptops.length > 0 ? Math.max(...additionalLaptops.map(laptop => laptop.id)) : 0;
      const newLaptops = Array.from({ length: count }, (_, i) => ({
        id: lastId + i + 1,
        type: 'additional' as const,
        status: 'available' as const
      }));
      setAdditionalLaptops([...additionalLaptops, ...newLaptops]);
    } else {
      const lastId = ownedLaptops.length > 0 ? Math.max(...ownedLaptops.map(laptop => laptop.id)) : 0;
      const newLaptops = Array.from({ length: count }, (_, i) => ({
        id: lastId + i + 1,
        type: 'owned' as const,
        status: 'available' as const
      }));
      setOwnedLaptops([...ownedLaptops, ...newLaptops]);
    }
    toast({
      title: "노트북 추가 완료",
      description: `${type === 'rental' ? '랜탈' : type === 'additional' ? '추가' : '보유'} 노트북 ${count}대가 추가되었습니다.`,
    });
  };

  const deleteLaptop = (type: 'rental' | 'additional' | 'owned', id: number) => {
    if (type === 'rental') {
      setRentalLaptops(rentalLaptops.filter(laptop => laptop.id !== id));
    } else if (type === 'additional') {
      setAdditionalLaptops(additionalLaptops.filter(laptop => laptop.id !== id));
    } else {
      setOwnedLaptops(ownedLaptops.filter(laptop => laptop.id !== id));
    }
    toast({
      title: "노트북 삭제 완료",
      description: `${type === 'rental' ? '랜탈' : type === 'additional' ? '추가' : '보유'} 노트북 #${id}이(가) 삭제되었습니다.`,
    });
  };

  // New workflow: User requests laptop, but it stays in "requested" status
  const requestLaptops = (requestData: Omit<LaptopRequest, 'id' | 'status' | 'createdAt'>) => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    const newRequest: LaptopRequest = {
      ...requestData,
      id: `request-${timestamp}-${requestData.laptopType}-${randomId}`,
      status: 'requested',
      createdAt: new Date().toISOString()
    };
    
    console.log('Creating new request:', newRequest);
    
    // Use functional update to ensure we always get the latest state
    setRequests(prevRequests => {
      const updatedRequests = [...prevRequests, newRequest];
      console.log('Updated requests array:', updatedRequests);
      // Force immediate localStorage save
      localStorage.setItem('requests', JSON.stringify(updatedRequests));
      return updatedRequests;
    });
    
    // Update laptop status to requested (not in-use yet)
    if (requestData.laptopType === 'rental') {
      setRentalLaptops(prevLaptops => 
        prevLaptops.map(laptop => 
          requestData.laptopIds.includes(laptop.id) 
            ? { ...laptop, status: 'requested' as const, assignedTo: newRequest } 
            : laptop
        )
      );
    } else if (requestData.laptopType === 'additional') {
      setAdditionalLaptops(prevLaptops => 
        prevLaptops.map(laptop => 
          requestData.laptopIds.includes(laptop.id) 
            ? { ...laptop, status: 'requested' as const, assignedTo: newRequest } 
            : laptop
        )
      );
    } else {
      setOwnedLaptops(prevLaptops => 
        prevLaptops.map(laptop => 
          requestData.laptopIds.includes(laptop.id) 
            ? { ...laptop, status: 'requested' as const, assignedTo: newRequest } 
            : laptop
        )
      );
    }

    const laptopTypeText = 
      requestData.laptopType === 'rental' ? '랜탈' : 
      requestData.laptopType === 'additional' ? '추가' : '보유';
    
    toast({
      title: "노트북 사용신청 완료",
      description: `${laptopTypeText}노트북 ${requestData.laptopIds.length}대의 사용신청이 완료되었습니다. 관리자 승인 후 사용가능합니다.`,
    });
  };

  // Cancel a request and make laptops available again
  const cancelRequest = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) {
      toast({
        title: "오류 발생",
        description: "해당 요청을 찾을 수 없습니다.",
        variant: "destructive",
      });
      return;
    }

    // Remove the request
    setRequests(prevRequests => prevRequests.filter(r => r.id !== requestId));

    // Update laptop status back to available
    if (request.laptopType === 'rental') {
      setRentalLaptops(prevLaptops => 
        prevLaptops.map(laptop => 
          request.laptopIds.includes(laptop.id) 
            ? { ...laptop, status: 'available' as const, assignedTo: undefined } 
            : laptop
        )
      );
    } else if (request.laptopType === 'additional') {
      setAdditionalLaptops(prevLaptops => 
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

    const laptopTypeText = 
      request.laptopType === 'rental' ? '랜탈' : 
      request.laptopType === 'additional' ? '추가' : '보유';
    
    toast({
      title: "신청 취소 완료",
      description: `${request.userName}님의 ${laptopTypeText}노트북 ${request.laptopIds.length}대 신청이 취소되었습니다.`,
    });
  };

  // Manager approves individual laptop checkout
  const completeLaptopCheckout = (requestId: string, laptopId?: number) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    // If laptopId is provided, we're processing a single laptop
    if (laptopId !== undefined) {
      // For single laptop checkout
      console.log(`Processing individual checkout for laptop #${laptopId}`);
      
      // Update the laptop status
      if (request.laptopType === 'rental') {
        setRentalLaptops(prevLaptops => 
          prevLaptops.map(laptop => 
            laptop.id === laptopId 
              ? { ...laptop, status: 'in-use' as const, assignedTo: {...request, status: 'in-use'} } 
              : laptop
          )
        );
      } else if (request.laptopType === 'additional') {
        setAdditionalLaptops(prevLaptops => 
          prevLaptops.map(laptop => 
            laptop.id === laptopId 
              ? { ...laptop, status: 'in-use' as const, assignedTo: {...request, status: 'in-use'} } 
              : laptop
          )
        );
      } else {
        setOwnedLaptops(prevLaptops => 
          prevLaptops.map(laptop => 
            laptop.id === laptopId 
              ? { ...laptop, status: 'in-use' as const, assignedTo: {...request, status: 'in-use'} } 
              : laptop
          )
        );
      }
      
      // After updating this laptop, let's check if all laptops are now checked out
      // We need to check the current state of laptops after our update
      setTimeout(() => {
        // Get fresh copies of the laptop arrays
        let currentLaptops = [];
        if (request.laptopType === 'rental') {
          currentLaptops = JSON.parse(localStorage.getItem('rentalLaptops') || '[]');
        } else if (request.laptopType === 'additional') {
          currentLaptops = JSON.parse(localStorage.getItem('additionalLaptops') || '[]');
        } else {
          currentLaptops = JSON.parse(localStorage.getItem('ownedLaptops') || '[]');
        }
          
        // Find all laptops that are part of this request
        const requestLaptops = currentLaptops.filter(l => request.laptopIds.includes(l.id));
        
        // Check if all laptops in the request are now in use
        const allLaptopsCheckedOut = requestLaptops.every(l => l.status === 'in-use');
        console.log(`All laptops checked out: ${allLaptopsCheckedOut}`);
        
        // If all laptops are checked out, update the request status
        if (allLaptopsCheckedOut) {
          setRequests(prevRequests => 
            prevRequests.map(r => 
              r.id === requestId 
                ? { ...r, status: 'in-use' } 
                : r
            )
          );
        }
      }, 500); // Small delay to ensure state updates have been processed
      
      // For individual laptops, we don't wait to check if all are done
      const allLaptopsCheckedOut = false;
      
      // If all laptops are checked out, update the request status
      if (allLaptopsCheckedOut) {
        setRequests(prevRequests => 
          prevRequests.map(r => 
            r.id === requestId 
              ? { ...r, status: 'in-use' } 
              : r
          )
        );
      }
      
      const laptopTypeText = 
        request.laptopType === 'rental' ? '랜탈' : 
        request.laptopType === 'additional' ? '추가' : '보유';
      
      toast({
        title: "개별 노트북 출고 완료",
        description: `${request.userName}님에게 ${laptopTypeText}노트북 #${laptopId}이(가) 출고 완료되었습니다.`,
      });
    } else {
      // For complete request checkout (all laptops at once)
      // Update request status to in-use
      setRequests(prevRequests => 
        prevRequests.map(r => 
          r.id === requestId 
            ? { ...r, status: 'in-use' } 
            : r
        )
      );

      // Update laptop status to in-use
      if (request.laptopType === 'rental') {
        setRentalLaptops(prevLaptops => 
          prevLaptops.map(laptop => 
            request.laptopIds.includes(laptop.id) 
              ? { ...laptop, status: 'in-use' as const, assignedTo: {...request, status: 'in-use'} } 
              : laptop
          )
        );
      } else if (request.laptopType === 'additional') {
        setAdditionalLaptops(prevLaptops => 
          prevLaptops.map(laptop => 
            request.laptopIds.includes(laptop.id) 
              ? { ...laptop, status: 'in-use' as const, assignedTo: {...request, status: 'in-use'} } 
              : laptop
          )
        );
      } else {
        setOwnedLaptops(prevLaptops => 
          prevLaptops.map(laptop => 
            request.laptopIds.includes(laptop.id) 
              ? { ...laptop, status: 'in-use' as const, assignedTo: {...request, status: 'in-use'} } 
              : laptop
          )
        );
      }
      
      toast({
        title: "일괄 출고 완료",
        description: `${request.userName}님에게 ${request.laptopIds.length}대의 노트북이 일괄 출고 완료되었습니다.`,
      });
    }
  };

  // User requests to return laptops
  const returnRequestLaptops = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    // Update request status
    setRequests(prevRequests => 
      prevRequests.map(r => 
        r.id === requestId 
          ? { ...r, status: 'return-requested' } 
          : r
      )
    );

    // Update laptop status to return-requested
    if (request.laptopType === 'rental') {
      setRentalLaptops(prevLaptops => 
        prevLaptops.map(laptop => 
          request.laptopIds.includes(laptop.id) 
            ? { 
                ...laptop, 
                status: 'return-requested' as const, 
                assignedTo: {...request, status: 'return-requested'} 
              } 
            : laptop
        )
      );
    } else if (request.laptopType === 'additional') {
      setAdditionalLaptops(prevLaptops => 
        prevLaptops.map(laptop => 
          request.laptopIds.includes(laptop.id) 
            ? { 
                ...laptop, 
                status: 'return-requested' as const, 
                assignedTo: {...request, status: 'return-requested'} 
              } 
            : laptop
        )
      );
    } else {
      setOwnedLaptops(prevLaptops => 
        prevLaptops.map(laptop => 
          request.laptopIds.includes(laptop.id) 
            ? { 
                ...laptop, 
                status: 'return-requested' as const, 
                assignedTo: {...request, status: 'return-requested'} 
              } 
            : laptop
        )
      );
    }

    toast({
      title: "반납 신청 완료",
      description: `${request.laptopIds.length}대의 노트북 반납 신청이 완료되었습니다. 관리자가 입고 완료해야 반납 처리됩니다.`,
    });
  };

  // Manager completes laptop return
  const completeReturnLaptops = (requestId: string, laptopId?: number) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) {
      console.error("Request not found:", requestId);
      toast({
        title: "오류 발생",
        description: "해당 요청을 찾을 수 없습니다.",
        variant: "destructive",
      });
      return;
    }

    console.log("CompleteReturnLaptops called with:", { requestId, laptopId, laptopType: request.laptopType });

    // If laptopId is provided, we're processing a single laptop
    if (laptopId !== undefined) {
      console.log(`Processing individual return for laptop #${laptopId}, type: ${request.laptopType}`);
      
      // Create a separate variable for the processed laptop ID to avoid closure issues
      const processedLaptopId = laptopId;
      
      try {
        // Step 1: Update only this specific laptop
        if (request.laptopType === 'rental') {
          // Update rental laptop status
          setRentalLaptops(prevLaptops => {
            // Create a new array with the updated laptop
            const updatedLaptops = prevLaptops.map(laptop => {
              if (laptop.id === processedLaptopId) {
                console.log(`Found rental laptop #${laptop.id} to return`);
                return { ...laptop, status: 'available' as const, assignedTo: undefined };
              }
              return laptop;
            });
            
            // Save immediately to localStorage
            localStorage.setItem('rentalLaptops', JSON.stringify(updatedLaptops));
            return updatedLaptops;
          });
        } else if (request.laptopType === 'additional') {
          // Update additional laptop status
          setAdditionalLaptops(prevLaptops => {
            // Create a new array with the updated laptop
            const updatedLaptops = prevLaptops.map(laptop => {
              if (laptop.id === processedLaptopId) {
                console.log(`Found additional laptop #${laptop.id} to return`);
                return { ...laptop, status: 'available' as const, assignedTo: undefined };
              }
              return laptop;
            });
            
            // Save immediately to localStorage
            localStorage.setItem('additionalLaptops', JSON.stringify(updatedLaptops));
            return updatedLaptops;
          });
        } else {
          // Update owned laptop status
          setOwnedLaptops(prevLaptops => {
            // Create a new array with the updated laptop
            const updatedLaptops = prevLaptops.map(laptop => {
              if (laptop.id === processedLaptopId) {
                console.log(`Found owned laptop #${laptop.id} to return`);
                return { ...laptop, status: 'available' as const, assignedTo: undefined };
              }
              return laptop;
            });
            
            // Save immediately to localStorage
            localStorage.setItem('ownedLaptops', JSON.stringify(updatedLaptops));
            return updatedLaptops;
          });
        }

        // Step 2: Check if this was the last laptop to be returned
        // We'll do this by manually checking current status after the update
        let currentLaptops = [];
        if (request.laptopType === 'rental') {
          currentLaptops = JSON.parse(localStorage.getItem('rentalLaptops') || '[]');
        } else if (request.laptopType === 'additional') {
          currentLaptops = JSON.parse(localStorage.getItem('additionalLaptops') || '[]');
        } else {
          currentLaptops = JSON.parse(localStorage.getItem('ownedLaptops') || '[]');
        }
        
        // Get all laptops for this request except the one we just processed
        const otherLaptopsInRequest = request.laptopIds.filter(id => id !== processedLaptopId);
        
        // Check if all other laptops are already available
        const allOthersAvailable = otherLaptopsInRequest.length === 0 || 
          otherLaptopsInRequest.every(id => {
            const laptop = currentLaptops.find(l => l.id === id);
            return laptop && laptop.status === 'available';
          });
        
        console.log(`Processed laptop #${processedLaptopId}, other laptops all available: ${allOthersAvailable}`);
        
        // If this was the last laptop or all others are available, update the request status
        if (allOthersAvailable) {
          console.log("This was the last laptop - updating request status to returned");
          setRequests(prevRequests => {
            const updatedRequests = prevRequests.map(r => 
              r.id === requestId ? { ...r, status: 'returned' } : r
            );
            localStorage.setItem('requests', JSON.stringify(updatedRequests));
            return updatedRequests;
          });
        }
        
        // Get the laptop type text for the toast message
        const laptopTypeText = 
          request.laptopType === 'rental' ? '랜탈' : 
          request.laptopType === 'additional' ? '추가' : '보유';
        
        toast({
          title: "개별 노트북 입고 완료",
          description: `${request.userName}님의 ${laptopTypeText}노트북 #${processedLaptopId}이(가) 입고 완료되었습니다.`,
        });
        
      } catch (error) {
        console.error("Error processing individual laptop return:", error);
        toast({
          title: "오류 발생",
          description: "노트북 반납 처리 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    } else {
      // For complete request return (all laptops at once)
      console.log("Processing bulk return for all laptops");
      try {
        // Update request status to returned first
        setRequests(prevRequests => {
          const updatedRequests = prevRequests.map(r => 
            r.id === requestId ? { ...r, status: 'returned' } : r
          );
          localStorage.setItem('requests', JSON.stringify(updatedRequests));
          return updatedRequests;
        });
  
        // Then update all laptop statuses
        if (request.laptopType === 'rental') {
          setRentalLaptops(prevLaptops => {
            const updatedLaptops = prevLaptops.map(laptop => 
              request.laptopIds.includes(laptop.id) 
                ? { ...laptop, status: 'available' as const, assignedTo: undefined } 
                : laptop
            );
            localStorage.setItem('rentalLaptops', JSON.stringify(updatedLaptops));
            return updatedLaptops;
          });
        } else if (request.laptopType === 'additional') {
          setAdditionalLaptops(prevLaptops => {
            const updatedLaptops = prevLaptops.map(laptop => 
              request.laptopIds.includes(laptop.id) 
                ? { ...laptop, status: 'available' as const, assignedTo: undefined } 
                : laptop
            );
            localStorage.setItem('additionalLaptops', JSON.stringify(updatedLaptops));
            return updatedLaptops;
          });
        } else {
          setOwnedLaptops(prevLaptops => {
            const updatedLaptops = prevLaptops.map(laptop => 
              request.laptopIds.includes(laptop.id) 
                ? { ...laptop, status: 'available' as const, assignedTo: undefined } 
                : laptop
            );
            localStorage.setItem('ownedLaptops', JSON.stringify(updatedLaptops));
            return updatedLaptops;
          });
        }
  
        toast({
          title: "일괄 입고 완료",
          description: `${request.userName}님의 노트북 ${request.laptopIds.length}대가 일괄 입고 완료되었습니다.`,
        });
      } catch (error) {
        console.error("Error processing bulk laptop return:", error);
        toast({
          title: "오류 발생",
          description: "노트북 일괄 반납 처리 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    }
  };

  const changePassword = (newPassword: string) => {
    setAdminPassword(newPassword);
    localStorage.setItem('adminPassword', newPassword);
    toast({
      title: "비밀번호 변경 완료",
      description: "관리자 비밀번호가 변경되었습니다.",
    });
  };

  const changeSitePassword = (newPassword: string) => {
    setSitePassword(newPassword);
    localStorage.setItem('sitePassword', newPassword);
    toast({
      title: "비밀번호 변경 완료",
      description: "사이트 비밀번호가 변경되었습니다.",
    });
  };

  const addManager = (name: string, password: string) => {
    const newManager: Manager = {
      id: `manager-${Date.now()}`,
      name,
      password
    };
    setManagers([...managers, newManager]);
    toast({
      title: "관리자 추가 완료",
      description: `${name}님이 관리자로 추가되었습니다.`,
    });
  };

  const removeManager = (id: string) => {
    setManagers(managers.filter(manager => manager.id !== id));
    toast({
      title: "관리자 제거 완료",
      description: "관리자가 제거되었습니다.",
    });
  };

  const updateManagerPassword = (id: string, newPassword: string) => {
    setManagers(prevManagers => 
      prevManagers.map(manager => 
        manager.id === id 
          ? { ...manager, password: newPassword }
          : manager
      )
    );
    toast({
      title: "비밀번호 변경 완료",
      description: "관리자 비밀번호가 변경되었습니다.",
    });
  };

  const addRegisteredUser = (name: string) => {
    const newUser: RegisteredUser = {
      id: `user-${Date.now()}`,
      name
    };
    setRegisteredUsers([...registeredUsers, newUser]);
    toast({
      title: "사용자 등록 완료",
      description: `${name}님이 등록되었습니다.`,
    });
  };

  const removeRegisteredUser = (id: string) => {
    setRegisteredUsers(registeredUsers.filter(user => user.id !== id));
    toast({
      title: "사용자 제거 완료",
      description: "사용자가 제거되었습니다.",
    });
  };

  // Reset all data to initial state
  const resetAllData = () => {
    // Clear all data
    setRequests([]);
    
    // Reset all laptops to available status
    const resetRentalLaptops = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      type: 'rental' as const,
      status: 'available' as const
    }));
    setRentalLaptops(resetRentalLaptops);
    
    const resetAdditionalLaptops = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      type: 'additional' as const,
      status: 'available' as const
    }));
    setAdditionalLaptops(resetAdditionalLaptops);
    
    const resetOwnedLaptops = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      type: 'owned' as const,
      status: 'available' as const
    }));
    setOwnedLaptops(resetOwnedLaptops);
    
    toast({
      title: "데이터 초기화 완료",
      description: "모든 노트북 데이터가 초기 상태로 복원되었습니다.",
    });
  };

  // Clean up laptops that have status but no corresponding request
  const cleanupOrphanedLaptops = () => {
    console.log("데이터 정리 시작");
    const requestIds = requests.map(r => r.id);
    let totalCleaned = 0;

    // Count and clean rental laptops
    const rentalCleaned = rentalLaptops.filter(laptop => 
      laptop.status !== 'available' && (!laptop.assignedTo || !requestIds.includes(laptop.assignedTo.id))
    ).length;
    
    setRentalLaptops(prevLaptops => 
      prevLaptops.map(laptop => {
        if (laptop.status !== 'available' && (!laptop.assignedTo || !requestIds.includes(laptop.assignedTo.id))) {
          return { ...laptop, status: 'available' as const, assignedTo: undefined };
        }
        return laptop;
      })
    );

    // Count and clean additional laptops
    const additionalCleaned = additionalLaptops.filter(laptop => 
      laptop.status !== 'available' && (!laptop.assignedTo || !requestIds.includes(laptop.assignedTo.id))
    ).length;
    
    setAdditionalLaptops(prevLaptops => 
      prevLaptops.map(laptop => {
        if (laptop.status !== 'available' && (!laptop.assignedTo || !requestIds.includes(laptop.assignedTo.id))) {
          return { ...laptop, status: 'available' as const, assignedTo: undefined };
        }
        return laptop;
      })
    );

    // Count and clean owned laptops
    const ownedCleaned = ownedLaptops.filter(laptop => 
      laptop.status !== 'available' && (!laptop.assignedTo || !requestIds.includes(laptop.assignedTo.id))
    ).length;
    
    setOwnedLaptops(prevLaptops => 
      prevLaptops.map(laptop => {
        if (laptop.status !== 'available' && (!laptop.assignedTo || !requestIds.includes(laptop.assignedTo.id))) {
          return { ...laptop, status: 'available' as const, assignedTo: undefined };
        }
        return laptop;
      })
    );

    totalCleaned = rentalCleaned + additionalCleaned + ownedCleaned;
    console.log(`정리된 노트북 수: ${totalCleaned}`);

    // Always show a toast message
    setTimeout(() => {
      if (totalCleaned > 0) {
        toast({
          title: "✅ 데이터 정리 완료",
          description: `${totalCleaned}개의 노트북이 사용 가능 상태로 복원되었습니다.`,
        });
      } else {
        toast({
          title: "✅ 데이터 정리 완료", 
          description: "정리가 필요한 노트북이 없습니다. 모든 데이터가 정상 상태입니다.",
        });
      }
    }, 100);
  };

  return (
    <LaptopContext.Provider value={{
      user,
      sessions,
      rentalLaptops,
      additionalLaptops,
      ownedLaptops,
      requests,
      managers,
      registeredUsers,
      login,
      logout,
      addSession,
      deleteSession,
      addLaptop,
      deleteLaptop,
      requestLaptops,
      cancelRequest,
      returnRequestLaptops,
      completeReturnLaptops,
      completeLaptopCheckout,
      changePassword,
      changeSitePassword,
      addManager,
      removeManager,
      updateManagerPassword,
      addRegisteredUser,
      removeRegisteredUser,
      resetAllData,
      cleanupOrphanedLaptops
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