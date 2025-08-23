"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLaptopContext } from "@/contexts/LaptopContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Key } from "lucide-react";

export function LoginForm() {
  const { login, managers, registeredUsers } = useLaptopContext();
  
  // Force cache busting - add app version check
  const APP_VERSION = '2.1.0';
  
  // Clear old cache on component mount
  useState(() => {
    const currentVersion = localStorage.getItem('app_version');
    if (currentVersion !== APP_VERSION) {
      console.log('App version mismatch - clearing cache');
      localStorage.setItem('app_version', APP_VERSION);
      sessionStorage.clear();
      // Force page reload after cache clear
      setTimeout(() => window.location.reload(), 100);
    }
  });
  const [name, setName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerPassword, setManagerPassword] = useState("");
  const [error, setError] = useState(false);
  const [adminError, setAdminError] = useState(false);
  const [managerError, setManagerError] = useState(false);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [managerDialogOpen, setManagerDialogOpen] = useState(false);
  
  // Handle dialog close for admin
  const handleAdminDialogClose = (open: boolean) => {
    setAdminDialogOpen(open);
    if (!open) {
      setAdminPassword("");
      setAdminError(false);
    }
  };
  
  // Handle dialog close for manager
  const handleManagerDialogClose = (open: boolean) => {
    setManagerDialogOpen(open);
    if (!open) {
      setManagerName("");
      setManagerPassword("");
      setManagerError(false);
    }
  };
  
  const handleLogin = () => {
    // Clear any cached login state
    sessionStorage.removeItem('siteAuthorized');
    localStorage.removeItem('tempUser');
    
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Input name:', name.trim());
    console.log('Registered users:', registeredUsers);
    
    if (!name.trim()) {
      console.log('Empty name - login rejected');
      setError(true);
      return;
    }

    // STRICT user validation - must be in registered users list
    const isRegistered = registeredUsers.some(user => user.name.trim() === name.trim());
    console.log('Is registered:', isRegistered);
    
    if (!isRegistered) {
      console.log('User not in registered list - login rejected');
      setError(true);
      return;
    }

    console.log('Login approved for:', name.trim());
    login(false, false, name.trim());
    setError(false);
  };
  
  const handleAdminLogin = () => {
    // Fixed admin password to '3086'
    const fixedAdminPassword = localStorage.getItem('adminPassword') || '3086';
    
    if (adminPassword === fixedAdminPassword) {
      login(true);
      setAdminError(false);
      setAdminDialogOpen(false);
    } else {
      setAdminError(true);
    }
  };

  const handleManagerLogin = () => {
    if (managerName.trim() === "" || !managerPassword) {
      setManagerError(true);
      return;
    }
    
    const manager = managers.find(m => m.name === managerName && m.password === managerPassword);
    if (manager) {
      login(false, true, manager.name);
      setManagerError(false);
      setManagerPassword("");
      setManagerDialogOpen(false);
    } else {
      setManagerError(true);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      <Card className="w-[350px] relative">
        {/* Admin access button in top-right corner */}
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setAdminDialogOpen(true)}
          className="absolute top-2 right-2 text-xs text-gray-400 hover:text-gray-600 p-1 h-6 w-6"
        >
          <Key className="h-3 w-3" />
        </Button>
        
        <CardHeader className="text-center">
          <CardTitle className="text-xl">노트북 관리 시스템</CardTitle>
          <CardDescription>사용자 이름을 입력하여 로그인하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">사용자 이름</label>
              <Input
                id="name"
                type="text"
                placeholder="이름을 입력하세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                autoComplete="off"
                inputMode="text"
                lang="ko"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLogin();
                  }
                }}
              />
              {error && <p className="text-sm text-red-500">등록된 사용자 이름을 입력해주세요</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button 
            className="w-full" 
            onClick={handleLogin}
          >
            로그인
          </Button>
          
          <div className="flex justify-center w-full">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setManagerDialogOpen(true)}
              className="text-xs text-gray-500"
            >
              관리자 접속
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Admin Login Dialog */}
      <Dialog open={adminDialogOpen} onOpenChange={handleAdminDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>시스템관리자 로그인</DialogTitle>
            <DialogDescription>
              시스템관리자 기능을 사용하기 위한 인증이 필요합니다
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 p-2">
            <div className="space-y-2">
              <label htmlFor="admin-password" className="text-sm font-medium">관리자 비밀번호</label>
              <Input
                id="admin-password"
                type="password"
                placeholder="관리자 비밀번호를 입력하세요"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAdminLogin();
                  }
                }}
              />
              {adminError && (
                <p className="text-sm text-red-500">관리자 비밀번호가 올바르지 않습니다.</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleAdminDialogClose(false)} variant="outline" className="w-1/2">취소</Button>
              <Button onClick={handleAdminLogin} className="w-1/2">로그인</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manager Login Dialog */}
      <Dialog open={managerDialogOpen} onOpenChange={handleManagerDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>관리자 로그인</DialogTitle>
            <DialogDescription>
              관리자 기능을 사용하기 위한 인증이 필요합니다
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 p-2">
            <div className="space-y-2">
              <label htmlFor="manager-name" className="text-sm font-medium">관리자 이름</label>
              <Input
                id="manager-name"
                type="text"
                placeholder="이름을 입력하세요"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                className="w-full"
                autoComplete="off"
                inputMode="text"
                lang="ko"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleManagerLogin();
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="manager-password" className="text-sm font-medium">비밀번호</label>
              <Input
                id="manager-password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={managerPassword}
                onChange={(e) => setManagerPassword(e.target.value)}
                className="w-full"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleManagerLogin();
                  }
                }}
              />
              {managerError && (
                <p className="text-sm text-red-500">등록된 관리자가 아니거나 비밀번호가 일치하지 않습니다</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleManagerDialogClose(false)} variant="outline" className="w-1/2">취소</Button>
              <Button onClick={handleManagerLogin} className="w-1/2">로그인</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}