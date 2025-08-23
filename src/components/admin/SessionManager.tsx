"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLaptopContext } from "@/contexts/LaptopContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SessionManager() {
  const { sessions, addSession, deleteSession } = useLaptopContext();
  
  const [grade1Rounds, setGrade1Rounds] = useState<string>("0");
  const [grade2Rounds, setGrade2Rounds] = useState<string>("0");
  const [grade3Rounds, setGrade3Rounds] = useState<string>("0");
  
  // Helper function to get existing rounds for each grade
  const getExistingRounds = (grade: 1 | 2 | 3) => {
    return sessions
      .filter(session => session.grade === grade)
      .map(session => session.round)
      .sort((a, b) => a - b);
  };

  const existingGrade1Rounds = getExistingRounds(1);
  const existingGrade2Rounds = getExistingRounds(2);
  const existingGrade3Rounds = getExistingRounds(3);

  const handleSetRounds = async (grade: 1 | 2 | 3, targetRounds: number) => {
    // Use a local copy of sessions to make sure we're working with consistent data
    const currentSessions = [...sessions];
    
    // First, remove all sessions for this grade
    const sessionsToDelete = currentSessions.filter(
      session => session.grade === grade
    );
    
    // Clear existing sessions
    for (const session of sessionsToDelete) {
      deleteSession(session.id);
    }
    
    // Wait a moment to ensure deletions are processed
    setTimeout(() => {
      // Now create new sequential sessions
      if (targetRounds > 0) {
        const today = new Date().toISOString().split('T')[0];
        
        // Create sessions one by one with sequential round numbers
        for (let i = 1; i <= targetRounds; i++) {
          console.log(`Creating session for grade ${grade}, round ${i}`);
          addSession({
            grade,
            round: i,
            startDate: today,
            endDate: today
          });
        }
      }
      
      // Reset the input after processing
      if (grade === 1) setGrade1Rounds("0");
      else if (grade === 2) setGrade2Rounds("0");
      else if (grade === 3) setGrade3Rounds("0");
    }, 100); // Small delay to ensure deletions complete first
  };

  console.log("Current sessions:", sessions);

  return (
    <Card>
      <CardHeader>
        <CardTitle>회차 관리</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="grid grid-cols-1 gap-4 p-6 border rounded-lg md:grid-cols-3">
            <div className="space-y-2">
              <label className="block text-sm font-medium">1급 회차 설정</label>
              <div className="flex items-center gap-3">
                <Input 
                  type="number" 
                  placeholder="회차 수" 
                  value={grade1Rounds} 
                  onChange={(e) => setGrade1Rounds(e.target.value)}
                  min="0"
                  className="w-32"
                />
                <Button 
                  onClick={() => handleSetRounds(1, parseInt(grade1Rounds) || 0)}
                  disabled={!grade1Rounds || grade1Rounds === "0"}
                >
                  설정
                </Button>
              </div>
              <div className="text-sm text-gray-500">
                현재 회차: {existingGrade1Rounds.length > 0 ? `1회차 ~ ${existingGrade1Rounds.length}회차 (총 ${existingGrade1Rounds.length}개)` : '없음'}
              </div>
              <div className="text-xs text-blue-600">
                입력한 숫자만큼 1회차부터 순차적으로 생성됩니다.
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">2급 회차 설정</label>
              <div className="flex items-center gap-3">
                <Input 
                  type="number" 
                  placeholder="회차 수" 
                  value={grade2Rounds} 
                  onChange={(e) => setGrade2Rounds(e.target.value)}
                  min="0"
                  className="w-32"
                />
                <Button 
                  onClick={() => handleSetRounds(2, parseInt(grade2Rounds) || 0)}
                  disabled={!grade2Rounds || grade2Rounds === "0"}
                >
                  설정
                </Button>
              </div>
              <div className="text-sm text-gray-500">
                현재 회차: {existingGrade2Rounds.length > 0 ? `1회차 ~ ${existingGrade2Rounds.length}회차 (총 ${existingGrade2Rounds.length}개)` : '없음'}
              </div>
              <div className="text-xs text-blue-600">
                입력한 숫자만큼 1회차부터 순차적으로 생성됩니다.
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">3급 회차 설정</label>
              <div className="flex items-center gap-3">
                <Input 
                  type="number" 
                  placeholder="회차 수" 
                  value={grade3Rounds} 
                  onChange={(e) => setGrade3Rounds(e.target.value)}
                  min="0"
                  className="w-32"
                />
                <Button 
                  onClick={() => handleSetRounds(3, parseInt(grade3Rounds) || 0)}
                  disabled={!grade3Rounds || grade3Rounds === "0"}
                >
                  설정
                </Button>
              </div>
              <div className="text-sm text-gray-500">
                현재 회차: {existingGrade3Rounds.length > 0 ? `1회차 ~ ${existingGrade3Rounds.length}회차 (총 ${existingGrade3Rounds.length}개)` : '없음'}
              </div>
              <div className="text-xs text-blue-600">
                입력한 숫자만큼 1회차부터 순차적으로 생성됩니다.
              </div>
            </div>
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>급수</TableHead>
              <TableHead>회차</TableHead>
              <TableHead className="w-[100px]">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500">
                  등록된 회차가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              sessions
                .sort((a, b) => {
                  // Sort by grade first, then by round
                  if (a.grade !== b.grade) {
                    return a.grade - b.grade;
                  }
                  return a.round - b.round;
                })
                .map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{session.grade}급</TableCell>
                    <TableCell>{session.round}회차</TableCell>
                    <TableCell>
                      <Button variant="destructive" size="sm" onClick={() => deleteSession(session.id)}>
                        삭제
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}