"use client";

import { Button } from "@/components/ui/button";
import { useLaptopContext } from "@/contexts/LaptopContext";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { KeyRound, LogOut } from "lucide-react";

export function Header() {
  const { user, logout, changePassword } = useLaptopContext();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleChangePassword = () => {
    if (!newPassword) {
      setPasswordError("새 비밀번호를 입력해주세요.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    }
    
    changePassword(newPassword);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("비밀번호가 변경되었습니다.");
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <h1 className="text-xl font-semibold">노트북 관리 시스템</h1>
        
        <div className="flex items-center gap-4">
          {user && (
            <>
              <span className="text-sm font-medium">
                {user.role === 'admin' ? '관리자' : user.name}
              </span>
              
              {user.role === 'admin' && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <KeyRound className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>비밀번호 변경</SheetTitle>
                      <SheetDescription>
                        관리자 계정의 비밀번호를 변경합니다.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <label htmlFor="newPassword">새 비밀번호</label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="confirmPassword">비밀번호 확인</label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      {passwordError && (
                        <p className={passwordError.includes("변경") ? "text-sm text-green-500" : "text-sm text-red-500"}>
                          {passwordError}
                        </p>
                      )}
                      <Button onClick={handleChangePassword}>
                        비밀번호 변경
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              )}
              
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}