import { SessionProps } from '@/src/types/session.types';
import React from 'react';


export function HrDirectorDashboard({ user }: SessionProps) {
  // Dummy Data
  const metrics = [
    { label: "Total Employees", value: "142", trend: "+3 this month" },
    { label: "Open Roles", value: "8", trend: "Active" },
    { label: "Pending Leave Requests", value: "12", trend: "Requires Action" },
    { label: "Monthly Payroll Run", value: "Draft", trend: "Due in 4 days" },
  ];

  const recentActivity = [
    { id: 1, text: "Mike Ross approved leave for Rachel Zane", time: "2 hours ago" },
    { id: 2, text: "New employee Donna Paulsen onboarded", time: "5 hours ago" },
    { id: 3, text: "Finance Department requested budget review", time: "1 day ago" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Director Overview</h1>
          <p className="text-slate-500">Welcome back, {user.userId || 'Sarah'}. Here is the company pulse.</p>
        </div>
        <button className="bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800 transition-colors">
          Generate HR Report
        </button>
      </div>

      {/* High-Level Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 font-medium">{metric.label}</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{metric.value}</p>
            <p className="text-xs text-blue-600 mt-1">{metric.trend}</p>
          </div>
        ))}
      </div>

      {/* Activity & Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Company Activity Stream</h3>
          <ul className="space-y-4">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="flex items-center text-sm border-b pb-2 last:border-0">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="flex-1 text-slate-700">{activity.text}</span>
                <span className="text-slate-400 text-xs">{activity.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
          <div className="flex flex-col gap-3">
            <button className="text-left w-full p-3 border rounded hover:bg-slate-50 transition-colors">
              <span className="font-medium text-slate-800 block">Review Pending Payroll</span>
              <span className="text-xs text-slate-500">Approve the draft for the current month.</span>
            </button>
            <button className="text-left w-full p-3 border rounded hover:bg-slate-50 transition-colors">
              <span className="font-medium text-slate-800 block">Department Analytics</span>
              <span className="text-xs text-slate-500">View headcount and budget distribution.</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}