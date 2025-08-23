"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLaptopContext } from "@/contexts/LaptopContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function LaptopManager() {
  const { rentalLaptops, additionalLaptops, ownedLaptops, addLaptop, deleteLaptop } = useLaptopContext();
  const [rentalCount, setRentalCount] = useState<string>("1");
  const [additionalCount, setAdditionalCount] = useState<string>("1");
  const [ownedCount, setOwnedCount] = useState<string>("1");
  
  const handleAddRentalLaptops = () => {
    const count = parseInt(rentalCount);
    if (count > 0) {
      addLaptop('rental', count);
      setRentalCount("1");
    }
  };
  
  const handleAddAdditionalLaptops = () => {
    const count = parseInt(additionalCount);
    if (count > 0) {
      addLaptop('additional', count);
      setAdditionalCount("1");
    }
  };
  
  const handleAddOwnedLaptops = () => {
    const count = parseInt(ownedCount);
    if (count > 0) {
      addLaptop('owned', count);
      setOwnedCount("1");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>노트북 관리</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="rental">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rental">랜탈노트북</TabsTrigger>
            <TabsTrigger value="additional">추가노트북</TabsTrigger>
            <TabsTrigger value="owned">보유노트북</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rental" className="mt-4">
            <div className="flex items-center gap-4 mb-4">
              <Input
                type="number"
                min="1"
                value={rentalCount}
                onChange={(e) => setRentalCount(e.target.value)}
                className="w-24"
              />
              <Button onClick={handleAddRentalLaptops}>랜탈노트북 추가</Button>
            </div>
            
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>번호</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="w-[100px]">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rentalLaptops.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-gray-500">
                        등록된 랜탈노트북이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    rentalLaptops
                      .sort((a, b) => a.id - b.id)
                      .map((laptop) => (
                        <TableRow key={`rental-${laptop.id}`}>
                          <TableCell className="font-medium">{laptop.id}</TableCell>
                          <TableCell>
                            {laptop.status === 'available' ? (
                              <span className="text-green-600">사용가능</span>
                            ) : laptop.status === 'in-use' ? (
                              <span className="text-amber-600">사용중</span>
                            ) : (
                              <span className="text-gray-500">유지보수</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => deleteLaptop('rental', laptop.id)}
                              disabled={laptop.status === 'in-use'}
                            >
                              삭제
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="additional" className="mt-4">
            <div className="flex items-center gap-4 mb-4">
              <Input
                type="number"
                min="1"
                value={additionalCount}
                onChange={(e) => setAdditionalCount(e.target.value)}
                className="w-24"
              />
              <Button onClick={handleAddAdditionalLaptops}>추가노트북 추가</Button>
            </div>
            
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>번호</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="w-[100px]">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {additionalLaptops.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-gray-500">
                        등록된 추가노트북이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    additionalLaptops
                      .sort((a, b) => a.id - b.id)
                      .map((laptop) => (
                        <TableRow key={`additional-${laptop.id}`}>
                          <TableCell className="font-medium">{laptop.id}</TableCell>
                          <TableCell>
                            {laptop.status === 'available' ? (
                              <span className="text-green-600">사용가능</span>
                            ) : laptop.status === 'in-use' ? (
                              <span className="text-amber-600">사용중</span>
                            ) : (
                              <span className="text-gray-500">유지보수</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => deleteLaptop('additional', laptop.id)}
                              disabled={laptop.status === 'in-use'}
                            >
                              삭제
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="owned" className="mt-4">
            <div className="flex items-center gap-4 mb-4">
              <Input
                type="number"
                min="1"
                value={ownedCount}
                onChange={(e) => setOwnedCount(e.target.value)}
                className="w-24"
              />
              <Button onClick={handleAddOwnedLaptops}>보유노트북 추가</Button>
            </div>
            
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>번호</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="w-[100px]">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ownedLaptops.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-gray-500">
                        등록된 보유노트북이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    ownedLaptops
                      .sort((a, b) => a.id - b.id)
                      .map((laptop) => (
                        <TableRow key={`owned-${laptop.id}`}>
                          <TableCell className="font-medium">{laptop.id}</TableCell>
                          <TableCell>
                            {laptop.status === 'available' ? (
                              <span className="text-green-600">사용가능</span>
                            ) : laptop.status === 'in-use' ? (
                              <span className="text-amber-600">사용중</span>
                            ) : (
                              <span className="text-gray-500">유지보수</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => deleteLaptop('owned', laptop.id)}
                              disabled={laptop.status === 'in-use'}
                            >
                              삭제
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}