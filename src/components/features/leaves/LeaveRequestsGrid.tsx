'use client';

import { useState } from "react";

interface LeaveRequest {
  id: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export function LeaveRequestsGrid({ userRole }: { userRole: string }) {
  const [activeTab, setActiveTab] = useState<'PENDING' | 'HISTORY'>('PENDING');

  // Dummy Data representing what you'll eventually fetch from Prisma
  const dummyRequests: LeaveRequest[] = [
    {
      id: "req-001",
      employeeName: "Donna Paulsen",
      type: "Annual Leave",
      startDate: "2026-12-20",
      endDate: "2026-12-24",
      status: "PENDING",
    },
    {
      id: "req-002",
      employeeName: "Mike Ross",
      type: "Sick Leave",
      startDate: "2026-11-10",
      endDate: "2026-11-11",
      status: "APPROVED",
    },
  ];

  // Filter logic based on the active tab
  const filteredRequests = dummyRequests.filter(req => 
    activeTab === 'PENDING' ? req.status === 'PENDING' : req.status !== 'PENDING'
  );

  const canApprove = ['HR_DIRECTOR', 'HR_MANAGER', 'HOD'].includes(userRole);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header & Controls */}
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('PENDING')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'PENDING' 
                ? 'bg-slate-900 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pending Requests
          </button>
          <button 
            onClick={() => setActiveTab('HISTORY')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'HISTORY' 
                ? 'bg-slate-900 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            History
          </button>
        </div>

        {/* Everyone gets an Apply button, but you could restrict this if needed */}
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
          + Request Leave
        </button>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-6 py-3 font-medium">Employee</th>
              <th className="px-6 py-3 font-medium">Leave Type</th>
              <th className="px-6 py-3 font-medium">Dates</th>
              <th className="px-6 py-3 font-medium">Status</th>
              {canApprove && <th className="px-6 py-3 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{req.employeeName}</td>
                  <td className="px-6 py-4 text-slate-600">{req.type}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {req.startDate} to {req.endDate}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      req.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  {canApprove && (
                    <td className="px-6 py-4 text-right">
                      {req.status === 'PENDING' ? (
                        <div className="flex justify-end gap-2">
                          <button className="text-green-600 font-medium hover:underline">Approve</button>
                          <button className="text-red-600 font-medium hover:underline">Deny</button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">Processed</span>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={canApprove ? 5 : 4} className="px-6 py-12 text-center text-slate-500">
                  No {activeTab.toLowerCase()} requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}