"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useLaptopContext } from "@/contexts/LaptopContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export function RequestForm() {
  const { user, sessions, rentalLaptops, ownedLaptops, requestLaptops } = useLaptopContext();
  const { toast } = useToast();
  
  const [selectedType, setSelectedType] = useState<'rental' | 'owned'>('rental');
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedRound, setSelectedRound] = useState<string>("");
  const [selectedLaptops, setSelectedLaptops] = useState<number[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredSessions, setFilteredSessions] = useState<{ grade: number; rounds: number[] }[]>([]);
  
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
  
  const availableLaptops = selectedType === 'rental' 
    ? rentalLaptops.filter(laptop => laptop.status === 'available')
    : ownedLaptops.filter(laptop => laptop.status === 'available');
  
  const handleLaptopSelection = (laptopId: number) => {
    setSelectedLaptops(prev => 
      prev.includes(laptopId)
        ? prev.filter(id => id !== laptopId)
        : [...prev, laptopId]
    );
  };
  
  const handleSubmit = () => {
    if (!selectedGrade || !selectedRound || selectedLaptops.length === 0 || !startDate || !endDate) {
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
    
    requestLaptops({
      userName: user?.name || "",
      grade: parseInt(selectedGrade) as 1 | 2 | 3,
      round: parseInt(selectedRound),
      laptopIds: selectedLaptops,
      laptopType: selectedType,
      startDate,
      endDate
    });
    
    toast({
      title: "노트북 신청 완료",
      description: `${selectedLaptops.length}대의 노트북을 신청했습니다`,
    });
    
    // Reset form
    setSelectedLaptops([]);
    setStartDate("");
    setEndDate("");
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div>
          <label className="block mb-2 text-sm font-medium">노트북 유형</label>
          <Select value={selectedType} onValueChange={(value) => setSelectedType(value as 'rental' | 'owned')}>
            <SelectTrigger>
              <SelectValue placeholder="노트북 유형 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rental">랜탈노트북</SelectItem>
              <SelectItem value="owned">보유노트북</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
          <label className="block mb-2 text-sm font-medium">시작일</label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">종료일</label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      
      <div>
        <h3 className="mb-4 text-lg font-medium">사용 가능한 노트북 ({availableLaptops.length}대)</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8">
          {availableLaptops.map((laptop) => (
            <Card
              key={`${laptop.type}-${laptop.id}`}
              className={`cursor-pointer ${
                selectedLaptops.includes(laptop.id) ? "border-2 border-blue-500" : ""
              }`}
              onClick={() => handleLaptopSelection(laptop.id)}
            >
              <CardContent className="flex flex-col items-center justify-center p-4">
                <div className="flex items-center justify-center w-10 h-10 mb-2 text-xl font-bold text-white bg-blue-500 rounded-full">
                  {laptop.id}
                </div>
                <div className="flex items-center">
                  <Checkbox
                    checked={selectedLaptops.includes(laptop.id)}
                    onCheckedChange={() => handleLaptopSelection(laptop.id)}
                  />
                  <span className="ml-2 text-sm font-medium">
                    {laptop.type === 'rental' ? '랜탈' : '보유'} #{laptop.id}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {availableLaptops.length === 0 && (
          <p className="text-center text-gray-500">사용 가능한 노트북이 없습니다.</p>
        )}
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={selectedLaptops.length === 0 || !startDate || !endDate || !selectedGrade || !selectedRound}
        >
          노트북 신청 ({selectedLaptops.length}대)
        </Button>
      </div>
    </div>
  );
}