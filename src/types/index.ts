export interface User {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'intern'; // Added manager role
}

export interface RegisteredUser {
  id: string;
  name: string;
}

export interface Session {
  id: string;
  grade: 1 | 2 | 3; // 급수 (1급, 2급, 3급)
  round: number; // 회차
  startDate: string;
  endDate: string;
}

export interface Laptop {
  id: number;
  type: 'rental' | 'additional' | 'owned'; // 랜탈노트북, 추가노트북, 보유노트북
  status: 'available' | 'in-use' | 'maintenance' | 'requested' | 'return-requested'; // Added new statuses
  assignedTo?: LaptopRequest;
}

export interface LaptopRequest {
  id: string;
  userName: string;
  grade: 1 | 2 | 3;
  round: number;
  laptopIds: number[];
  laptopType: 'rental' | 'additional' | 'owned';
  startDate: string;
  endDate: string;
  status: 'requested' | 'checked-out' | 'in-use' | 'return-requested' | 'returned'; // Updated status values
  createdAt: string;
}

export interface Manager {
  id: string;
  name: string;
  password: string;
}