export interface User {
  id: string;
  name: string;
  role: 'admin' | 'intern';
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
  type: 'rental' | 'owned'; // 랜탈노트북 or 보유노트북
  status: 'available' | 'in-use' | 'maintenance';
  assignedTo?: LaptopRequest;
}

export interface LaptopRequest {
  id: string;
  userName: string;
  grade: 1 | 2 | 3;
  round: number;
  laptopIds: number[];
  laptopType: 'rental' | 'owned';
  startDate: string;
  endDate: string;
  status: 'requested' | 'approved' | 'returned';
  createdAt: string;
}