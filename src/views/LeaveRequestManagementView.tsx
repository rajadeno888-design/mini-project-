import React, { useState } from 'react';
import { useLeave } from '../context/LeaveContext';
import {
  CheckSquare,
  Check,
  X,
  Search,
  Filter,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  User,
  Info,
} from 'lucide-react';
import { LeaveCategory, LeaveStatus } from '../types';

export const LeaveRequestManagementView: React.FC = () => {
  const { leaveRequests, employees, approveLeave, rejectLeave, currentUser } = useLeave();

  const [statusFilter, setStatusFilter] = useState<string>('Pending');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Single action modals
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [approvalNote, setApprovalNote] = useState('');

  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Selected for batch actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter requests
  const filteredRequests = leaveRequests.filter((r) => {
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesDept = departmentFilter === 'All' || r.department === departmentFilter;
    const matchesType = typeFilter === 'All' || r.leaveType === typeFilter;
    const matchesSearch =
      r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesDept && matchesType && matchesSearch;
  });

  const departments = ['All', 'Software Engineering', 'Product Design', 'Quality Assurance', 'Marketing', 'Cloud Infrastructure', 'Human Resources'];
  const categories = ['All', 'Casual Leave', 'Sick Leave', 'Earned Leave', 'Emergency Leave', 'Maternity / Paternity Leave'];

  const handleConfirmApproval = () => {
    if (approvingId) {
      approveLeave(approvingId, approvalNote.trim() || 'Approved by HR.');
      setApprovingId(null);
      setApprovalNote('');
    }
  };

  const handleConfirmRejection = () => {
    if (rejectingId) {
      if (!rejectReason.trim()) {
        alert('Please provide a reason for the rejection.');
        return;
      }
      rejectLeave(rejectingId, rejectReason.trim());
      setRejectingId(null);
      setRejectReason('');
    }
  };

  const handleBatchApprove = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Approve all ${selectedIds.length} selected pending leave requests?`)) {
      selectedIds.forEach((id) => {
        approveLeave(id, 'Batch approved by HR.');
      });
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Leave Request Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review, approve, or reject employee leave requests with audit notes and balance verification.
          </p>
        </div>

        {selectedIds.length > 0 && (
          <button
            onClick={handleBatchApprove}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded shadow-sm transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Batch Approve ({selectedIds.length})</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm space-y-3">
        {/* Status Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-100">
          <span className="text-xs font-semibold text-slate-500 mr-2 uppercase tracking-wider">
            Status:
          </span>
          {['Pending', 'Approved', 'Rejected', 'All'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Search & Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by employee or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-700"
            />
          </div>

          <div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
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
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-700"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            <p className="font-semibold text-slate-700">No leave requests match the criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length > 0 &&
                        selectedIds.length ===
                          filteredRequests.filter((r) => r.status === 'Pending').length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(
                            filteredRequests
                              .filter((r) => r.status === 'Pending')
                              .map((r) => r.id)
                          );
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                      disabled={filteredRequests.filter((r) => r.status === 'Pending').length === 0}
                      className="rounded"
                    />
                  </th>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Leave Details</th>
                  <th className="py-3 px-4">Dates & Duration</th>
                  <th className="py-3 px-4">Reason & AI Classification</th>
                  <th className="py-3 px-4">Status & Audit</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRequests.map((req) => {
                  const emp = employees.find((e) => e.id === req.employeeId);

                  return (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Checkbox */}
                      <td className="py-3 px-4">
                        {req.status === 'Pending' ? (
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(req.id)}
                            onChange={() => toggleSelect(req.id)}
                            className="rounded"
                          />
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Employee */}
                      <td className="py-3 px-4 min-w-[160px]">
                        <div className="font-bold text-slate-900">{req.employeeName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {req.employeeCode} • {req.department}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 min-w-[140px]">
                        <div className="font-semibold text-slate-800">{req.leaveType}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Req ID: {req.id}
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="py-3 px-4 min-w-[160px]">
                        <div className="font-medium text-slate-900">
                          {req.startDate} to {req.endDate}
                        </div>
                        <div className="text-[11px] text-slate-600 font-semibold mt-0.5">
                          {req.daysCount} {req.daysCount === 1 ? 'day' : 'days'} • {req.durationType}
                        </div>
                      </td>

                      {/* Reason & AI */}
                      <td className="py-3 px-4 min-w-[200px] max-w-xs text-slate-700">
                        <p className="line-clamp-2 italic">"{req.reason}"</p>
                        {req.aiSuggested && (
                          <div className="mt-1 flex items-center gap-1 text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 w-fit">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>AI Verified: {req.aiExplanation}</span>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 min-w-[140px]">
                        {req.status === 'Approved' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Approved
                          </span>
                        )}
                        {req.status === 'Pending' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertCircle className="w-3 h-3" /> Pending Review
                          </span>
                        )}
                        {req.status === 'Rejected' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3 h-3" /> Rejected
                          </span>
                        )}
                        {req.hrRemarks && (
                          <div className="text-[10px] text-slate-500 mt-1 max-w-[180px] truncate">
                            Note: {req.hrRemarks}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                        {req.status === 'Pending' ? (
                          <>
                            <button
                              onClick={() => {
                                setApprovingId(req.id);
                                setApprovalNote('');
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded transition-colors inline-flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => {
                                setRejectingId(req.id);
                                setRejectReason('');
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded transition-colors inline-flex items-center gap-1"
                            >
                              <X className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          </>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Decided</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {approvingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-md bg-white border border-slate-300 rounded-lg p-5 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Approve Leave Request</h3>
            <p className="text-xs text-slate-600">
              The leave balance will be automatically adjusted for the employee.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Approval Note / HR Remarks
              </label>
              <input
                type="text"
                value={approvalNote}
                onChange={(e) => setApprovalNote(e.target.value)}
                placeholder="e.g. Approved. Sprint coverage confirmed."
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setApprovingId(null)}
                className="px-3 py-1.5 text-xs text-slate-700 bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApproval}
                className="px-4 py-1.5 text-xs text-white bg-emerald-700 hover:bg-emerald-800 rounded font-semibold"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-md bg-white border border-slate-300 rounded-lg p-5 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Reject Leave Request</h3>
            <p className="text-xs text-slate-600">
              Provide a clear reason for rejecting the leave application.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Rejection Reason <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Critical release sprint deadline during this duration."
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingId(null)}
                className="px-3 py-1.5 text-xs text-slate-700 bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRejection}
                className="px-4 py-1.5 text-xs text-white bg-rose-700 hover:bg-rose-800 rounded font-semibold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
