"use client";

import { useLaptopContext } from "@/contexts/LaptopContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DebugDataViewer() {
  const { requests } = useLaptopContext();

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>🔍 Debug: Raw Request Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Total Requests: {requests.length}</h4>
            {requests.map((request, index) => (
              <div key={request.id} className="border p-3 rounded mb-2 text-sm">
                <div><strong>Index:</strong> {index}</div>
                <div><strong>ID:</strong> {request.id}</div>
                <div><strong>User:</strong> {request.userName}</div>
                <div><strong>Laptop Type:</strong> "{request.laptopType}"</div>
                <div><strong>Laptop IDs:</strong> [{request.laptopIds.join(', ')}]</div>
                <div><strong>Status:</strong> {request.status}</div>
                <div><strong>Grade/Round:</strong> {request.grade}급 {request.round}회차</div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <strong>Raw JSON:</strong>
            <pre className="text-xs mt-2 overflow-auto">
              {JSON.stringify(requests, null, 2)}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}