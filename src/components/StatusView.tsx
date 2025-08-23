"use client";

import { Laptop } from "@/types";
import { useLaptopContext } from "@/contexts/LaptopContext";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

export function StatusView() {
  const { rentalLaptops, additionalLaptops, ownedLaptops, requests } = useLaptopContext();
  
  // Count laptops by status
  const rentalCounts = {
    total: rentalLaptops.length,
    available: rentalLaptops.filter(l => l.status === 'available').length,
    inUse: rentalLaptops.filter(l => l.status === 'in-use').length,
    requested: rentalLaptops.filter(l => l.status === 'requested').length,
    returnRequested: rentalLaptops.filter(l => l.status === 'return-requested').length,
  };
  
  const additionalCounts = {
    total: additionalLaptops.length,
    available: additionalLaptops.filter(l => l.status === 'available').length,
    inUse: additionalLaptops.filter(l => l.status === 'in-use').length,
    requested: additionalLaptops.filter(l => l.status === 'requested').length,
    returnRequested: additionalLaptops.filter(l => l.status === 'return-requested').length,
  };
  
  const ownedCounts = {
    total: ownedLaptops.length,
    available: ownedLaptops.filter(l => l.status === 'available').length,
    inUse: ownedLaptops.filter(l => l.status === 'in-use').length,
    requested: ownedLaptops.filter(l => l.status === 'requested').length,
    returnRequested: ownedLaptops.filter(l => l.status === 'return-requested').length,
  };
  
  // Get all laptops that are not available (in various statuses)
  const activeRentalLaptops = rentalLaptops.filter(l => l.status !== 'available');
  const activeAdditionalLaptops = additionalLaptops.filter(l => l.status !== 'available');
  const activeOwnedLaptops = ownedLaptops.filter(l => l.status !== 'available');
  
  const renderLaptopStatus = (laptops: Laptop[]) => {
    // Group laptops by request
    const groupedByRequest: Record<string, Laptop[]> = {};
    
    laptops.forEach(laptop => {
      if (laptop.assignedTo) {
        const requestId = laptop.assignedTo.id;
        if (!groupedByRequest[requestId]) {
          groupedByRequest[requestId] = [];
        }
        groupedByRequest[requestId].push(laptop);
      }
    });
    
    return Object.entries(groupedByRequest).map(([requestId, laptops]) => {
      const request = laptops[0]?.assignedTo;
      if (!request) return null;
      
      // Translate status to Korean
      const getStatusDisplay = (status: string) => {
        switch(status) {
          case 'requested': return '승인대기';
          case 'in-use': return '사용중';
          case 'return-requested': return '반납신청';
          case 'returned': return '반납완료';
          case 'checked-out': return '출고완료';
          default: return status;
        }
      };
      
      // Get appropriate CSS classes based on status
      const getStatusClasses = (status: string) => {
        switch(status) {
          case 'requested': return 'bg-amber-100 text-amber-800';
          case 'in-use': return 'bg-green-100 text-green-800';
          case 'return-requested': return 'bg-blue-100 text-blue-800';
          case 'returned': return 'bg-gray-100 text-gray-800';
          case 'checked-out': return 'bg-purple-100 text-purple-800';
          default: return 'bg-gray-100 text-gray-800';
        }
      };
      
      return (
        <Card key={requestId} className="mb-4">
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium">
                {request.grade}급 {request.round}회차 - {request.userName}
              </h3>
              <div className="flex gap-4 text-sm text-gray-500">
                <p>사용시작일: {format(new Date(request.startDate), 'yyyy-MM-dd')}</p>
                <p>반납일: {format(new Date(request.endDate), 'yyyy-MM-dd')}</p>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                상태: <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(request.status)}`}>
                  {getStatusDisplay(request.status)}
                </span>
              </p>
            </div>
            
            <div className="overflow-hidden rounded-lg border bg-white">
              <div className="p-3 bg-gray-50 border-b">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-sm font-medium text-gray-500">노트북 번호</div>
                  <div className="text-sm font-medium text-gray-500">유형</div>
                  <div className="text-sm font-medium text-gray-500">상태</div>
                </div>
              </div>
              <div className="divide-y">
                {laptops.map(laptop => (
                  <div key={`${laptop.type}-${laptop.id}`} className="grid grid-cols-3 gap-2 p-3">
                    <div>
                      <span className="text-sm">{laptop.id}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {laptop.type === 'rental' ? '랜탈노트북' : 
                       laptop.type === 'additional' ? '추가노트북' : '보유노트북'}
                    </div>
                    <div>
                      <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(laptop.assignedTo?.status || '')}`}>
                        {getStatusDisplay(laptop.assignedTo?.status || '')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      );
    });
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">노트북 사용 현황</h2>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-2 text-lg font-medium">랜탈노트북 현황</h3>
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold">{rentalCounts.total}</p>
                <p className="text-xs text-gray-500">전체</p>
              </div>
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{rentalCounts.available}</p>
                <p className="text-xs text-gray-500">사용가능</p>
              </div>
              <div className="text-center p-2 bg-amber-50 rounded-lg">
                <p className="text-2xl font-bold text-amber-600">{rentalCounts.inUse}</p>
                <p className="text-xs text-gray-500">사용중</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="text-center p-2 bg-yellow-50 rounded-lg">
                <p className="text-xl font-bold text-yellow-600">{rentalCounts.requested}</p>
                <p className="text-xs text-gray-500">사용신청</p>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <p className="text-xl font-bold text-blue-600">{rentalCounts.returnRequested}</p>
                <p className="text-xs text-gray-500">반납신청</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-2 text-lg font-medium">추가노트북 현황</h3>
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold">{additionalCounts.total}</p>
                <p className="text-xs text-gray-500">전체</p>
              </div>
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{additionalCounts.available}</p>
                <p className="text-xs text-gray-500">사용가능</p>
              </div>
              <div className="text-center p-2 bg-amber-50 rounded-lg">
                <p className="text-2xl font-bold text-amber-600">{additionalCounts.inUse}</p>
                <p className="text-xs text-gray-500">사용중</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="text-center p-2 bg-yellow-50 rounded-lg">
                <p className="text-xl font-bold text-yellow-600">{additionalCounts.requested}</p>
                <p className="text-xs text-gray-500">사용신청</p>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <p className="text-xl font-bold text-blue-600">{additionalCounts.returnRequested}</p>
                <p className="text-xs text-gray-500">반납신청</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-2 text-lg font-medium">보유노트북 현황</h3>
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold">{ownedCounts.total}</p>
                <p className="text-xs text-gray-500">전체</p>
              </div>
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{ownedCounts.available}</p>
                <p className="text-xs text-gray-500">사용가능</p>
              </div>
              <div className="text-center p-2 bg-amber-50 rounded-lg">
                <p className="text-2xl font-bold text-amber-600">{ownedCounts.inUse}</p>
                <p className="text-xs text-gray-500">사용중</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="text-center p-2 bg-yellow-50 rounded-lg">
                <p className="text-xl font-bold text-yellow-600">{ownedCounts.requested}</p>
                <p className="text-xs text-gray-500">사용신청</p>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <p className="text-xl font-bold text-blue-600">{ownedCounts.returnRequested}</p>
                <p className="text-xs text-gray-500">반납신청</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="rental">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rental">랜탈노트북 상태</TabsTrigger>
          <TabsTrigger value="additional">추가노트북 상태</TabsTrigger>
          <TabsTrigger value="owned">보유노트북 상태</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rental" className="mt-4">
          {activeRentalLaptops.length === 0 ? (
            <p className="p-4 text-center text-gray-500">현재 사용 중인 랜탈노트북이 없습니다.</p>
          ) : (
            renderLaptopStatus(activeRentalLaptops)
          )}
        </TabsContent>
        
        <TabsContent value="additional" className="mt-4">
          {activeAdditionalLaptops.length === 0 ? (
            <p className="p-4 text-center text-gray-500">현재 사용 중인 추가노트북이 없습니다.</p>
          ) : (
            renderLaptopStatus(activeAdditionalLaptops)
          )}
        </TabsContent>
        
        <TabsContent value="owned" className="mt-4">
          {activeOwnedLaptops.length === 0 ? (
            <p className="p-4 text-center text-gray-500">현재 사용 중인 보유노트북이 없습니다.</p>
          ) : (
            renderLaptopStatus(activeOwnedLaptops)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}