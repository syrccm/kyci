"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLaptopContext } from "@/contexts/LaptopContext";
import { format } from "date-fns";

export function ReturnForm() {
  const { user, requests, returnRequestLaptops } = useLaptopContext();
  const [userRequests, setUserRequests] = useState<typeof requests>([]);
  
  useEffect(() => {
    if (user) {
      // Filter requests for current user and in active use (not returned or pending return)
      const filteredRequests = requests.filter(
        request => request.userName === user.name && request.status === 'in-use'
      );
      setUserRequests(filteredRequests);
    }
  }, [user, requests]);
  
  const handleReturn = (requestId: string) => {
    returnRequestLaptops(requestId);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">노트북 반납 신청</h2>
      
      {userRequests.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500">반납 신청할 노트북이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {userRequests.map(request => (
            <Card key={request.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium">
                      {request.grade}급 {request.round}회차 ({request.laptopType === 'rental' ? '랜탈' : '보유'})
                    </h3>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <p>사용시작일: {format(new Date(request.startDate), 'yyyy-MM-dd')}</p>
                      <p>반납일: {format(new Date(request.endDate), 'yyyy-MM-dd')}</p>
                    </div>
                  </div>
                  <Button onClick={() => handleReturn(request.id)}>반납신청</Button>
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
                    {request.laptopIds.map(id => (
                      <div key={`${request.laptopType}-${id}`} className="grid grid-cols-3 gap-2 p-3">
                        <div>
                          <span className="text-sm">{id}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {request.laptopType === 'rental' ? '랜탈노트북' : '보유노트북'}
                        </div>
                        <div>
                          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            사용중
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Pending return requests section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">반납 신청한 노트북</h2>
        {requests.filter(req => req.userName === user?.name && req.status === 'return-requested').length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">반납 신청 중인 노트북이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests
              .filter(req => req.userName === user?.name && req.status === 'return-requested')
              .map(request => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium">
                          {request.grade}급 {request.round}회차 ({request.laptopType === 'rental' ? '랜탈' : '보유'})
                        </h3>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <p>사용시작일: {format(new Date(request.startDate), 'yyyy-MM-dd')}</p>
                          <p>반납일: {format(new Date(request.endDate), 'yyyy-MM-dd')}</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                        반납신청중
                      </span>
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
                        {request.laptopIds.map(id => (
                          <div key={`${request.laptopType}-${id}`} className="grid grid-cols-3 gap-2 p-3">
                            <div>
                              <span className="text-sm">{id}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {request.laptopType === 'rental' ? '랜탈노트북' : '보유노트북'}
                            </div>
                            <div>
                              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                반납신청중
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}