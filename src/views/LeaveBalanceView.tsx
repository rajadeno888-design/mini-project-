import React, { useState } from 'react';
import { useLeave } from '../context/LeaveContext';
import { LeaveCategory } from '../types';
import { PieChart, Calendar, CalendarPlus, CheckCircle2, Info } from 'lucide-react';
import { ActiveTab } from '../components/Sidebar';

interface LeaveBalanceViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const LeaveBalanceView: React.FC<LeaveBalanceViewProps> = ({ onNavigate }) => {
  const { currentUser, leaveRequests } = useLeave();
  const [selectedCategory, setSelectedCategory] = useState<LeaveCategory>('Casual Leave');

  if (!currentUser) return null;

  const categories: {
    category: LeaveCategory;
    key: keyof typeof currentUser.leaveBalance;
    code: string;
    description: string;
    rules: string;
  }[] = [
    {
      category: 'Casual Leave',
      key: 'casual',
      code: 'CL',
      description: 'Used for short personal errands, family commitments, or private matters.',
      rules: 'Max 3 consecutive days at a time. Must inform 24 hours in advance.',
    },
    {
      category: 'Sick Leave',
      key: 'sick',
      code: 'SL',
      description: 'Medical recuperation from illness, clinical doctor visits, or hospitalization.',
      rules: 'Medical certificate mandatory for leaves spanning more than 2 consecutive working days.',
    },
    {
      category: 'Earned Leave',
      key: 'earned',
      code: 'EL',
      description: 'Annual accrued leave for planned vacations, holidays, and extended rest.',
      rules: 'Requires minimum 7 days prior approval. Unused earned leaves are subject to carry-over.',
    },
    {
      category: 'Emergency Leave',
      key: 'emergency',
      code: 'EML',
      description: 'Unforeseen urgent household calamities, accidents, or bereavement.',
      rules: 'Can be regularized within 48 hours of occurrence with appropriate reason.',
    },
    {
      category: 'Maternity / Paternity Leave',
      key: 'maternityPaternity',
      code: 'MPL',
      description: 'Special statutory entitlement for childbirth and infant care.',
      rules: 'As per organizational policy guidelines and statutory labor standards.',
    },
  ];

  // Leave history specifically for the selected category
  const categoryHistory = leaveRequests.filter(
    (r) => r.employeeId === currentUser.id && r.leaveType === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Leave Balance & Entitlements</h1>
          <p className="text-xs text-slate-500 mt-1">
            Annual quota allocations, consumption history, and remaining balances for {currentUser.name} ({currentUser.employeeCode}).
          </p>
        </div>

        <button
          onClick={() => onNavigate('emp-apply')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded shadow-sm transition-colors"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((item) => {
          const balance = currentUser.leaveBalance[item.key];
          const available = balance.total - balance.used;
          const percentage = Math.min(100, Math.round((balance.used / balance.total) * 100));
          const isSelected = selectedCategory === item.category;

          return (
            <div
              key={item.category}
              onClick={() => setSelectedCategory(item.category)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-white border-blue-700 ring-2 ring-blue-700/20 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                    {item.code}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900">{item.category}</h3>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    available > 0
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {available} Available
                </span>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">{available}</span>
                <span className="text-xs text-slate-500">/ {balance.total} Total Entitlement</span>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>Consumed: {balance.used} days</span>
                  <span>{percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-700 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Selected Category Detail & Consumption Audit */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-blue-700" />
            <h2 className="text-sm font-bold text-slate-900">
              Audit Log: {selectedCategory} Requests
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            {categoryHistory.length} record(s) logged
          </span>
        </div>

        {categoryHistory.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            <p>No leave requests recorded for {selectedCategory} this year.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {categoryHistory.map((req) => (
              <div key={req.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">
                      {req.startDate} to {req.endDate}
                    </span>
                    <span className="text-slate-500 font-mono">({req.id})</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                      {req.daysCount} {req.daysCount === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1 italic">"{req.reason}"</p>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      req.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : req.status === 'Pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {req.status}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">Applied: {req.appliedOn}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
