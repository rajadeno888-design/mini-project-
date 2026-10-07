import React, { useState } from 'react';
import { LeaveProvider, useLeave } from './context/LeaveContext';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { LoginView } from './views/LoginView';
import { EmployeeDashboard } from './views/EmployeeDashboard';
import { ApplyLeaveView } from './views/ApplyLeaveView';
import { MyLeaveRequestsView } from './views/MyLeaveRequestsView';
import { LeaveBalanceView } from './views/LeaveBalanceView';
import { HRDashboard } from './views/HRDashboard';
import { EmployeeManagementView } from './views/EmployeeManagementView';
import { LeaveRequestManagementView } from './views/LeaveRequestManagementView';
import { LeaveHistoryView } from './views/LeaveHistoryView';
import { ReportsView } from './views/ReportsView';

const MainLayout: React.FC = () => {
  const { currentUser } = useLeave();
  const [activeTab, setActiveTab] = useState<ActiveTab>('emp-dashboard');
  const [showLoginModal, setShowLoginModal] = useState(false);

  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'hr' && activeTab.startsWith('emp-')) {
        setActiveTab('hr-dashboard');
      } else if (currentUser.role === 'employee' && activeTab.startsWith('hr-')) {
        setActiveTab('emp-dashboard');
      }
    }
  }, [currentUser]);

  if (!currentUser) {
    return <LoginView onSuccess={() => setActiveTab('emp-dashboard')} />;
  }

  return (
    <div className="min-h-screen flex flex-col antialiased" style={{ background: '#f1f5f9', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Navbar onOpenLogin={() => setShowLoginModal(true)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        <main className="flex-1 min-w-0 p-5 lg:p-7 overflow-y-auto animate-fade-up">
          {activeTab === 'emp-dashboard' && <EmployeeDashboard onNavigate={setActiveTab} />}
          {activeTab === 'emp-apply' && <ApplyLeaveView onNavigate={setActiveTab} />}
          {activeTab === 'emp-requests' && <MyLeaveRequestsView onNavigate={setActiveTab} />}
          {activeTab === 'emp-balance' && <LeaveBalanceView onNavigate={setActiveTab} />}
          {activeTab === 'hr-dashboard' && <HRDashboard onNavigate={setActiveTab} />}
          {activeTab === 'hr-employees' && <EmployeeManagementView />}
          {activeTab === 'hr-leave-requests' && <LeaveRequestManagementView />}
          {activeTab === 'hr-history' && <LeaveHistoryView />}
          {activeTab === 'hr-reports' && <ReportsView />}
        </main>
      </div>

      <footer
        className="py-3 text-center text-xs"
        style={{ background: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.06)', color: '#475569' }}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-1">
          <span style={{ color: '#334155' }}>Apex Technologies HRMS • Employee Leave Management System</span>
          <span style={{ color: '#1e293b' }}>3rd-Year B.Sc. Computer Science Mini Project</span>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <LeaveProvider>
      <MainLayout />
    </LeaveProvider>
  );
}
