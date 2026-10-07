import React, { useState } from 'react';
import { useLeave } from '../context/LeaveContext';
import {
  FileBarChart,
  Download,
  Printer,
  Calendar,
  Building,
  CheckCircle2,
  Users,
  Percent,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { employees, leaveRequests } = useLeave();

  const [selectedPeriod, setSelectedPeriod] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [showPrintModal, setShowPrintModal] = useState(false);

  const departments = ['All', 'Software Engineering', 'Product Design', 'Quality Assurance', 'Marketing', 'Cloud Infrastructure', 'Human Resources'];

  // Filter requests for reporting
  const filteredRequests = leaveRequests.filter((r) => {
    const matchesDept = selectedDept === 'All' || r.department === selectedDept;
    return matchesDept;
  });

  const approvedRequests = filteredRequests.filter((r) => r.status === 'Approved');
  const totalDaysTaken = approvedRequests.reduce((acc, r) => acc + r.daysCount, 0);

  // Leave category totals
  const categoryTotals: Record<string, number> = {
    'Casual Leave': 0,
    'Sick Leave': 0,
    'Earned Leave': 0,
    'Emergency Leave': 0,
    'Maternity / Paternity Leave': 0,
  };

  approvedRequests.forEach((r) => {
    if (categoryTotals[r.leaveType] !== undefined) {
      categoryTotals[r.leaveType] += r.daysCount;
    }
  });

  // Department totals
  const deptSummary: Record<string, { employeesCount: number; approvedDays: number; pendingDays: number }> = {};
  employees.forEach((emp) => {
    if (selectedDept === 'All' || emp.department === selectedDept) {
      if (!deptSummary[emp.department]) {
        deptSummary[emp.department] = { employeesCount: 0, approvedDays: 0, pendingDays: 0 };
      }
      deptSummary[emp.department].employeesCount += 1;
    }
  });

  filteredRequests.forEach((r) => {
    if (deptSummary[r.department]) {
      if (r.status === 'Approved') {
        deptSummary[r.department].approvedDays += r.daysCount;
      } else if (r.status === 'Pending') {
        deptSummary[r.department].pendingDays += r.daysCount;
      }
    }
  });

  // Export to CSV function
  const handleExportCSV = () => {
    const headers = [
      'Request ID',
      'Employee Code',
      'Employee Name',
      'Department',
      'Leave Type',
      'Start Date',
      'End Date',
      'Days Count',
      'Duration Type',
      'Status',
      'Reason',
      'Applied On',
      'Reviewed By',
    ];

    const rows = filteredRequests.map((r) => [
      r.id,
      r.employeeCode,
      `"${r.employeeName.replace(/"/g, '""')}"`,
      `"${r.department.replace(/"/g, '""')}"`,
      r.leaveType,
      r.startDate,
      r.endDate,
      r.daysCount,
      r.durationType,
      r.status,
      `"${r.reason.replace(/"/g, '""')}"`,
      r.appliedOn,
      `"${(r.reviewedBy || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ApexTech_Leave_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Leave Analytics & Summary Reports</h1>
          <p className="text-xs text-slate-500 mt-1">
            Aggregate attendance metrics, department utilization rates, and formal export documentation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPrintModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print View</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export to CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-600">Department:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-700"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === 'All' ? 'All Departments' : d}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-600">Timeframe:</span>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-700"
          >
            <option value="All">Fiscal Year 2026 (All)</option>
            <option value="CurrentMonth">October 2026 (Current Month)</option>
            <option value="Q3">Q3 2026</option>
          </select>
        </div>
      </div>

      {/* High-Level Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Approved Days Taken
          </span>
          <div className="mt-2 text-2xl font-bold text-slate-900">{totalDaysTaken} Days</div>
          <p className="text-[11px] text-slate-500 mt-1">Across sanctioned leave requests</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Approved Requests
          </span>
          <div className="mt-2 text-2xl font-bold text-emerald-800">{approvedRequests.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Successfully sanctioned leaves</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Pending in Queue
          </span>
          <div className="mt-2 text-2xl font-bold text-amber-700">
            {filteredRequests.filter((r) => r.status === 'Pending').length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Awaiting managerial review</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Avg Leave Per Employee
          </span>
          <div className="mt-2 text-2xl font-bold text-blue-900">
            {employees.length > 0 ? (totalDaysTaken / employees.length).toFixed(1) : 0} Days
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Utilization per active member</p>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
            Leave Consumption by Category
          </h2>

          <div className="space-y-3">
            {Object.entries(categoryTotals).map(([cat, count]) => {
              const pct = totalDaysTaken > 0 ? Math.round((count / totalDaysTaken) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-700">
                    <span className="font-medium">{cat}</span>
                    <span className="font-bold text-slate-900">
                      {count} Days ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-700 h-2 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Summary Table */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
            Departmental Utilization Table
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Staff</th>
                  <th className="py-2.5 px-3">Approved Days</th>
                  <th className="py-2.5 px-3">Pending Days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.entries(deptSummary).map(([dept, data]) => (
                  <tr key={dept}>
                    <td className="py-2 px-3 font-medium text-slate-900">{dept}</td>
                    <td className="py-2 px-3 text-slate-600">{data.employeesCount}</td>
                    <td className="py-2 px-3 font-bold text-emerald-800">{data.approvedDays}</td>
                    <td className="py-2 px-3 font-semibold text-amber-700">{data.pendingDays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Print / Viva Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-3xl bg-white border border-slate-300 rounded-lg p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="text-center border-b border-slate-300 pb-4">
              <h2 className="text-lg font-bold text-slate-900 uppercase">Apex Technologies Ltd</h2>
              <p className="text-xs text-slate-600">Official Organizational Leave Summary Report</p>
              <div className="text-[10px] text-slate-400 mt-1">
                Generated On: {new Date().toLocaleDateString()} • B.Sc. Computer Science Mini Project
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs border border-slate-200 p-3 bg-slate-50 rounded">
              <div>
                <strong>Total Employees:</strong> {employees.length}
              </div>
              <div>
                <strong>Approved Leave Days:</strong> {totalDaysTaken}
              </div>
              <div>
                <strong>Department Filter:</strong> {selectedDept}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase">Sanctioned Leaves Record</h4>
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="p-2">ID</th>
                    <th className="p-2">Employee</th>
                    <th className="p-2">Category</th>
                    <th className="p-2">Dates</th>
                    <th className="p-2">Days</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {approvedRequests.slice(0, 8).map((r) => (
                    <tr key={r.id}>
                      <td className="p-2 font-mono">{r.id}</td>
                      <td className="p-2 font-semibold">{r.employeeName}</td>
                      <td className="p-2">{r.leaveType}</td>
                      <td className="p-2">
                        {r.startDate} to {r.endDate}
                      </td>
                      <td className="p-2 font-bold">{r.daysCount}</td>
                      <td className="p-2 text-emerald-800 font-semibold">{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-xs">
              <span className="text-slate-500 italic">Prepared for Academic Viva & Evaluation</span>
              <div className="space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-blue-700 text-white rounded font-medium"
                >
                  Trigger System Print
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
