import React, { useState } from 'react';
import { useLeave } from '../context/LeaveContext';
import {
  History,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  Sparkles,
  FileText,
} from 'lucide-react';

export const LeaveHistoryView: React.FC = () => {
  const { leaveRequests, employees } = useLeave();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const departments = ['All', 'Software Engineering', 'Product Design', 'Quality Assurance', 'Marketing', 'Cloud Infrastructure', 'Human Resources'];
  const categories = ['All', 'Casual Leave', 'Sick Leave', 'Earned Leave', 'Emergency Leave', 'Maternity / Paternity Leave'];
  const statuses = ['All', 'Approved', 'Rejected', 'Pending', 'Cancelled'];

  const filteredHistory = leaveRequests.filter((r) => {
    const matchesDept = selectedDept === 'All' || r.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || r.status === selectedStatus;
    const matchesType = selectedType === 'All' || r.leaveType === selectedType;
    const matchesSearch =
      r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesDept && matchesStatus && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Organization Leave History & Audit</h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete historical record of all processed and recorded leave requests across company departments.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search employee, ID, reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-700"
            />
          </div>

          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-700"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d === 'All' ? 'All Departments' : d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-700"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-700"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s === 'All' ? 'All Statuses' : s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 pt-1 flex justify-between">
          <span>Showing {filteredHistory.length} of {leaveRequests.length} total entries</span>
          <span>Fiscal Year 2026</span>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        {filteredHistory.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p>No leave records match the selected filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Request ID</th>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Duration & Dates</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Decision & Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredHistory.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-900 whitespace-nowrap">
                      <div>{req.id}</div>
                      <div className="text-[10px] text-slate-500 font-sans mt-0.5">
                        Applied: {req.appliedOn}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{req.employeeName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {req.employeeCode} • {req.department}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{req.leaveType}</div>
                      {req.aiSuggested && (
                        <span className="text-[10px] text-blue-700 inline-flex items-center gap-1 font-medium mt-0.5">
                          <Sparkles className="w-2.5 h-2.5" /> AI Assisted
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">
                        {req.startDate} to {req.endDate}
                      </div>
                      <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                        {req.daysCount} {req.daysCount === 1 ? 'day' : 'days'} • {req.durationType}
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs text-slate-700">
                      <p className="line-clamp-2 italic">"{req.reason}"</p>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {req.status === 'Approved' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Approved
                        </span>
                      )}
                      {req.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertCircle className="w-3 h-3" /> Pending
                        </span>
                      )}
                      {req.status === 'Rejected' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                      {req.status === 'Cancelled' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          Cancelled
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 max-w-xs text-slate-600">
                      {req.hrRemarks ? (
                        <div className="text-[11px] bg-slate-50 p-1.5 rounded border border-slate-200">
                          <span className="font-semibold text-slate-800">
                            {req.reviewedBy || 'HR'}:
                          </span>{' '}
                          {req.hrRemarks}
                          {req.reviewedOn && (
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              On: {req.reviewedOn}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
