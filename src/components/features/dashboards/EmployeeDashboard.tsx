import { SessionPayload } from '@/src/core/services/auth.service';
import React from 'react';

interface DashboardProps {
  user: SessionPayload;
}

export function EmployeeDashboard({ user }: DashboardProps) {
  // Dummy Data
  const leaveBalances = { annual: 14, sick: 5, casual: 3 };
  
  const upcomingHolidays = [
    { date: "Dec 25", name: "Christmas Day" },
    { date: "Jan 1", name: "New Year's Day" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Workspace</h1>
        <p className="text-slate-500">Welcome back, {user.userId || 'Donna'}.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Balances & Actions */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">Leave Balance</h3>
              <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                Apply Leave
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-slate-50 rounded">
                <p className="text-2xl font-bold text-slate-800">{leaveBalances.annual}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Annual</p>
              </div>
              <div className="p-4 bg-slate-50 rounded">
                <p className="text-2xl font-bold text-slate-800">{leaveBalances.sick}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Sick</p>
              </div>
              <div className="p-4 bg-slate-50 rounded">
                <p className="text-2xl font-bold text-slate-800">{leaveBalances.casual}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Casual</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Payslips</h3>
            <div className="flex items-center justify-between p-3 border rounded mb-2">
              <div>
                <p className="font-medium text-sm">November 2026</p>
                <p className="text-xs text-slate-500">Paid on Nov 28</p>
              </div>
              <button className="text-blue-600 text-sm font-medium hover:underline">Download PDF</button>
            </div>
          </div>
        </div>

        {/* Right Column: Information */}
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900 text-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold mb-2">My Profile</h3>
            <div className="text-sm text-slate-300 space-y-2">
              <p><span className="text-slate-500 block text-xs">Employee Code</span> EVO-ENG-002</p>
              <p><span className="text-slate-500 block text-xs">Department</span> Engineering</p>
              <p><span className="text-slate-500 block text-xs">Reporting To</span> Kethaka Ranasinghe (HOD)</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Upcoming Holidays</h3>
            <ul className="space-y-3">
              {upcomingHolidays.map((holiday, i) => (
                <li key={i} className="flex justify-between items-center text-sm border-b pb-2 last:border-0 last:pb-0">
                  <span className="font-medium text-slate-700">{holiday.name}</span>
                  <span className="text-slate-500">{holiday.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}