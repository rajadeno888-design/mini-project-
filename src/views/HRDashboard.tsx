import React, { useState } from 'react';
import { useLeave } from '../context/LeaveContext';
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileBarChart,
  UserCheck,
  Calendar,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  CalendarDays,
  FileText,
  Activity,
} from 'lucide-react';
import { ActiveTab } from '../components/Sidebar';

interface HRDashboardProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const HRDashboard: React.FC<HRDashboardProps> = ({ onNavigate }) => {
  const { employees, leaveRequests, approveLeave, rejectLeave, currentUser } = useLeave();

  // Rejection modal state
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Approval modal state
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [approvalNote, setApprovalNote] = useState('');

  const todayStr = '2026-10-07';

  // Metrics
  const totalEmployees = employees.length;
  const pendingRequests = leaveRequests.filter((r) => r.status === 'Pending');
  const approvedRequests = leaveRequests.filter((r) => r.status === 'Approved');

  // Employees on leave today (matching 2026-10-07)
  const onLeaveToday = leaveRequests.filter(
    (r) => r.status === 'Approved' && r.startDate <= todayStr && r.endDate >= todayStr
  );

  // Department counts
  const deptStats: Record<string, { count: number; leavesTaken: number }> = {};
  employees.forEach((emp) => {
    if (!deptStats[emp.department]) {
      deptStats[emp.department] = { count: 0, leavesTaken: 0 };
    }
    deptStats[emp.department].count += 1;
  });

  leaveRequests
    .filter((r) => r.status === 'Approved')
    .forEach((r) => {
      if (deptStats[r.department]) {
        deptStats[r.department].leavesTaken += r.daysCount;
      }
    });

  // Leave Type Breakdown
  const typeCounts: Record<string, number> = {
    'Casual Leave': 0,
    'Sick Leave': 0,
    'Earned Leave': 0,
    'Emergency Leave': 0,
    'Maternity / Paternity Leave': 0,
  };

  leaveRequests
    .filter((r) => r.status === 'Approved')
    .forEach((r) => {
      if (typeCounts[r.leaveType] !== undefined) {
        typeCounts[r.leaveType] += r.daysCount;
      }
    });

  const totalSanctionedDays = Object.values(typeCounts).reduce((a, b) => a + b, 0) || 1;

  // Monthly trends mock stats
  const monthlyTrends = [
    { month: 'July', days: 6, percentage: 40 },
    { month: 'August', days: 9, percentage: 60 },
    { month: 'September', days: 12, percentage: 80 },
    { month: 'October (Mtd)', days: 15, percentage: 100 },
  ];

  // Upcoming holidays
  const upcomingHolidays = [
    { name: 'Dussehra / Vijayadashami', date: '24 Oct 2026', day: 'Saturday', type: 'Gazetted Holiday' },
    { name: 'Diwali (Deepavali)', date: '12 Nov 2026', day: 'Thursday', type: 'Mandatory Public Holiday' },
    { name: 'Guru Nanak Jayanti', date: '24 Nov 2026', day: 'Tuesday', type: 'Restricted Holiday' },
    { name: 'Christmas Day', date: '25 Dec 2026', day: 'Friday', type: 'Gazetted Holiday' },
  ];

  // Recent HR activity stream
  const recentAuditActivities = [
    {
      actor: 'Anita Desai (HR)',
      action: 'Approved 1 day Casual Leave',
      target: 'Vikram Sethi (EMP-105)',
      time: 'Today at 09:15 AM',
      status: 'Approved',
    },
    {
      actor: 'Anita Desai (HR)',
      action: 'Approved 0.5 day Casual Leave',
      target: 'Priya Patel (EMP-102)',
      time: 'Yesterday at 04:30 PM',
      status: 'Approved',
    },
    {
      actor: 'Anita Desai (HR)',
      action: 'Rejected 3 days Earned Leave',
      target: 'Rahul Sharma (EMP-101)',
      time: '26 Sep 2026',
      status: 'Rejected',
    },
    {
      actor: 'System Admin',
      action: 'Quarterly Leave Balance Sync Completed',
      target: 'All Active Departments',
      time: '01 Oct 2026',
      status: 'System',
    },
  ];

  const handleApprove = (id: string) => {
    approveLeave(id, approvalNote || 'Approved by HR.');
    setApprovingId(null);
    setApprovalNote('');
  };

  const handleReject = (id: string) => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejecting the leave request.');
      return;
    }
    rejectLeave(id, rejectReason.trim());
    setRejectingId(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Hero Banner */}
      <div
        className="rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-white overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #064e3b 0%, #059669 55%, #10b981 100%)', boxShadow: '0 8px 32px rgba(6,78,59,0.30)' }}
      >
        <div className="absolute right-0 top-0 w-64 h-64 opacity-10 rounded-full"
          style={{ background: 'radial-gradient(circle, #fff, transparent)', transform: 'translate(30%, -30%)' }} />
        <div className="space-y-1 relative">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#d1fae5' }}>
            <ShieldCheck className="w-3.5 h-3.5" /> HR Administration
          </span>
          <h1 className="text-2xl font-bold tracking-tight mt-1">HR Operations Dashboard</h1>
          <p className="text-sm" style={{ color: '#a7f3d0' }}>
            Welcome, {currentUser?.name}. Manage leave approvals, workforce metrics &amp; policy workflows.
          </p>
        </div>
        <div className="flex items-center gap-3 relative shrink-0">
          <button
            onClick={() => onNavigate('hr-leave-requests')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.30)', backdropFilter: 'blur(12px)' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.28)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.18)')}
          >
            <Clock className="w-4 h-4" />
            Pending Approvals ({pendingRequests.length})
          </button>
          <button
            onClick={() => onNavigate('hr-reports')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background: 'rgba(0,0,0,0.20)', border: '1px solid rgba(255,255,255,0.15)' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.30)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.20)')}
          >
            <FileBarChart className="w-4 h-4" />
            Generate Report
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {([
          { label: 'Total Staff', value: totalEmployees, sub: 'Active across 5 depts', icon: Users, color: '#3b82f6', bg: 'rgba(59,130,246,0.10)', onClick: () => onNavigate('hr-employees') },
          { label: 'On Leave Today', value: `${onLeaveToday.length}`, sub: onLeaveToday.length > 0 ? onLeaveToday.map(r => r.employeeName.split(' ')[0]).join(', ') : 'Full team present', icon: UserCheck, color: '#6366f1', bg: 'rgba(99,102,241,0.10)', onClick: undefined },
          { label: 'Pending Queue', value: pendingRequests.length, sub: 'Awaiting HR decision', icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', onClick: () => onNavigate('hr-leave-requests') },
          { label: 'Approved Leaves', value: approvedRequests.length, sub: `${totalSanctionedDays} days sanctioned`, icon: CheckCircle2, color: '#10b981', bg: 'rgba(16,185,129,0.10)', onClick: undefined },
        ] as const).map((kpi, i) => (
          <div
            key={i}
            className={`glass-card p-4 flex items-start gap-4 ${kpi.onClick ? 'cursor-pointer' : ''}`}
            onClick={kpi.onClick}
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: kpi.bg }}>
              <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
            </div>
            <div className="min-w-0">
              <div className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
              <div className="text-xs font-semibold text-slate-600">{kpi.label}</div>
              <div className="text-[11px] text-slate-400 truncate">{kpi.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Staff On Leave Today Detail Banner */}
      {onLeaveToday.length > 0 && (
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3 pb-2" style={{ borderBottom: '1px solid #f1f5f9' }}>
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" style={{ color: '#6366f1' }} />
              <h2 className="section-title">Absences Today (7 October 2026)</h2>
            </div>
            <span className="badge badge-blue">{onLeaveToday.length} Absent</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {onLeaveToday.map((r) => (
              <div key={r.id} className="p-3 rounded-xl flex items-center justify-between" style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs text-slate-900">{r.employeeName}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">{r.employeeCode}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{r.department} • <span className="font-semibold text-blue-700">{r.leaveType}</span> ({r.durationType})</div>
                </div>
                <span className="badge badge-blue">On Leave</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approvals (2 cols) */}
        <div className="lg:col-span-2 glass-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: '#f59e0b' }} />
              <h2 className="text-sm font-bold text-slate-900">Pending Leave Queue ({pendingRequests.length})</h2>
            </div>
            <button onClick={() => onNavigate('hr-leave-requests')} className="text-xs font-medium flex items-center gap-1" style={{ color: '#2563eb' }}>
              Review All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="py-10 text-center">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-3" style={{ color: '#10b981' }} />
              <p className="font-semibold text-slate-800">All caught up!</p>
              <p className="text-sm text-slate-400 mt-1">No pending leave applications awaiting review.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div key={req.id} className="p-4 rounded-xl space-y-2" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900">{req.employeeName}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">{req.employeeCode}</span>
                        <span className="text-xs text-slate-500">{req.department}</span>
                      </div>
                      <div className="text-xs text-slate-700 mt-0.5">
                        <span className="font-semibold" style={{ color: '#1d4ed8' }}>{req.leaveType}</span>: {req.startDate} → {req.endDate} ({req.daysCount}d • {req.durationType})
                      </div>
                      <p className="text-xs text-slate-500 mt-1 italic line-clamp-1">"{req.reason}"</p>
                      {req.aiSuggested && (
                        <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe' }}>
                          <Sparkles className="w-2.5 h-2.5" />
                          AI: {req.aiExplanation}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => { setApprovingId(req.id); setApprovalNote(''); }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all"
                        style={{ background: 'linear-gradient(135deg,#059669,#10b981)', boxShadow: '0 2px 8px rgba(16,185,129,0.30)' }}
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => { setRejectingId(req.id); setRejectReason(''); }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all"
                        style={{ background: 'linear-gradient(135deg,#e11d48,#f43f5e)', boxShadow: '0 2px 8px rgba(244,63,94,0.30)' }}
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1" style={{ borderTop: '1px solid #fef3c7' }}>
                    <span>Applied: {req.appliedOn}</span>
                    <span>Contact: {req.contactDuringLeave || 'Not specified'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right stats column */}
        <div className="space-y-4">
          {/* Monthly Trend */}
          <div className="glass-card p-4 space-y-3">
            <div className="flex items-center gap-2 pb-2" style={{ borderBottom: '1px solid #f1f5f9' }}>
              <TrendingUp className="w-4 h-4" style={{ color: '#3b82f6' }} />
              <h3 className="section-title">Monthly Leave Volume</h3>
            </div>
            <div className="space-y-3">
              {monthlyTrends.map((t, i) => {
                const colors = ['#3b82f6','#6366f1','#8b5cf6','#10b981'];
                return (
                  <div key={t.month}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600">{t.month}</span>
                      <span className="font-bold text-slate-800">{t.days}d</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${t.percentage}%`, background: colors[i] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leave by Category */}
          <div className="glass-card p-4 space-y-3">
            <h3 className="section-title pb-2" style={{ borderBottom: '1px solid #f1f5f9' }}>By Leave Category</h3>
            <div className="space-y-2.5">
              {Object.entries(typeCounts).map(([type, days], i) => {
                const pct = Math.round((days / totalSanctionedDays) * 100);
                const colors = ['#3b82f6','#10b981','#8b5cf6','#f59e0b','#f43f5e'];
                return (
                  <div key={type}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 truncate pr-2">{type}</span>
                      <span className="font-bold text-slate-800 shrink-0">{days}d</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%`, background: colors[i % colors.length] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Department summary */}
          <div className="glass-card p-4 space-y-2">
            <h3 className="section-title pb-2" style={{ borderBottom: '1px solid #f1f5f9' }}>Dept. Summary</h3>
            {Object.entries(deptStats).map(([dept, data]) => (
              <div key={dept} className="flex justify-between text-xs py-1" style={{ borderBottom: '1px solid #f8fafc' }}>
                <span className="text-slate-600 truncate pr-2">{dept}</span>
                <span className="font-medium text-slate-800 shrink-0">{data.count} • {data.leavesTaken}d</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom: Audit Log & Holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2" style={{ borderBottom: '1px solid #f1f5f9' }}>
            <Activity className="w-4 h-4" style={{ color: '#3b82f6' }} />
            <h3 className="section-title">Recent HR Activity</h3>
            <span className="ml-auto text-[11px] text-slate-400">Live Audit Trail</span>
          </div>
          <div className="space-y-3">
            {recentAuditActivities.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between gap-3 pb-2" style={{ borderBottom: idx < recentAuditActivities.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-900 truncate">{item.action}</div>
                  <div className="text-[11px] text-slate-400 truncate">{item.target} • {item.actor}</div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`badge ${ item.status === 'Approved' ? 'badge-green' : item.status === 'Rejected' ? 'badge-rose' : 'badge-slate' }`}>{item.status}</span>
                  <div className="text-[10px] text-slate-400 mt-0.5">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2" style={{ borderBottom: '1px solid #f1f5f9' }}>
            <CalendarDays className="w-4 h-4" style={{ color: '#8b5cf6' }} />
            <h3 className="section-title">Upcoming Q4 2026 Holidays</h3>
          </div>
          <div className="space-y-2">
            {upcomingHolidays.map((h, idx) => (
              <div key={idx} className="p-3 rounded-xl flex items-center justify-between" style={{ background: '#faf5ff', border: '1px solid #e9d5ff' }}>
                <div>
                  <div className="text-xs font-bold text-slate-800">{h.name}</div>
                  <div className="text-[11px] text-slate-400">{h.type}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold" style={{ color: '#7c3aed' }}>{h.date}</div>
                  <div className="text-[10px] text-slate-400">{h.day}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Approval Modal */}
      {approvingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 animate-fade-in">
          <div className="glass-card w-full max-w-md p-6 space-y-4 animate-fade-up">
            <h3 className="text-base font-bold text-slate-900">✅ Approve Leave Request</h3>
            <p className="text-sm text-slate-500">Confirm approval. The employee's leave balance will be automatically deducted.</p>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">HR Remarks (optional)</label>
              <input type="text" value={approvalNote} onChange={(e) => setApprovalNote(e.target.value)}
                placeholder="e.g. Approved. Sprint handover completed."
                className="input-field" />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setApprovingId(null)} className="btn-secondary text-xs">Cancel</button>
              <button onClick={() => handleApprove(approvingId)}
                className="px-4 py-2 text-xs text-white font-semibold rounded-lg transition-all"
                style={{ background: 'linear-gradient(135deg,#059669,#10b981)', boxShadow: '0 4px 12px rgba(16,185,129,0.30)' }}>
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 animate-fade-in">
          <div className="glass-card w-full max-w-md p-6 space-y-4 animate-fade-up">
            <h3 className="text-base font-bold text-slate-900">❌ Reject Leave Request</h3>
            <p className="text-sm text-slate-500">Provide a reason for rejection so the employee is informed.</p>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Reason for Rejection <span className="text-rose-500">*</span></label>
              <textarea rows={3} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Critical release scheduled during this period..."
                className="input-field resize-none" required />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setRejectingId(null)} className="btn-secondary text-xs">Cancel</button>
              <button onClick={() => handleReject(rejectingId)}
                className="px-4 py-2 text-xs text-white font-semibold rounded-lg transition-all"
                style={{ background: 'linear-gradient(135deg,#e11d48,#f43f5e)', boxShadow: '0 4px 12px rgba(244,63,94,0.30)' }}>
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
