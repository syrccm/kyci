"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLaptopContext } from "@/contexts/LaptopContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function UserRegistrationManager() {
  const { registeredUsers, addRegisteredUser, removeRegisteredUser } = useLaptopContext();
  
  const [userName, setUserName] = useState("");
  const [userError, setUserError] = useState("");
  
  const handleAddUser = () => {
    if (!userName.trim()) {
      setUserError("이름을 입력하세요");
      return;
    }
    
    // Check for duplicate names
    if (registeredUsers.some(user => user.name === userName.trim())) {
      setUserError("이미 등록된 사용자 이름입니다");
      return;
    }
    
    addRegisteredUser(userName);
    setUserName("");
    setUserError("");
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>사용자 등록 관리</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
          <p className="text-blue-800 text-sm">
            등록된 사용자만 시스템에 접속할 수 있습니다
          </p>
        </div>
        <div className="grid gap-4">
          <div className="flex gap-2">
            <Input
              placeholder="사용자 이름"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <Button onClick={handleAddUser}>등록</Button>
          </div>
          {userError && <p className="text-sm text-red-500">{userError}</p>}
        </div>
        
        <Separator className="my-4" />
        
        <div>
          <h3 className="mb-2 text-sm font-medium">등록된 사용자 목록</h3>
          {registeredUsers.length === 0 ? (
            <p className="text-sm text-gray-500">등록된 사용자가 없습니다</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이름</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registeredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => removeRegisteredUser(user.id)}
                      >
                        삭제
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}