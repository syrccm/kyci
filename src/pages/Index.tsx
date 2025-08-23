"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/LoginForm";
import { Header } from "@/components/Header";
import { RequestForm } from "@/components/intern/RequestForm";
import { ReturnForm } from "@/components/intern/ReturnForm";
import { StatusView } from "@/components/StatusView";
import { SessionManager } from "@/components/admin/SessionManager";
import { LaptopManager } from "@/components/admin/LaptopManager";
import { RequestApproval } from "@/components/admin/RequestApproval";
import { SettingsManager } from "@/components/admin/SettingsManager";
import { useLaptopContext } from "@/contexts/LaptopContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key } from "lucide-react";

function PasswordForm({ onSuccess, onAdminClick, onManagerClick }: { onSuccess: () => void, onAdminClick: () => void, onManagerClick: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  
  const handleSubmit = () => {
    const sitePassword = localStorage.getItem('sitePassword') || '11111'; // Default password
    if (password === sitePassword) {
      onSuccess();
      setError(false);
    } else {
      setError(true);
    }
  };
  
  return (
    <div className="space-y-4 p-2 relative">
      {/* Admin access button in top-right corner */}
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onAdminClick}
        className="absolute top-0 right-0 text-xs text-gray-400 hover:text-gray-600 p-1 h-6 w-6"
      >
        <Key className="h-3 w-3" />
      </Button>
      
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">자격연수운영 노트북 관리 시스템</h1>
        <p className="text-gray-600">청소년상담사연수부</p>
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">접속 비밀번호</label>
        <Input
          id="password"
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
        />
        {error && (
          <p className="text-sm text-red-500">비밀번호가 올바르지 않습니다.</p>
        )}
      </div>
      <Button onClick={handleSubmit} className="w-full">입장하기</Button>
      
      <div className="flex justify-center pt-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onManagerClick}
          className="text-xs text-gray-500"
        >
          관리자 접속
        </Button>
      </div>
    </div>
  );
}

function AdminLoginForm({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
  const { login } = useLaptopContext();
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState(false);
  
  const handleSubmit = () => {
    // Fixed admin password to '3086'
    const fixedAdminPassword = localStorage.getItem('adminPassword') || '3086';
    
    if (adminPassword === fixedAdminPassword) {
      login(true);
      onSuccess();
      setError(false);
    } else {
      setError(true);
    }
  };
  
  return (
    <div className="space-y-4 p-2">
      <div className="space-y-2 text-center">
        <h1 className="text-xl font-bold">관리자 로그인</h1>
      </div>
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
              handleSubmit();
            }
          }}
        />
        {error && (
          <p className="text-sm text-red-500">관리자 비밀번호가 올바르지 않습니다.</p>
        )}
      </div>
      <div className="flex gap-2">
        <Button onClick={onCancel} variant="outline" className="w-1/2">취소</Button>
        <Button onClick={handleSubmit} className="w-1/2">로그인</Button>
      </div>
    </div>
  );
}

function ManagerLoginForm({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
  const { login, managers } = useLaptopContext();
  const [managerName, setManagerName] = useState("");
  const [managerPassword, setManagerPassword] = useState("");
  const [error, setError] = useState(false);
  
  const handleSubmit = () => {
    if (managerName.trim() === "" || !managerPassword) {
      setError(true);
      return;
    }
    
    const manager = managers.find(m => m.name === managerName && m.password === managerPassword);
    if (manager) {
      login(false, true, manager.name);
      onSuccess();
      setError(false);
    } else {
      setError(true);
    }
  };
  
  return (
    <div className="space-y-4 p-2">
      <div className="space-y-2 text-center">
        <h1 className="text-xl font-bold">중간관리자 로그인</h1>
      </div>
      <div className="space-y-2">
        <label htmlFor="manager-name" className="text-sm font-medium">중간관리자 이름</label>
        <Input
          id="manager-name"
          type="text"
          placeholder="등록된 중간관리자 이름을 입력하세요"
          value={managerName}
          onChange={(e) => setManagerName(e.target.value)}
          className="w-full"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
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
              handleSubmit();
            }
          }}
        />
        {error && (
          <p className="text-sm text-red-500">등록된 관리자가 아니거나 비밀번호가 일치하지 않습니다</p>
        )}
      </div>
      <div className="flex gap-2">
        <Button onClick={onCancel} variant="outline" className="w-1/2">취소</Button>
        <Button onClick={handleSubmit} className="w-1/2">로그인</Button>
      </div>
    </div>
  );
}

function MainContent() {
  const { user, logout } = useLaptopContext();
  const [activeTab, setActiveTab] = useState("request");
  
  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container p-4 mx-auto mt-8">
        {user.role === 'admin' ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">관리자 메뉴</h2>
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    logout();
                    // Clear session authorization to force re-login
                    sessionStorage.removeItem('siteAuthorized');
                    window.location.reload();
                  }}
                  className="text-xs text-gray-500"
                >
                  로그아웃
                </Button>
              </div>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="sessions">회차 관리</TabsTrigger>
                <TabsTrigger value="laptops">노트북 관리</TabsTrigger>
                <TabsTrigger value="requests">신청/반납 관리</TabsTrigger>
                <TabsTrigger value="settings">환경 설정</TabsTrigger>
              </TabsList>
              <TabsContent value="sessions" className="mt-6">
                <SessionManager />
              </TabsContent>
              <TabsContent value="laptops" className="mt-6">
                <LaptopManager />
              </TabsContent>
              <TabsContent value="requests" className="mt-6">
                <RequestApproval />
              </TabsContent>
              <TabsContent value="settings" className="mt-6">
                <SettingsManager />
              </TabsContent>
            </Tabs>
          </>
        ) : user.role === 'manager' ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">중간관리자 메뉴</h2>
              <p className="text-gray-600">반출입 관리자: {user.name}</p>
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    logout();
                    // Clear session authorization to force re-login
                    sessionStorage.removeItem('siteAuthorized');
                    window.location.reload();
                  }}
                  className="text-xs text-gray-500"
                >
                  로그아웃
                </Button>
              </div>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="requests">신청/반납 관리</TabsTrigger>
                <TabsTrigger value="status">노트북 현황</TabsTrigger>
              </TabsList>
              <TabsContent value="requests" className="mt-6">
                <RequestApproval />
              </TabsContent>
              <TabsContent value="status" className="mt-6">
                <StatusView />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">노트북 관리</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  logout();
                  // Clear session authorization to force re-login
                  sessionStorage.removeItem('siteAuthorized');
                  window.location.reload();
                }}
                className="text-xs text-gray-500"
              >
                로그아웃
              </Button>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="request">사용 신청</TabsTrigger>
                <TabsTrigger value="return">반납 신청</TabsTrigger>
                <TabsTrigger value="status">사용 현황</TabsTrigger>
              </TabsList>
              <TabsContent value="request" className="mt-6">
                <RequestForm />
              </TabsContent>
              <TabsContent value="return" className="mt-6">
                <ReturnForm />
              </TabsContent>
              <TabsContent value="status" className="mt-6">
                <StatusView />
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
}

export default function Index() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(true);
  const [authMode, setAuthMode] = useState<'user' | 'admin' | 'manager'>('user');
  
  useEffect(() => {
    // Initialize the default site password if not set
    if (!localStorage.getItem('sitePassword')) {
      localStorage.setItem('sitePassword', '11111');
    }
    
    // Check if already authorized in this session
    const auth = sessionStorage.getItem('siteAuthorized');
    if (auth === 'true') {
      setIsAuthorized(true);
      setDialogOpen(false);
    }
  }, []);
  
  const handleAuthSuccess = () => {
    setIsAuthorized(true);
    setDialogOpen(false);
    sessionStorage.setItem('siteAuthorized', 'true');
  };

  const handleAdminClick = () => {
    setAuthMode('admin');
  };

  const handleManagerClick = () => {
    setAuthMode('manager');
  };

  const handleBackToLogin = () => {
    setAuthMode('user');
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        if (!isAuthorized) {
          setDialogOpen(true); // Prevent closing if not authorized
        } else {
          setDialogOpen(open);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>노트북 관리 시스템 로그인</DialogTitle>
            <DialogDescription>
              시스템 접근을 위한 인증이 필요합니다
            </DialogDescription>
          </DialogHeader>
          
          {authMode === 'admin' ? (
            <AdminLoginForm 
              onSuccess={handleAuthSuccess} 
              onCancel={handleBackToLogin} 
            />
          ) : authMode === 'manager' ? (
            <ManagerLoginForm 
              onSuccess={handleAuthSuccess}
              onCancel={handleBackToLogin}
            />
          ) : (
            <PasswordForm 
              onSuccess={handleAuthSuccess} 
              onAdminClick={handleAdminClick}
              onManagerClick={handleManagerClick}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {isAuthorized && <MainContent />}
    </>
  );
}