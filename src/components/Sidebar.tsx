import React from 'react';
import { useLeave } from '../context/LeaveContext';
import {
  LayoutDashboard,
  CalendarPlus,
  Clock,
  PieChart,
  Users,
  CheckSquare,
  History,
  FileBarChart,
  ArrowRightLeft,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export type ActiveTab =
  | 'emp-dashboard'
  | 'emp-apply'
  | 'emp-requests'
  | 'emp-balance'
  | 'hr-dashboard'
  | 'hr-employees'
  | 'hr-leave-requests'
  | 'hr-history'
  | 'hr-reports';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const { currentUser, leaveRequests, employees, setCurrentUser } = useLeave();

  if (!currentUser) return null;

  const isHR = currentUser.role === 'hr';
  const pendingCount = leaveRequests.filter((r) => r.status === 'Pending').length;
  const myPendingCount = leaveRequests.filter(
    (r) => r.employeeId === currentUser.id && r.status === 'Pending'
  ).length;

  const switchRole = () => {
    if (isHR) {
      const emp = employees.find((e) => e.role === 'employee') || employees[0];
      setCurrentUser(emp);
      onSelectTab('emp-dashboard');
    } else {
      const hr = employees.find((e) => e.role === 'hr') || employees[employees.length - 1];
      setCurrentUser(hr);
      onSelectTab('hr-dashboard');
    }
  };

  const NavItem = ({
    tab, icon: Icon, label, badge,
  }: { tab: ActiveTab; icon: React.ElementType; label: string; badge?: number }) => (
    <button
      onClick={() => onSelectTab(tab)}
      className={`sidebar-link ${activeTab === tab ? 'active' : ''}`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="flex-1 text-left">{label}</span>
      {badge && badge > 0 ? (
        <span
          className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
          style={{ background: '#f59e0b', color: '#0f172a' }}
        >
          {badge}
        </span>
      ) : null}
    </button>
  );

  return (
    <aside
      className="w-60 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]"
      style={{ background: 'linear-gradient(180deg, #0f172a 0%, #111827 100%)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Profile card */}
      <div
        className="p-4 m-3 rounded-xl"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
            style={{ background: isHR ? 'linear-gradient(135deg,#059669,#10b981)' : 'linear-gradient(135deg,#2563eb,#6366f1)' }}
          >
            {currentUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
            <p className="text-[11px] truncate" style={{ color: '#60a5fa' }}>{currentUser.department}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"
            style={isHR
              ? { background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.25)' }
              : { background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.25)' }
            }
          >
            {isHR ? <ShieldCheck className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
            {isHR ? 'HR Admin' : 'Employee'}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-widest px-3 py-2" style={{ color: '#475569' }}>
          {isHR ? 'HR Administration' : 'Employee Portal'}
        </p>

        {!isHR ? (
          <>
            <NavItem tab="emp-dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem tab="emp-apply" icon={CalendarPlus} label="Apply for Leave" />
            <NavItem tab="emp-requests" icon={Clock} label="My Requests" badge={myPendingCount} />
            <NavItem tab="emp-balance" icon={PieChart} label="Leave Balances" />
          </>
        ) : (
          <>
            <NavItem tab="hr-dashboard" icon={LayoutDashboard} label="HR Dashboard" />
            <NavItem tab="hr-leave-requests" icon={CheckSquare} label="Review Requests" badge={pendingCount} />
            <NavItem tab="hr-employees" icon={Users} label="Employee Directory" />
            <NavItem tab="hr-history" icon={History} label="Leave History" />
            <NavItem tab="hr-reports" icon={FileBarChart} label="Reports & Analytics" />
          </>
        )}
      </nav>

      {/* Role switcher */}
      <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={switchRole}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: '#94a3b8' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.color = '#e2e8f0'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.color = '#94a3b8'; }}
        >
          <ArrowRightLeft className="w-3.5 h-3.5" style={{ color: '#3b82f6' }} />
          Switch to {isHR ? 'Employee View' : 'HR View'}
        </button>
        <p className="mt-2 text-[10px] text-center" style={{ color: '#334155' }}>
          3rd-Year B.Sc. Mini Project
        </p>
      </div>
    </aside>
  );
};
