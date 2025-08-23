"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLaptopContext } from "@/contexts/LaptopContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function RequestForm() {
  const { user, sessions, rentalLaptops, additionalLaptops, ownedLaptops, requestLaptops } = useLaptopContext();
  const { toast } = useToast();
  
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedRound, setSelectedRound] = useState<string>("");
  const [selectedRentalLaptops, setSelectedRentalLaptops] = useState<number[]>([]);
  const [selectedAdditionalLaptops, setSelectedAdditionalLaptops] = useState<number[]>([]);
  const [selectedOwnedLaptops, setSelectedOwnedLaptops] = useState<number[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredSessions, setFilteredSessions] = useState<{ grade: number; rounds: number[] }[]>([]);
  
  // Success dialog state
  const [successDialog, setSuccessDialog] = useState(false);
  
  // Prepare sessions data for dropdown selection
  useEffect(() => {
    const grades: { [key: number]: number[] } = {};
    
    sessions.forEach((session) => {
      if (!grades[session.grade]) {
        grades[session.grade] = [];
      }
      if (!grades[session.grade].includes(session.round)) {
        grades[session.grade].push(session.round);
      }
    });
    
    const formattedGrades = Object.entries(grades).map(([grade, rounds]) => ({
      grade: parseInt(grade),
      rounds: rounds.sort((a, b) => a - b)
    }));
    
    setFilteredSessions(formattedGrades);
  }, [sessions]);
  
  const availableRentalLaptops = rentalLaptops.filter(laptop => laptop.status === 'available');
  const availableAdditionalLaptops = additionalLaptops.filter(laptop => laptop.status === 'available');
  const availableOwnedLaptops = ownedLaptops.filter(laptop => laptop.status === 'available');
  
  const handleRentalLaptopSelection = (laptopId: number) => {
    setSelectedRentalLaptops(prev => 
      prev.includes(laptopId)
        ? prev.filter(id => id !== laptopId)
        : [...prev, laptopId]
    );
  };

  const handleAdditionalLaptopSelection = (laptopId: number) => {
    setSelectedAdditionalLaptops(prev => 
      prev.includes(laptopId)
        ? prev.filter(id => id !== laptopId)
        : [...prev, laptopId]
    );
  };

  const handleOwnedLaptopSelection = (laptopId: number) => {
    setSelectedOwnedLaptops(prev => 
      prev.includes(laptopId)
        ? prev.filter(id => id !== laptopId)
        : [...prev, laptopId]
    );
  };

  const totalSelectedCount = selectedRentalLaptops.length + selectedAdditionalLaptops.length + selectedOwnedLaptops.length;
  
  const handleSubmit = async () => {
    if (!selectedGrade || !selectedRound || totalSelectedCount === 0 || !startDate || !endDate) {
      toast({
        title: "입력 오류",
        description: "모든 필드를 입력하세요",
        variant: "destructive",
      });
      return;
    }
    
    if (new Date(endDate) <= new Date(startDate)) {
      toast({
        title: "날짜 오류",
        description: "종료일은 시작일 이후여야 합니다",
        variant: "destructive",
      });
      return;
    }
    
    // Submit requests for each laptop type separately with delays to ensure proper state updates
    const baseRequest = {
      userName: user?.name || "",
      grade: parseInt(selectedGrade) as 1 | 2 | 3,
      round: parseInt(selectedRound),
      startDate,
      endDate
    };

    const submitRequests = async () => {
      // Create all requests at once to prevent state conflicts
      const requestsToSubmit = [];
      
      if (selectedRentalLaptops.length > 0) {
        console.log('Preparing rental laptop request...');
        requestsToSubmit.push({
          ...baseRequest,
          laptopIds: selectedRentalLaptops,
          laptopType: 'rental' as const
        });
      }

      if (selectedAdditionalLaptops.length > 0) {
        console.log('Preparing additional laptop request...');
        requestsToSubmit.push({
          ...baseRequest,
          laptopIds: selectedAdditionalLaptops,
          laptopType: 'additional' as const
        });
      }

      if (selectedOwnedLaptops.length > 0) {
        console.log('Preparing owned laptop request...');
        requestsToSubmit.push({
          ...baseRequest,
          laptopIds: selectedOwnedLaptops,
          laptopType: 'owned' as const
        });
      }

      // Submit all requests sequentially with proper delays
      for (let i = 0; i < requestsToSubmit.length; i++) {
        const request = requestsToSubmit[i];
        console.log(`Submitting ${request.laptopType} laptop request (${i + 1}/${requestsToSubmit.length})...`);
        requestLaptops(request);
        
        // Wait between requests to ensure state updates
        if (i < requestsToSubmit.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      // Final delay to ensure all updates are processed
      await new Promise(resolve => setTimeout(resolve, 500));
    };

    await submitRequests();
    
    // Show success dialog
    setSuccessDialog(true);
    
    // Reset form
    setSelectedRentalLaptops([]);
    setSelectedAdditionalLaptops([]);
    setSelectedOwnedLaptops([]);
    setStartDate("");
    setEndDate("");
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="block mb-2 text-sm font-medium">급수</label>
          <Select value={selectedGrade} onValueChange={setSelectedGrade}>
            <SelectTrigger>
              <SelectValue placeholder="급수 선택" />
            </SelectTrigger>
            <SelectContent>
              {filteredSessions.map((item) => (
                <SelectItem key={item.grade} value={item.grade.toString()}>
                  {item.grade}급
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">회차</label>
          <Select 
            value={selectedRound} 
            onValueChange={setSelectedRound}
            disabled={!selectedGrade}
          >
            <SelectTrigger>
              <SelectValue placeholder="회차 선택" />
            </SelectTrigger>
            <SelectContent>
              {selectedGrade && 
                filteredSessions
                  .find(item => item.grade === parseInt(selectedGrade))
                  ?.rounds.map(round => (
                    <SelectItem key={round} value={round.toString()}>
                      {round}회차
                    </SelectItem>
                  ))
              }
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium">사용시작일</label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">반납예정일</label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      
      {/* 기본랜탈 노트북 섹션 */}
      <div>
        <h3 className="mb-4 text-lg font-medium">기본랜탈 노트북 ({availableRentalLaptops.length}대)</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10">
          {availableRentalLaptops.map((laptop) => (
            <button
              key={`rental-${laptop.id}`}
              className={`rounded-md px-2 py-2 text-center text-lg font-medium ${
                selectedRentalLaptops.includes(laptop.id) 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
              onClick={() => handleRentalLaptopSelection(laptop.id)}
              disabled={laptop.status !== 'available'}
            >
              {laptop.id}
            </button>
          ))}
        </div>
        {availableRentalLaptops.length === 0 && (
          <p className="text-center text-gray-500">사용 가능한 기본랜탈 노트북이 없습니다.</p>
        )}
        {selectedRentalLaptops.length > 0 && (
          <p className="mt-2 text-sm text-blue-600">선택됨: {selectedRentalLaptops.length}대</p>
        )}
      </div>

      {/* 추가랜탈 노트북 섹션 */}
      <div>
        <h3 className="mb-4 text-lg font-medium">추가랜탈 노트북 ({availableAdditionalLaptops.length}대)</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10">
          {availableAdditionalLaptops.map((laptop) => (
            <button
              key={`additional-${laptop.id}`}
              className={`rounded-md px-2 py-2 text-center text-lg font-medium ${
                selectedAdditionalLaptops.includes(laptop.id) 
                  ? "bg-green-500 text-white" 
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
              onClick={() => handleAdditionalLaptopSelection(laptop.id)}
              disabled={laptop.status !== 'available'}
            >
              {laptop.id}
            </button>
          ))}
        </div>
        {availableAdditionalLaptops.length === 0 && (
          <p className="text-center text-gray-500">사용 가능한 추가랜탈 노트북이 없습니다.</p>
        )}
        {selectedAdditionalLaptops.length > 0 && (
          <p className="mt-2 text-sm text-green-600">선택됨: {selectedAdditionalLaptops.length}대</p>
        )}
      </div>

      {/* 보유노트북 섹션 */}
      <div>
        <h3 className="mb-4 text-lg font-medium">보유노트북 ({availableOwnedLaptops.length}대)</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10">
          {availableOwnedLaptops.map((laptop) => (
            <button
              key={`owned-${laptop.id}`}
              className={`rounded-md px-2 py-2 text-center text-lg font-medium ${
                selectedOwnedLaptops.includes(laptop.id) 
                  ? "bg-purple-500 text-white" 
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
              onClick={() => handleOwnedLaptopSelection(laptop.id)}
              disabled={laptop.status !== 'available'}
            >
              {laptop.id}
            </button>
          ))}
        </div>
        {availableOwnedLaptops.length === 0 && (
          <p className="text-center text-gray-500">사용 가능한 보유노트북이 없습니다.</p>
        )}
        {selectedOwnedLaptops.length > 0 && (
          <p className="mt-2 text-sm text-purple-600">선택됨: {selectedOwnedLaptops.length}대</p>
        )}
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={totalSelectedCount === 0 || !startDate || !endDate || !selectedGrade || !selectedRound}
          className="bg-blue-500 hover:bg-blue-600"
        >
          노트북 신청 (총 {totalSelectedCount}대)
        </Button>
      </div>
      
      {/* Success Dialog */}
      <Dialog open={successDialog} onOpenChange={setSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>✅ 신청 완료</DialogTitle>
            <DialogDescription>
              노트북 신청이 완료되었습니다.<br />
              관리자에게 신청 승인을 요청하세요.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center p-4">
            <Button onClick={() => setSuccessDialog(false)} className="w-full">
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}