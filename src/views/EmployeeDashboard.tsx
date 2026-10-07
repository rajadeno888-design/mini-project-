import React from 'react';
import { useLeave } from '../context/LeaveContext';
import {
  Calendar,
  CalendarPlus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { ActiveTab } from '../components/Sidebar';

interface EmployeeDashboardProps {
  onNavigate: (tab: ActiveTab) => void;
}

const balanceMeta = [
  { key: 'casual',    label: 'Casual Leave',    short: 'CL', color: '#3b82f6', bg: 'rgba(59,130,246,0.10)', desc: 'Personal errands & social events' },
  { key: 'sick',      label: 'Sick Leave',       short: 'SL', color: '#10b981', bg: 'rgba(16,185,129,0.10)', desc: 'Illness & medical checkups' },
  { key: 'earned',    label: 'Earned Leave',     short: 'EL', color: '#8b5cf6', bg: 'rgba(139,92,246,0.10)', desc: 'Annual paid & planned holidays' },
  { key: 'emergency', label: 'Emergency Leave',  short: 'EM', color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', desc: 'Unforeseen domestic crises' },
] as const;

const policyItems = [
  { type: 'Casual Leave (CL)', rule: 'Minimum 24 hours prior notice recommended. No carry forward.' },
  { type: 'Sick Leave (SL)',   rule: 'Medical prescription required for absences exceeding 2 consecutive days.' },
  { type: 'Earned / Annual',   rule: 'Requires 7+ days advance notice and project lead approval.' },
  { type: 'Emergency Leave',   rule: 'Can be applied post-incident with valid written justification.' },
];

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ onNavigate }) => {
  const { currentUser, leaveRequests } = useLeave();
  if (!currentUser) return null;

  const myRequests = leaveRequests.filter((r) => r.employeeId === currentUser.id);
  const pendingRequests = myRequests.filter((r) => r.status === 'Pending');
  const approvedRequests = myRequests.filter((r) => r.status === 'Approved');

  return (
    <div className="space-y-6 animate-fade-up">

      {/* ── Hero Welcome Banner ── */}
      <div
        className="rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-white overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 55%, #4f46e5 100%)', boxShadow: '0 8px 32px rgba(30,58,138,0.30)' }}
      >
        {/* Decorative shape */}
        <div className="absolute right-0 top-0 w-64 h-64 opacity-10 rounded-full"
          style={{ background: 'radial-gradient(circle, #fff, transparent)', transform: 'translate(30%, -30%)' }} />

        <div className="space-y-1 relative">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full font-mono"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#bfdbfe' }}>
              {currentUser.employeeCode}
            </span>
            <span className="text-[11px]" style={{ color: '#93c5fd' }}>• {currentUser.department}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Good day, {currentUser.name.split(' ')[0]}! 👋</h1>
          <p className="text-sm" style={{ color: '#93c5fd' }}>
            {currentUser.designation} • Joined {currentUser.joiningDate}
          </p>
        </div>

        <div className="flex items-center gap-3 relative shrink-0">
          <button
            onClick={() => onNavigate('emp-apply')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.30)', backdropFilter: 'blur(12px)' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.28)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.18)')}
          >
            <CalendarPlus className="w-4 h-4" />
            Apply for Leave
          </button>
          <button
            onClick={() => onNavigate('emp-requests')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background: 'rgba(0,0,0,0.20)', border: '1px solid rgba(255,255,255,0.15)' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.30)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.20)')}
          >
            <Clock className="w-4 h-4" />
            My Requests ({myRequests.length})
          </button>
        </div>
      </div>

      {/* ── Quick stats row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Requests', value: myRequests.length, icon: FileText, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
          { label: 'Pending Approval', value: pendingRequests.length, icon: AlertCircle, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
          { label: 'Approved Leaves', value: approvedRequests.length, icon: CheckCircle2, color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
        ].map(stat => (
          <div key={stat.label} className="glass-card p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: stat.bg }}>
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Leave Balances ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-slate-500" />
            <h2 className="section-title">Leave Quota & Balance — 2026</h2>
          </div>
          <button
            onClick={() => onNavigate('emp-balance')}
            className="text-xs font-medium flex items-center gap-1 transition-colors hover:text-blue-700"
            style={{ color: '#2563eb' }}
          >
            Full Breakdown <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {balanceMeta.map(meta => {
            const bal = currentUser.leaveBalance[meta.key];
            const available = bal.total - bal.used;
            const pct = Math.min(100, Math.round((bal.used / bal.total) * 100));
            return (
              <div key={meta.key} className="glass-card p-4 flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full mb-2"
                      style={{ background: meta.bg, color: meta.color }}
                    >
                      {meta.short}
                    </div>
                    <div className="text-xs font-semibold text-slate-700">{meta.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{meta.desc}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: meta.color }}>{available}</div>
                    <div className="text-[11px] text-slate-400">/ {bal.total} days</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
                    <span>Used: {bal.used}d</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${meta.color}, ${meta.color}88)` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Recent Requests + Policy ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent requests */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-bold text-slate-900">Recent Leave Requests</h3>
            </div>
            <button
              onClick={() => onNavigate('emp-requests')}
              className="text-xs font-medium"
              style={{ color: '#2563eb' }}
            >
              View All ({myRequests.length})
            </button>
          </div>

          {myRequests.length === 0 ? (
            <div className="py-10 text-center">
              <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: '#e2e8f0' }} />
              <p className="text-sm text-slate-400">No leave requests submitted yet.</p>
              <button onClick={() => onNavigate('emp-apply')} className="btn-primary mt-4 text-xs">
                <CalendarPlus className="w-3.5 h-3.5" /> Apply Now
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myRequests.slice(0, 4).map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-xl flex items-start justify-between gap-3 transition-all"
                  style={{ background: '#f8fafc', border: '1px solid #f1f5f9' }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-slate-900">{req.leaveType}</span>
                      <span className="text-[11px] font-mono text-slate-400">({req.id})</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>{req.startDate}{req.startDate !== req.endDate ? ` → ${req.endDate}` : ''}</span>
                      <span className="font-semibold text-slate-600">• {req.daysCount}d {req.durationType}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 italic line-clamp-1">"{req.reason}"</p>
                    {req.hrRemarks && (
                      <div className="mt-1.5 text-[11px] px-2 py-1 rounded-lg" style={{ background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe' }}>
                        <span className="font-semibold">HR:</span> {req.hrRemarks}
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    {req.status === 'Approved' && <span className="badge badge-green"><CheckCircle2 className="w-3 h-3" /> Approved</span>}
                    {req.status === 'Pending' && <span className="badge badge-amber"><AlertCircle className="w-3 h-3" /> Pending</span>}
                    {req.status === 'Rejected' && <span className="badge badge-rose"><XCircle className="w-3 h-3" /> Rejected</span>}
                    {req.status === 'Cancelled' && <span className="badge badge-slate">Cancelled</span>}
                    <div className="text-[10px] text-slate-400 mt-1">{req.appliedOn}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Policy sidebar */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center gap-2 pb-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
            <FileText className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-900">Leave Policy</h3>
          </div>
          <div className="space-y-2.5">
            {policyItems.map(p => (
              <div key={p.type} className="p-3 rounded-xl" style={{ background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                <div className="text-xs font-bold text-slate-800 mb-0.5">{p.type}</div>
                <div className="text-[11px] text-slate-500 leading-relaxed">{p.rule}</div>
              </div>
            ))}
          </div>
          <div className="pt-2 text-[10px] text-slate-400" style={{ borderTop: '1px solid #f1f5f9' }}>
            Apex Technologies HR Dept • Guidelines 2026
          </div>
        </div>
      </div>
    </div>
  );
};
