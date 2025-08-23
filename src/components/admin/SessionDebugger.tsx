"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLaptopContext } from "@/contexts/LaptopContext";

export function SessionDebugger() {
  const { sessions, addSession } = useLaptopContext();
  
  // Test function to add a session directly
  const testAddSession = () => {
    const today = new Date().toISOString().split('T')[0];
    console.log("Adding test session");
    addSession({
      grade: 1,
      round: 5,
      startDate: today,
      endDate: today
    });
  };
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Session Debugger</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={testAddSession}>Add Test Session (1급 5회차)</Button>
        <div className="mt-4">
          <h3 className="font-medium">Current Sessions:</h3>
          <pre className="mt-2 bg-gray-100 p-4 rounded text-xs overflow-auto">
            {JSON.stringify(sessions, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}