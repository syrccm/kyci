"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useLaptopContext } from "@/contexts/LaptopContext";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { KeyRound } from "lucide-react";

export function LoginForm() {
  const { login } = useLaptopContext();
  const [internName, setInternName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  
  const handleInternLogin = () => {
    if (internName.trim()) {
      login(false, internName);
    }
  };

  const handleAdminLogin = () => {
    const storedPassword = localStorage.getItem('adminPassword') || '00000';
    if (adminPassword === storedPassword) {
      login(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="fixed top-4 right-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full bg-white shadow hover:bg-gray-100">
              <KeyRound className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>관리자 로그인</SheetTitle>
              <SheetDescription>
                관리자 권한으로 접근하려면 비밀번호를 입력하세요.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">비밀번호</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
                {passwordError && (
                  <p className="text-sm text-red-500">비밀번호가 잘못되었습니다.</p>
                )}
              </div>
              <Button onClick={handleAdminLogin} disabled={!adminPassword}>
                관리자 로그인
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">노트북 관리 시스템</CardTitle>
          <CardDescription>청소년상담사 자격연수 노트북 관리</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">이름</label>
              <Input
                id="name"
                placeholder="이름을 입력하세요"
                value={internName}
                onChange={(e) => setInternName(e.target.value)}
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleInternLogin} 
              disabled={!internName.trim()}
            >
              로그인
            </Button>
          </div>
        </CardContent>
        <CardFooter className="text-xs text-center text-gray-500 justify-center">
          © {new Date().getFullYear()} 청소년상담사 자격연수 노트북 관리 시스템
        </CardFooter>
      </Card>
    </div>
  );
}