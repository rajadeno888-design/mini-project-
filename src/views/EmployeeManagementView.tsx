import React, { useState } from 'react';
import { useLeave } from '../context/LeaveContext';
import { Employee, LeaveCategory } from '../types';
import {
  Users,
  UserPlus,
  Search,
  Sliders,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  Calendar,
  X,
  FileText,
} from 'lucide-react';

export const EmployeeManagementView: React.FC = () => {
  const { employees, addEmployee, updateEmployeeBalance, leaveRequests } = useLeave();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  const [viewHistoryEmp, setViewHistoryEmp] = useState<Employee | null>(null);

  // New Employee Form State
  const [newCode, setNewCode] = useState(`EMP-${100 + employees.length + 1}`);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('+91 98765 00000');
  const [newDept, setNewDept] = useState('Software Engineering');
  const [newDesignation, setNewDesignation] = useState('');

  // Edit Quota State
  const [editCasualTotal, setEditCasualTotal] = useState(12);
  const [editSickTotal, setEditSickTotal] = useState(10);
  const [editEarnedTotal, setEditEarnedTotal] = useState(15);
  const [editEmergencyTotal, setEditEmergencyTotal] = useState(5);

  const departments = ['All', 'Software Engineering', 'Product Design', 'Quality Assurance', 'Marketing', 'Cloud Infrastructure', 'Human Resources'];

  const filteredEmployees = employees.filter((emp) => {
    const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleOpenEditQuota = (emp: Employee) => {
    setEditingEmp(emp);
    setEditCasualTotal(emp.leaveBalance.casual.total);
    setEditSickTotal(emp.leaveBalance.sick.total);
    setEditEarnedTotal(emp.leaveBalance.earned.total);
    setEditEmergencyTotal(emp.leaveBalance.emergency.total);
  };

  const handleSaveQuota = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmp) return;

    updateEmployeeBalance(editingEmp.id, {
      ...editingEmp.leaveBalance,
      casual: { ...editingEmp.leaveBalance.casual, total: Number(editCasualTotal) },
      sick: { ...editingEmp.leaveBalance.sick, total: Number(editSickTotal) },
      earned: { ...editingEmp.leaveBalance.earned, total: Number(editEarnedTotal) },
      emergency: { ...editingEmp.leaveBalance.emergency, total: Number(editEmergencyTotal) },
    });

    setEditingEmp(null);
  };

  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newDesignation.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    addEmployee({
      employeeCode: newCode.trim(),
      name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim(),
      role: 'employee',
      department: newDept,
      designation: newDesignation.trim(),
      joiningDate: new Date().toISOString().split('T')[0],
      leaveBalance: {
        casual: { total: 12, used: 0 },
        sick: { total: 10, used: 0 },
        earned: { total: 15, used: 0 },
        emergency: { total: 5, used: 0 },
        maternityPaternity: { total: 15, used: 0 },
      },
    });

    setIsAddModalOpen(false);
    setNewName('');
    setNewEmail('');
    setNewDesignation('');
    setNewCode(`EMP-${100 + employees.length + 2}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Employee Directory & Quotas</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage company staff profiles, leave allocations, and individual leave usage.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded shadow-sm transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Employee</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, code, designation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-700"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-600">Department:</span>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-700"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department & Role</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Casual (CL)</th>
                <th className="py-3 px-4">Sick (SL)</th>
                <th className="py-3 px-4">Earned (EL)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredEmployees.map((emp) => {
                const clAvail = emp.leaveBalance.casual.total - emp.leaveBalance.casual.used;
                const slAvail = emp.leaveBalance.sick.total - emp.leaveBalance.sick.used;
                const elAvail = emp.leaveBalance.earned.total - emp.leaveBalance.earned.used;

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Employee Profile */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{emp.name}</div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                        {emp.employeeCode} • Joined {emp.joiningDate}
                      </div>
                    </td>

                    {/* Department & Role */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{emp.department}</div>
                      <div className="text-[11px] text-slate-500">{emp.designation}</div>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-4 text-slate-600">
                      <div>{emp.email}</div>
                      <div className="text-[11px] text-slate-500">{emp.phone}</div>
                    </td>

                    {/* CL Balance */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900">{clAvail}</span>
                      <span className="text-[11px] text-slate-500"> / {emp.leaveBalance.casual.total}</span>
                    </td>

                    {/* SL Balance */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900">{slAvail}</span>
                      <span className="text-[11px] text-slate-500"> / {emp.leaveBalance.sick.total}</span>
                    </td>

                    {/* EL Balance */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900">{elAvail}</span>
                      <span className="text-[11px] text-slate-500"> / {emp.leaveBalance.earned.total}</span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-1">
                      <button
                        onClick={() => handleOpenEditQuota(emp)}
                        className="px-2.5 py-1 text-[11px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                        title="Adjust annual quota"
                      >
                        Adjust Quota
                      </button>

                      <button
                        onClick={() => setViewHistoryEmp(emp)}
                        className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                        title="View employee leave history"
                      >
                        History
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Quota Modal */}
      {editingEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-md bg-white border border-slate-300 rounded-lg p-5 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-base font-bold text-slate-900">
                Adjust Leave Quota: {editingEmp.name}
              </h3>
              <button onClick={() => setEditingEmp(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuota} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Casual Leave Total Entitlement
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={editCasualTotal}
                  onChange={(e) => setEditCasualTotal(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Sick Leave Total Entitlement
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={editSickTotal}
                  onChange={(e) => setEditSickTotal(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Earned Leave Total Entitlement
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={editEarnedTotal}
                  onChange={(e) => setEditEarnedTotal(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Emergency Leave Total Entitlement
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={editEmergencyTotal}
                  onChange={(e) => setEditEmergencyTotal(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingEmp(null)}
                  className="px-3 py-1.5 text-xs text-slate-700 bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs text-white bg-blue-700 hover:bg-blue-800 rounded font-semibold"
                >
                  Save Quota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-lg bg-white border border-slate-300 rounded-lg p-5 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-base font-bold text-slate-900">Add New Organization Employee</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEmployeeSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Employee Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Meera Joshi"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="meera.joshi@apextech.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                  >
                    {departments.filter((d) => d !== 'All').map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Designation <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Backend Developer"
                    value={newDesignation}
                    onChange={(e) => setNewDesignation(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-700 bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs text-white bg-blue-700 hover:bg-blue-800 rounded font-semibold"
                >
                  Create Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employee History Modal */}
      {viewHistoryEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-2xl bg-white border border-slate-300 rounded-lg p-5 shadow-xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Leave History: {viewHistoryEmp.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {viewHistoryEmp.employeeCode} • {viewHistoryEmp.department} • {viewHistoryEmp.designation}
                </p>
              </div>
              <button
                onClick={() => setViewHistoryEmp(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Requests list */}
            {(() => {
              const empRequests = leaveRequests.filter((r) => r.employeeId === viewHistoryEmp.id);
              if (empRequests.length === 0) {
                return (
                  <p className="py-6 text-center text-xs text-slate-500">
                    No leave requests on record for this employee.
                  </p>
                );
              }
              return (
                <div className="divide-y divide-slate-100 space-y-2">
                  {empRequests.map((r) => (
                    <div key={r.id} className="pt-2 text-xs flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">{r.leaveType}</span>
                          <span className="font-mono text-slate-400 text-[10px]">({r.id})</span>
                        </div>
                        <div className="text-slate-600 text-[11px] mt-0.5">
                          {r.startDate} to {r.endDate} ({r.daysCount} days • {r.durationType})
                        </div>
                        <p className="text-slate-600 mt-1 italic">"{r.reason}"</p>
                        {r.hrRemarks && (
                          <div className="text-[11px] text-slate-500 mt-1">HR Note: {r.hrRemarks}</div>
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          r.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-800'
                            : r.status === 'Pending'
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-rose-50 text-rose-800'
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })()}

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setViewHistoryEmp(null)}
                className="px-4 py-1.5 text-xs text-white bg-slate-900 rounded font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
