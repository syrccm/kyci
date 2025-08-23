"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLaptopContext } from "@/contexts/LaptopContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { UserRegistrationManager } from "./UserRegistrationManager";
import { Eye, EyeOff, Key } from "lucide-react";

export function SettingsManager() {
  const { 
    changePassword, 
    changeSitePassword, 
    addManager, 
    removeManager, 
    updateManagerPassword, 
    managers, 
    resetAllData, 
    cleanupOrphanedLaptops,
    requests,
    rentalLaptops,
    additionalLaptops,
    ownedLaptops
  } = useLaptopContext();
  
  const [adminPassword, setAdminPassword] = useState("");
  const [confirmAdminPassword, setConfirmAdminPassword] = useState("");
  const [sitePassword, setSitePassword] = useState("");
  const [confirmSitePassword, setConfirmSitePassword] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerPassword, setManagerPassword] = useState("");
  const [confirmManagerPassword, setConfirmManagerPassword] = useState("");
  
  const [adminError, setAdminError] = useState("");
  const [siteError, setSiteError] = useState("");
  const [managerError, setManagerError] = useState("");
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  
  // Password change dialog states
  const [passwordChangeDialog, setPasswordChangeDialog] = useState<{
    open: boolean;
    managerId: string;
    managerName: string;
  }>({ open: false, managerId: "", managerName: "" });
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordChangeError, setPasswordChangeError] = useState("");
  
  // Data cleanup dialog states
  const [cleanupDialog, setCleanupDialog] = useState(false);
  const [cleanupResult, setCleanupResult] = useState({ cleaned: 0, message: "" });
  
  // Reset dialog states
  const [resetDialog, setResetDialog] = useState(false);
  
  const handleAdminPasswordChange = () => {
    if (adminPassword !== confirmAdminPassword) {
      setAdminError("비밀번호가 일치하지 않습니다");
      return;
    }
    
    if (adminPassword.length < 4) {
      setAdminError("비밀번호는 4자 이상이어야 합니다");
      return;
    }
    
    changePassword(adminPassword);
    setAdminPassword("");
    setConfirmAdminPassword("");
    setAdminError("");
  };
  
  const handleSitePasswordChange = () => {
    if (sitePassword !== confirmSitePassword) {
      setSiteError("비밀번호가 일치하지 않습니다");
      return;
    }
    
    if (sitePassword.length < 4) {
      setSiteError("비밀번호는 4자 이상이어야 합니다");
      return;
    }
    
    changeSitePassword(sitePassword);
    setSitePassword("");
    setConfirmSitePassword("");
    setSiteError("");
  };
  
  const handleAddManager = () => {
    if (!managerName.trim()) {
      setManagerError("이름을 입력하세요");
      return;
    }
    
    if (!managerPassword.trim()) {
      setManagerError("비밀번호를 입력하세요");
      return;
    }
    
    if (managerPassword !== confirmManagerPassword) {
      setManagerError("비밀번호가 일치하지 않습니다");
      return;
    }
    
    if (managerPassword.length < 4) {
      setManagerError("비밀번호는 4자 이상이어야 합니다");
      return;
    }
    
    addManager(managerName, managerPassword);
    setManagerName("");
    setManagerPassword("");
    setConfirmManagerPassword("");
    setManagerError("");
  };

  const togglePasswordVisibility = (managerId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [managerId]: !prev[managerId]
    }));
  };

  const openPasswordChangeDialog = (managerId: string, managerName: string) => {
    setPasswordChangeDialog({ open: true, managerId, managerName });
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordChangeError("");
  };

  const closePasswordChangeDialog = () => {
    setPasswordChangeDialog({ open: false, managerId: "", managerName: "" });
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordChangeError("");
  };

  const handlePasswordChange = () => {
    if (!newPassword.trim()) {
      setPasswordChangeError("새 비밀번호를 입력하세요");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordChangeError("비밀번호가 일치하지 않습니다");
      return;
    }

    if (newPassword.length < 4) {
      setPasswordChangeError("비밀번호는 4자 이상이어야 합니다");
      return;
    }

    updateManagerPassword(passwordChangeDialog.managerId, newPassword);
    closePasswordChangeDialog();
  };

  const handleDataCleanup = () => {
    console.log("데이터 정리 시작");
    const requestIds = requests.map(r => r.id);
    let totalCleaned = 0;

    // Count laptops that need cleaning
    const rentalCleaned = rentalLaptops.filter(laptop => 
      laptop.status !== 'available' && (!laptop.assignedTo || !requestIds.includes(laptop.assignedTo.id))
    ).length;
    
    const additionalCleaned = additionalLaptops.filter(laptop => 
      laptop.status !== 'available' && (!laptop.assignedTo || !requestIds.includes(laptop.assignedTo.id))
    ).length;
    
    const ownedCleaned = ownedLaptops.filter(laptop => 
      laptop.status !== 'available' && (!laptop.assignedTo || !requestIds.includes(laptop.assignedTo.id))
    ).length;

    totalCleaned = rentalCleaned + additionalCleaned + ownedCleaned;
    
    // Execute cleanup
    cleanupOrphanedLaptops();
    
    // Show result dialog
    if (totalCleaned > 0) {
      setCleanupResult({
        cleaned: totalCleaned,
        message: `${totalCleaned}개의 노트북이 사용 가능 상태로 복원되었습니다.`
      });
    } else {
      setCleanupResult({
        cleaned: 0,
        message: "정리가 필요한 노트북이 없습니다. 모든 데이터가 정상 상태입니다."
      });
    }
    
    setCleanupDialog(true);
  };

  const handleResetAllData = () => {
    resetAllData();
    setResetDialog(true);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>관리자 비밀번호 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-3">
            <p className="text-yellow-800 text-sm">
              관리자 비밀번호 기본값: 3086
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="adminPassword">새 관리자 비밀번호</Label>
              <Input
                id="adminPassword"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmAdminPassword">비밀번호 확인</Label>
              <Input
                id="confirmAdminPassword"
                type="password"
                value={confirmAdminPassword}
                onChange={(e) => setConfirmAdminPassword(e.target.value)}
              />
            </div>
            {adminError && <p className="text-sm text-red-500">{adminError}</p>}
          </div>
          <Button 
            onClick={handleAdminPasswordChange}
            disabled={!adminPassword || !confirmAdminPassword}
          >
            비밀번호 변경
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>일반 사용자 접속 비밀번호 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-3">
            <p className="text-yellow-800 text-sm">
              사용자 접속 비밀번호 기본값: 11111
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="sitePassword">새 접속 비밀번호</Label>
              <Input
                id="sitePassword"
                type="password"
                value={sitePassword}
                onChange={(e) => setSitePassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmSitePassword">비밀번호 확인</Label>
              <Input
                id="confirmSitePassword"
                type="password"
                value={confirmSitePassword}
                onChange={(e) => setConfirmSitePassword(e.target.value)}
              />
            </div>
            {siteError && <p className="text-sm text-red-500">{siteError}</p>}
          </div>
          <Button 
            onClick={handleSitePasswordChange}
            disabled={!sitePassword || !confirmSitePassword}
          >
            비밀번호 변경
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>관리자 관리</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
            <p className="text-blue-800 text-sm">
              관리자는 노트북의 출고 및 입고 관리 권한을 가집니다
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="managerName">관리자 이름</Label>
              <Input
                id="managerName"
                placeholder="관리자 이름"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="managerPassword">비밀번호</Label>
              <Input
                id="managerPassword"
                type="password"
                placeholder="비밀번호"
                value={managerPassword}
                onChange={(e) => setManagerPassword(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="confirmManagerPassword">비밀번호 확인</Label>
              <Input
                id="confirmManagerPassword"
                type="password"
                placeholder="비밀번호 확인"
                value={confirmManagerPassword}
                onChange={(e) => setConfirmManagerPassword(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleAddManager}
              disabled={!managerName || !managerPassword || !confirmManagerPassword}
            >
              관리자 추가
            </Button>
            {managerError && <p className="text-sm text-red-500">{managerError}</p>}
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <h3 className="mb-2 text-sm font-medium">등록된 관리자 목록</h3>
            {managers.length === 0 ? (
              <p className="text-sm text-gray-500">등록된 관리자가 없습니다</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>비밀번호</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {managers.map((manager) => (
                    <TableRow key={manager.id}>
                      <TableCell>{manager.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">
                            {showPasswords[manager.id] 
                              ? manager.password 
                              : "●".repeat(Math.min(manager.password?.length || 0, 8))
                            }
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePasswordVisibility(manager.id)}
                            className="h-6 w-6 p-0"
                          >
                            {showPasswords[manager.id] ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openPasswordChangeDialog(manager.id, manager.name)}
                            className="flex items-center gap-1"
                          >
                            <Key className="h-3 w-3" />
                            비밀번호 변경
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeManager(manager.id)}
                          >
                            삭제
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Password Change Dialog */}
      <Dialog open={passwordChangeDialog.open} onOpenChange={(open) => {
        if (!open) closePasswordChangeDialog();
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>비밀번호 변경</DialogTitle>
            <DialogDescription>
              {passwordChangeDialog.managerName}님의 비밀번호를 변경합니다
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 p-2">
            <div className="space-y-2">
              <Label htmlFor="new-password">새 비밀번호</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="새 비밀번호를 입력하세요"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-new-password">비밀번호 확인</Label>
              <Input
                id="confirm-new-password"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handlePasswordChange();
                  }
                }}
              />
              {passwordChangeError && (
                <p className="text-sm text-red-500">{passwordChangeError}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={closePasswordChangeDialog} variant="outline" className="w-1/2">취소</Button>
              <Button 
                onClick={handlePasswordChange} 
                className="w-1/2"
                disabled={!newPassword || !confirmNewPassword}
              >
                변경
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <UserRegistrationManager />
      
      {/* Data Cleanup Result Dialog */}
      <Dialog open={cleanupDialog} onOpenChange={setCleanupDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>✅ 데이터 정리 완료</DialogTitle>
            <DialogDescription>
              {cleanupResult.message}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center p-4">
            <Button onClick={() => setCleanupDialog(false)} className="w-full">
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Reset All Data Dialog */}
      <Dialog open={resetDialog} onOpenChange={setResetDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>✅ 데이터 초기화 완료</DialogTitle>
            <DialogDescription>
              모든 노트북과 요청 데이터가 초기 상태로 복원되었습니다.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center p-4">
            <Button onClick={() => setResetDialog(false)} className="w-full">
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* 데이터 관리 */}
      <Card>
        <CardHeader>
          <CardTitle>데이터 관리</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={handleDataCleanup}
              variant="outline"
              className="flex-1"
            >
              데이터 정리
            </Button>
            <Button 
              onClick={handleResetAllData}
              variant="destructive"
              className="flex-1"
            >
              전체 초기화
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            데이터 정리: 요청 없이 점유된 노트북을 사용 가능으로 복원<br/>
            전체 초기화: 모든 노트북과 요청을 초기 상태로 복원
          </p>
        </CardContent>
      </Card>
    </div>
  );
}