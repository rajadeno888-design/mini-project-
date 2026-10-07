import React, { useState, useEffect } from 'react';
import { useLeave } from '../context/LeaveContext';
import { Building2, KeyRound, AlertCircle, Lock, Mail, Sparkles, Shield, ExternalLink, BookOpen } from 'lucide-react';

interface LoginViewProps {
  onSuccess: () => void;
}

const DEMO_ACCOUNTS = [
  { label: 'Employee', email: 'rahul.sharma@apextech.com', password: 'emp123', role: 'employee' },
  { label: 'HR Admin', email: 'anita.desai@apextech.com', password: 'hr123', role: 'hr' },
];

export const LoginView: React.FC<LoginViewProps> = ({ onSuccess }) => {
  const { loginWithCredentials } = useLeave();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('leaveease_demo_email');
    const savedPass = localStorage.getItem('leaveease_demo_pass');
    if (savedEmail && savedPass) {
      setEmail(savedEmail);
      setPassword(savedPass);
      localStorage.removeItem('leaveease_demo_email');
      localStorage.removeItem('leaveease_demo_pass');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both your Email ID and Password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = loginWithCredentials(email, password);
      if (result.success) {
        onSuccess();
      } else {
        setErrorMsg(result.message || 'Invalid credentials. Please verify your Email ID and Password.');
        setIsLoading(false);
      }
    }, 600);
  };

  const quickLogin = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setErrorMsg('');
    setIsLoading(true);
    setTimeout(() => {
      const result = loginWithCredentials(acc.email, acc.password);
      if (result.success) {
        onSuccess();
      } else {
        setErrorMsg(result.message || 'Login failed.');
        setIsLoading(false);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #312e81 100%)' }}>

      {/* Decorative blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
      <div className="absolute bottom-[-80px] right-[-80px] w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />

      {/* Top Navbar */}
      <header className="w-full max-w-5xl flex items-center justify-between py-4 px-6 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}>
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight">LeaveEase HRMS</span>
            <span className="hidden sm:inline-block ml-2 text-xs text-blue-300">Apex Technologies</span>
          </div>
        </div>
        <a href="/about.html"
          className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl text-blue-200 hover:text-white transition-all"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)' }}>
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span>Project Architecture & About</span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </a>
      </header>

      <div className="w-full max-w-md relative z-10 animate-fade-up my-auto py-6">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)', boxShadow: '0 8px 32px rgba(37,99,235,0.40)' }}>
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">LeaveEase HRMS</h1>
          <p className="text-blue-200 text-sm mt-1">Apex Technologies • Employee Portal</p>
          <span className="inline-block mt-2 text-[11px] font-medium px-3 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.10)', color: '#93c5fd', border: '1px solid rgba(147,197,253,0.30)' }}>
            🎓 3rd-Year B.Sc. Computer Science Mini Project
          </span>
        </div>

        {/* Card */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 24px 64px rgba(0,0,0,0.40)' }}>

          <div className="p-8 space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-lg flex items-center gap-2 text-sm animate-fade-in"
                style={{ background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.30)', color: '#fca5a5' }}>
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#60a5fa' }} />
                  <input
                    type="email"
                    placeholder="your.email@apextech.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-white placeholder-slate-400 outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)' }}
                    onFocus={e => (e.target.style.borderColor = '#3b82f6')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#60a5fa' }} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-white placeholder-slate-400 outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)' }}
                    onFocus={e => (e.target.style.borderColor = '#3b82f6')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3 text-sm justify-center rounded-lg"
                style={{ background: isLoading ? '#1e40af' : 'linear-gradient(135deg, #2563eb, #4f46e5)', boxShadow: '0 4px 16px rgba(37,99,235,0.40)' }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                    Signing in…
                  </span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    Sign In to Portal
                  </>
                )}
              </button>
            </form>

            {/* Quick demo access */}
            <div className="pt-2">
              <p className="text-center text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#60a5fa' }}>
                ✦ Quick Demo Access
              </p>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map(acc => (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => quickLogin(acc)}
                    className="rounded-lg py-2 px-3 text-xs font-medium text-left transition-all hover:scale-[1.02] cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#e2e8f0' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)')}
                  >
                    {acc.role === 'hr' ? <Shield className="w-3 h-3 inline mr-1 text-emerald-400" /> : <Sparkles className="w-3 h-3 inline mr-1 text-blue-400" />}
                    {acc.label}
                    <span className="block text-[10px] mt-0.5" style={{ color: '#94a3b8' }}>{acc.email}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="px-8 py-3 flex items-center justify-between text-[11px]"
            style={{ background: 'rgba(0,0,0,0.20)', borderTop: '1px solid rgba(255,255,255,0.06)', color: '#64748b' }}>
            <span>Apex Technologies HRMS</span>
            <a href="/about.html" className="text-blue-400 hover:underline flex items-center gap-1">
              <span>View About Page →</span>
            </a>
          </div>
        </div>
      </div>

      <footer className="w-full max-w-5xl py-3 text-center text-xs text-slate-400 z-20">
        <p>🎓 3rd-Year B.Sc. Computer Science Mini Project · <a href="/about.html" className="text-blue-300 hover:underline font-medium">Read Why & How it was built (Full Documentation)</a></p>
      </footer>
    </div>
  );
};
