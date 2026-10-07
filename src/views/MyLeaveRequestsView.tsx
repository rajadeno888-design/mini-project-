import React, { useState } from 'react';
import { useLeave } from '../context/LeaveContext';
import { LeaveStatus, LeaveCategory } from '../types';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  CalendarPlus,
  Sparkles,
  Ban,
  FileText,
} from 'lucide-react';
import { ActiveTab } from '../components/Sidebar';

interface MyLeaveRequestsViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const MyLeaveRequestsView: React.FC<MyLeaveRequestsViewProps> = ({ onNavigate }) => {
  const { currentUser, leaveRequests, cancelLeave } = useLeave();
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  if (!currentUser) return null;

  // Filter requests for current employee
  const myRequests = leaveRequests.filter((r) => r.employeeId === currentUser.id);

  // Apply filters
  const filteredRequests = myRequests.filter((req) => {
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    const matchesSearch =
      req.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCancel = (requestId: string) => {
    if (confirm('Are you sure you want to withdraw this pending leave application?')) {
      cancelLeave(requestId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Leave Applications</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track real-time status of your submitted leave requests (Pending, Approved, Rejected).
          </p>
        </div>

        <button
          onClick={() => onNavigate('emp-apply')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded shadow-sm transition-colors"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>Apply New Leave</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by reason or Request ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-700"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto">
          {['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table / Cards */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No leave requests found</p>
            <p className="mt-1 text-slate-500">
              {searchTerm || statusFilter !== 'All'
                ? 'Try adjusting your search query or status filter.'
                : 'You have not submitted any leave applications yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Request ID</th>
                  <th className="py-3 px-4">Leave Category</th>
                  <th className="py-3 px-4">Duration & Dates</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">HR Remarks</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* ID & Applied Date */}
                    <td className="py-3 px-4 font-mono font-medium text-slate-900 whitespace-nowrap">
                      <div>{req.id}</div>
                      <div className="text-[10px] text-slate-500 font-sans mt-0.5">
                        Applied: {req.appliedOn}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{req.leaveType}</div>
                      {req.aiSuggested && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-blue-700 font-medium mt-0.5">
                          <Sparkles className="w-2.5 h-2.5" /> AI Assisted
                        </span>
                      )}
                    </td>

                    {/* Dates */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">
                        {req.startDate} {req.startDate !== req.endDate ? `to ${req.endDate}` : ''}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {req.daysCount} {req.daysCount === 1 ? 'day' : 'days'} • {req.durationType}
                      </div>
                    </td>

                    {/* Reason */}
                    <td className="py-3 px-4 max-w-xs text-slate-700">
                      <p className="line-clamp-2">{req.reason}</p>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {req.status === 'Approved' && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                        </span>
                      )}
                      {req.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertCircle className="w-3.5 h-3.5" /> Pending HR
                        </span>
                      )}
                      {req.status === 'Rejected' && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle className="w-3.5 h-3.5" /> Rejected
                        </span>
                      )}
                      {req.status === 'Cancelled' && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          Cancelled
                        </span>
                      )}
                    </td>

                    {/* HR Remarks */}
                    <td className="py-3 px-4 max-w-xs text-slate-600">
                      {req.hrRemarks ? (
                        <div className="text-[11px] bg-slate-50 border border-slate-200 p-1.5 rounded">
                          <span className="font-semibold text-slate-800">
                            {req.reviewedBy || 'HR'}:
                          </span>{' '}
                          {req.hrRemarks}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">No remarks yet</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {req.status === 'Pending' && (
                        <button
                          onClick={() => handleCancel(req.id)}
                          className="px-2.5 py-1 text-[11px] text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 font-medium inline-flex items-center gap-1 transition-colors"
                          title="Withdraw this pending application"
                        >
                          <Ban className="w-3 h-3" />
                          <span>Withdraw</span>
                        </button>
                      )}
                      {req.status !== 'Pending' && (
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
