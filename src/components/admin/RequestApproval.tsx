"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLaptopContext } from "@/contexts/LaptopContext";
import { format } from "date-fns";

export function RequestApproval() {
  const { requests, completeLaptopCheckout, completeReturnLaptops, cancelRequest } = useLaptopContext();
  
  // Debug: Log all requests to console
  console.log('All requests in RequestApproval:', requests);
  
  // Filter for different request statuses
  const pendingRequests = requests.filter(req => req.status === 'requested');
  const inUseRequests = requests.filter(req => req.status === 'in-use');
  const returnRequestedLaptops = requests.filter(req => req.status === 'return-requested');
  
  console.log('Pending requests:', pendingRequests);
  console.log('In-use requests:', inUseRequests);
  console.log('Return requested:', returnRequestedLaptops);
  
  // Filter requests by laptop type
  const getRentalRequests = (requestList: any[]) => requestList.filter(req => req.laptopType === 'rental');
  const getAdditionalRequests = (requestList: any[]) => requestList.filter(req => req.laptopType === 'additional');
  const getOwnedRequests = (requestList: any[]) => requestList.filter(req => req.laptopType === 'owned');
  
  // Helper function to get laptop type display name
  const getLaptopTypeDisplay = (type: string) => {
    console.log(`getLaptopTypeDisplay called with type: "${type}"`);
    switch (type) {
      case 'rental': 
        console.log('Returning: 랜탈노트북');
        return '랜탈노트북';
      case 'additional': 
        console.log('Returning: 추가노트북');
        return '추가노트북';
      case 'owned': 
        console.log('Returning: 보유노트북');
        return '보유노트북';
      default: 
        console.log(`Unknown type, returning: ${type}`);
        return type;
    }
  };

  // Helper function to get laptop type color
  const getLaptopTypeColor = (type: string) => {
    switch (type) {
      case 'rental': return 'text-blue-600';
      case 'additional': return 'text-green-600';
      case 'owned': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };
  
  // Component to render request cards
  const renderRequestCards = (requestList: any[], title: string, emptyMessage: string) => (
    <div>
      <h3 className="mb-4 text-md font-medium">{title} ({requestList.length})</h3>
      {requestList.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">{emptyMessage}</p>
          </CardContent>
        </Card>
      ) : (
        requestList.map(request => (
          <Card key={request.id} className="mb-4">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-medium">
                    {request.userName} - {request.grade}급 {request.round}회차
                  </h4>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <p>사용시작일: {format(new Date(request.startDate), 'yyyy-MM-dd')}</p>
                    <p>반납일: {format(new Date(request.endDate), 'yyyy-MM-dd')}</p>
                  </div>
                  <p className={`text-sm font-medium ${getLaptopTypeColor(request.laptopType)}`}>
                    {(() => {
                      console.log(`Rendering request.laptopType: "${request.laptopType}" for request.id: ${request.id}`);
                      return getLaptopTypeDisplay(request.laptopType);
                    })()} {request.laptopIds.length}대
                  </p>
                </div>
                <div className="flex gap-2">
                  {request.status === 'requested' && (
                    <>
                      <Button 
                        onClick={() => completeLaptopCheckout(request.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        출고 완료
                      </Button>
                      <Button 
                        onClick={() => cancelRequest(request.id)}
                        variant="destructive"
                      >
                        신청 취소
                      </Button>
                    </>
                  )}
                  {request.status === 'return-requested' && (
                    <Button 
                      onClick={() => completeReturnLaptops(request.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      입고 완료
                    </Button>
                  )}
                  {request.status === 'in-use' && (
                    <div className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      사용중
                    </div>
                  )}
                </div>
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
                  {request.laptopIds.map((id: number) => (
                    <div key={`${request.laptopType}-${id}`} className="grid grid-cols-3 gap-2 p-3 items-center">
                      <div>
                        <span className="text-sm">{id}</span>
                      </div>
                      <div className={`text-sm font-medium ${getLaptopTypeColor(request.laptopType)}`}>
                        {getLaptopTypeDisplay(request.laptopType)}
                      </div>
                      <div>
                        <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          request.status === 'requested' ? 'bg-amber-100 text-amber-800' :
                          request.status === 'in-use' ? 'bg-green-100 text-green-800' :
                          request.status === 'return-requested' ? 'bg-amber-100 text-amber-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {request.status === 'requested' ? '사용신청중' :
                           request.status === 'in-use' ? '사용중' :
                           request.status === 'return-requested' ? '반납신청중' : 
                           request.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  return (
    <Tabs defaultValue="rental" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="rental" className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          랜탈노트북 상태
        </TabsTrigger>
        <TabsTrigger value="additional" className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          추가노트북 상태
        </TabsTrigger>
        <TabsTrigger value="owned" className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-purple-500"></span>
          보유노트북 상태
        </TabsTrigger>
      </TabsList>

      <TabsContent value="rental" className="space-y-6">
        {renderRequestCards(getRentalRequests(pendingRequests), "대기 중인 사용신청", "대기 중인 랜탈노트북 사용신청이 없습니다.")}
        {renderRequestCards(getRentalRequests(returnRequestedLaptops), "대기 중인 반납신청", "대기 중인 랜탈노트북 반납신청이 없습니다.")}
        {renderRequestCards(getRentalRequests(inUseRequests), "사용 중인 노트북", "현재 사용 중인 랜탈노트북이 없습니다.")}
      </TabsContent>

      <TabsContent value="additional" className="space-y-6">
        {renderRequestCards(getAdditionalRequests(pendingRequests), "대기 중인 사용신청", "대기 중인 추가노트북 사용신청이 없습니다.")}
        {renderRequestCards(getAdditionalRequests(returnRequestedLaptops), "대기 중인 반납신청", "대기 중인 추가노트북 반납신청이 없습니다.")}
        {renderRequestCards(getAdditionalRequests(inUseRequests), "사용 중인 노트북", "현재 사용 중인 추가노트북이 없습니다.")}
      </TabsContent>

      <TabsContent value="owned" className="space-y-6">
        {renderRequestCards(getOwnedRequests(pendingRequests), "대기 중인 사용신청", "대기 중인 보유노트북 사용신청이 없습니다.")}
        {renderRequestCards(getOwnedRequests(returnRequestedLaptops), "대기 중인 반납신청", "대기 중인 보유노트북 반납신청이 없습니다.")}
        {renderRequestCards(getOwnedRequests(inUseRequests), "사용 중인 노트북", "현재 사용 중인 보유노트북이 없습니다.")}
      </TabsContent>
    </Tabs>
  );
}