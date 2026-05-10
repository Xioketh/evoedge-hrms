import { SessionPayload } from '@/src/core/services/auth.service';
import React from 'react';

interface DashboardProps {
  user: SessionPayload;
}

export function HodDashboard({ user }: DashboardProps) {
  // Dummy Data
  const teamPendingLeaves = [
    { id: 1, name: "Donna Paulsen", dates: "Nov 15 - Nov 16", type: "Annual" },
    { id: 2, name: "Junior Dev 2", dates: "Nov 20", type: "Sick" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Department Overview</h1>
          <p className="text-slate-500">Managing: Engineering Department</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 font-medium">Team Size</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 font-medium">On Leave Today</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">1</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 font-medium">Pending Approvals</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{teamPendingLeaves.length}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Team Leave Requests</h3>
        {teamPendingLeaves.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="pb-2 font-medium">Employee</th>
                <th className="pb-2 font-medium">Dates</th>
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamPendingLeaves.map((req) => (
                <tr key={req.id} className="border-b last:border-0">
                  <td className="py-3 font-medium text-slate-800">{req.name}</td>
                  <td className="py-3 text-slate-600">{req.dates}</td>
                  <td className="py-3 text-slate-600">{req.type}</td>
                  <td className="py-3 text-right">
                    <button className="text-green-600 font-medium mr-3 hover:underline">Approve</button>
                    <button className="text-red-600 font-medium hover:underline">Deny</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-slate-500 text-sm">No pending requests from your team.</p>
        )}
      </div>
    </div>
  );
}