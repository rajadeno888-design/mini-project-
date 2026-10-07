import React, { useState } from 'react';
import { useLeave } from '../context/LeaveContext';
import {
  Building2,
  User,
  LogOut,
  GraduationCap,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  Database,
} from 'lucide-react';
import { ProjectInfoModal } from './ProjectInfoModal';

interface NavbarProps {
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin }) => {
  const { currentUser, employees, loginAs, logout, resetToSampleData } = useLeave();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleQuickSwitch = (empId: string) => {
    loginAs(empId);
    setShowUserMenu(false);
  };

  const handleResetData = () => {
    resetToSampleData();
    setConfirmReset(false);
    alert('System reset to initial sample data successfully.');
  };

  return (
    <>
      <header
        className="sticky top-0 z-30 border-b"
        style={{
          background: 'linear-gradient(90deg, #0f172a 0%, #1e3a8a 60%, #312e81 100%)',
          borderColor: 'rgba(255,255,255,0.08)',
          boxShadow: '0 2px 16px rgba(0,0,0,0.30)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)', boxShadow: '0 4px 12px rgba(37,99,235,0.40)' }}
            >
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">LeaveEase</span>
                <span
                  className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.10)', color: '#93c5fd', border: '1px solid rgba(147,197,253,0.25)' }}
                >
                  Apex Technologies
                </span>
              </div>
              <p className="text-[11px] hidden sm:block" style={{ color: '#60a5fa' }}>Employee Leave Management Portal</p>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* DB Viewer */}
            <a
              href="http://localhost:4000"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: 'rgba(255,255,255,0.07)', color: '#93c5fd', border: '1px solid rgba(147,197,253,0.20)' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.14)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)')}
              title="Open SQLite Database Viewer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>DB Viewer</span>
            </a>

            {/* Project Info */}
            <button
              onClick={() => setShowProjectModal(true)}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: 'rgba(255,255,255,0.07)', color: '#93c5fd', border: '1px solid rgba(147,197,253,0.20)' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.14)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)')}
              title="View Mini Project Details"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>B.Sc. Mini Project</span>
            </button>

            {/* Reset */}
            <button
              onClick={() => setConfirmReset(true)}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ color: '#94a3b8' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.color = '#e2e8f0'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#94a3b8'; }}
              title="Reset application to initial state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            {/* User menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 py-1.5 px-2.5 rounded-xl transition-all"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.14)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)')}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: currentUser.role === 'hr' ? 'linear-gradient(135deg,#059669,#10b981)' : 'linear-gradient(135deg,#2563eb,#6366f1)' }}
                  >
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                      {currentUser.name}
                      {currentUser.role === 'hr' && <ShieldCheck className="w-3 h-3 text-emerald-400 inline" />}
                    </div>
                    <div className="text-[11px] leading-tight" style={{ color: '#60a5fa' }}>
                      {currentUser.role === 'hr' ? 'HR Manager' : currentUser.designation}
                    </div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 mt-2 w-72 rounded-xl shadow-2xl border py-2 z-50 animate-fade-up"
                      style={{ background: '#fff', borderColor: '#e2e8f0', boxShadow: '0 16px 48px rgba(15,23,42,0.20)' }}>
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 mt-0.5">{currentUser.name}</p>
                        <p className="text-xs text-slate-500">{currentUser.email}</p>
                        <div className="mt-2 flex items-center gap-1.5 text-[11px]">
                          <span className="px-1.5 py-0.5 rounded font-mono bg-slate-100 text-slate-600 text-[10px]">{currentUser.employeeCode}</span>
                          <span className={`px-2 py-0.5 rounded-full font-semibold ${currentUser.role === 'hr' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                            {currentUser.role === 'hr' ? 'HR Admin' : 'Employee'}
                          </span>
                        </div>
                      </div>

                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Switch Demo Role</p>
                        <div className="space-y-1">
                          {employees.map((emp) => (
                            <button
                              key={emp.id}
                              onClick={() => handleQuickSwitch(emp.id)}
                              className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-all ${emp.id === currentUser.id ? 'bg-blue-50 text-blue-900' : 'text-slate-700 hover:bg-slate-50'}`}
                            >
                              <div className="truncate">
                                <div className="font-semibold">{emp.name}</div>
                                <div className="text-[10px] text-slate-400">{emp.designation}</div>
                              </div>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${emp.role === 'hr' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                                {emp.role.toUpperCase()}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="px-2 pt-1">
                        <button
                          onClick={() => { setShowUserMenu(false); logout(); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{ background: 'linear-gradient(135deg,#2563eb,#4f46e5)', color: '#fff', boxShadow: '0 4px 12px rgba(37,99,235,0.40)' }}
              >
                <User className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <ProjectInfoModal isOpen={showProjectModal} onClose={() => setShowProjectModal(false)} />

      {confirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 animate-fade-in">
          <div className="glass-card w-full max-w-sm p-6 space-y-4 animate-fade-up">
            <h3 className="text-base font-bold text-slate-900">Reset Demo Data?</h3>
            <p className="text-sm text-slate-500">This will restore all employees and leave requests to their initial sample state.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmReset(false)} className="btn-secondary text-xs">Cancel</button>
              <button onClick={handleResetData} className="btn-primary text-xs">Confirm Reset</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
