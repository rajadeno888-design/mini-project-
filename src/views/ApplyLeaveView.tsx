import React, { useState, useId } from 'react';
import { useLeave } from '../context/LeaveContext';
import { LeaveCategory, DurationType, LeaveSuggestionResult } from '../types';
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  FileCheck,
  Send,
  Loader2,
  Info,
} from 'lucide-react';
import { ActiveTab } from '../components/Sidebar';

interface ApplyLeaveViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const ApplyLeaveView: React.FC<ApplyLeaveViewProps> = ({ onNavigate }) => {
  const { currentUser, applyLeave } = useLeave();

  const todayStr = new Date().toISOString().split('T')[0];

  const [leaveType, setLeaveType] = useState<LeaveCategory>('Casual Leave');
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [durationType, setDurationType] = useState<DurationType>('Full Day');
  const [reason, setReason] = useState('');
  const [contactNumber, setContactNumber] = useState(currentUser?.phone || '');

  // AI Suggestion States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<LeaveSuggestionResult | null>(null);
  const [hasConfirmedAi, setHasConfirmedAi] = useState(false);
  const [aiError, setAiError] = useState('');

  // Form Submission States
  const [errorMessage, setErrorMessage] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  if (!currentUser) return null;

  // Calculate day count
  const calculateDays = (): number => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return 0;

    if (durationType === 'First Half' || durationType === 'Second Half') {
      return 0.5;
    }

    // Number of calendar days inclusive
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const daysCount = calculateDays();

  // Balance helper
  const getRemainingBalance = (cat: LeaveCategory): number => {
    const map: Record<LeaveCategory, keyof typeof currentUser.leaveBalance> = {
      'Casual Leave': 'casual',
      'Sick Leave': 'sick',
      'Earned Leave': 'earned',
      'Emergency Leave': 'emergency',
      'Maternity / Paternity Leave': 'maternityPaternity',
    };
    const b = currentUser.leaveBalance[map[cat]];
    return b.total - b.used;
  };

  const currentAvailable = getRemainingBalance(leaveType);

  // Trigger AI Suggestion
  const handleAnalyzeReason = async () => {
    if (!reason.trim()) {
      setAiError('Please type your leave reason first so AI can analyze it.');
      return;
    }

    setAiError('');
    setIsAnalyzing(true);
    setAiSuggestion(null);
    setHasConfirmedAi(false);

    try {
      const res = await fetch('/api/suggest-leave-type', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason.trim() }),
      });

      if (!res.ok) {
        throw new Error('Server responded with an error');
      }

      const data = await res.json();
      setAiSuggestion({
        suggestedType: data.suggestedType as LeaveCategory,
        confidence: data.confidence || 0.9,
        explanation: data.explanation || 'Categorized based on your leave reason.',
        source: data.source || 'gemini',
      });
    } catch (err) {
      console.warn('AI API error, fallback triggered:', err);
      // Fallback directly
      const lower = reason.toLowerCase();
      let fallbackType: LeaveCategory = 'Casual Leave';
      let explanation = 'Personal commitments fall under Casual Leave.';

      if (
        lower.includes('fever') ||
        lower.includes('sick') ||
        lower.includes('doctor') ||
        lower.includes('headache') ||
        lower.includes('hospital') ||
        lower.includes('unwell')
      ) {
        fallbackType = 'Sick Leave';
        explanation = 'Medical illness and symptoms qualify for Sick Leave.';
      } else if (
        lower.includes('emergency') ||
        lower.includes('urgent') ||
        lower.includes('accident') ||
        lower.includes('crisis')
      ) {
        fallbackType = 'Emergency Leave';
        explanation = 'Sudden crisis requires Emergency Leave.';
      } else if (lower.includes('vacation') || lower.includes('holiday') || lower.includes('trip')) {
        fallbackType = 'Earned Leave';
        explanation = 'Multi-day leisure trip falls under Earned / Annual Leave.';
      }

      setAiSuggestion({
        suggestedType: fallbackType,
        confidence: 0.9,
        explanation,
        source: 'heuristic',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Confirm AI Suggestion
  const handleConfirmSuggestion = () => {
    if (aiSuggestion) {
      setLeaveType(aiSuggestion.suggestedType);
      setHasConfirmedAi(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (daysCount <= 0) {
      setErrorMessage('End date cannot be prior to start date.');
      return;
    }

    if (!reason.trim()) {
      setErrorMessage('Please provide a valid leave reason.');
      return;
    }

    if (daysCount > currentAvailable) {
      setErrorMessage(
        `Insufficient balance! You requested ${daysCount} day(s), but only have ${currentAvailable} day(s) remaining for ${leaveType}.`
      );
      return;
    }

    const result = applyLeave({
      leaveType,
      startDate,
      endDate,
      daysCount,
      durationType,
      reason: reason.trim(),
      aiSuggested: Boolean(aiSuggestion && hasConfirmedAi),
      aiConfidence: aiSuggestion?.confidence,
      aiExplanation: aiSuggestion?.explanation,
      contactDuringLeave: contactNumber,
    });

    if (result.success && result.request) {
      setSubmissionSuccess(result.request.id);
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Apply for Leave</h1>
        <p className="text-xs text-slate-500 mt-1">
          Submit your leave application for HR review. AI will suggest the appropriate leave category based on your reason.
        </p>
      </div>

      {/* Success Notification Modal */}
      {submissionSuccess && (
        <div className="bg-white border border-emerald-300 rounded-lg p-6 shadow-md">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-slate-900">Leave Application Submitted!</h3>
              <p className="text-xs text-slate-600 mt-1">
                Your request <span className="font-mono font-semibold text-slate-900">({submissionSuccess})</span> has been submitted to Human Resources (Anita Desai) for review.
              </p>
              <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 space-y-1">
                <div><strong>Category:</strong> {leaveType}</div>
                <div><strong>Dates:</strong> {startDate} to {endDate} ({daysCount} days • {durationType})</div>
                <div><strong>Status:</strong> <span className="text-amber-700 font-semibold">Pending HR Approval</span></div>
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => onNavigate('emp-requests')}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded transition-colors flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>View in My Requests</span>
                </button>
                <button
                  onClick={() => {
                    setSubmissionSuccess(null);
                    setReason('');
                    setAiSuggestion(null);
                    setHasConfirmedAi(false);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded transition-colors"
                >
                  Apply Another Leave
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!submissionSuccess && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left 2 Cols: Form Fields */}
            <div className="md:col-span-2 space-y-5 bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
                1. Leave Details & Duration
              </h2>

              {/* Dates Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Start Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    min={todayStr}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (e.target.value > endDate) {
                        setEndDate(e.target.value);
                      }
                    }}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    End Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-700"
                  />
                </div>
              </div>

              {/* Duration Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Day Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Full Day', 'First Half', 'Second Half'] as DurationType[]).map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setDurationType(type)}
                      className={`py-2 px-3 text-xs font-medium rounded border text-center transition-colors ${
                        durationType === type
                          ? 'bg-blue-700 text-white border-blue-700 font-semibold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculated Summary Pill */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between text-xs">
                <span className="text-slate-600">Calculated Working Days:</span>
                <span className="font-bold text-slate-900 text-sm">
                  {daysCount} {daysCount === 1 ? 'Day' : 'Days'}
                </span>
              </div>

              {/* Section 2: Reason & AI Suggestion */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    2. Reason for Leave <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-500">Natural language reason</span>
                </div>

                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (aiSuggestion) {
                      // reset suggestion if user drastically edits
                      setHasConfirmedAi(false);
                    }
                  }}
                  placeholder="e.g. 'I am suffering from high fever and severe throat infection, doctor advised complete rest for 2 days.'"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-700 leading-relaxed"
                  required
                />

                {/* AI Trigger Button */}
                <div className="flex items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleAnalyzeReason}
                    disabled={isAnalyzing || !reason.trim()}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-medium rounded transition-colors"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Analyzing with AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                        <span>Suggest Leave Type with AI</span>
                      </>
                    )}
                  </button>

                  <span className="text-[11px] text-slate-500">
                    Rule: Employee must confirm the AI suggestion.
                  </span>
                </div>

                {aiError && (
                  <p className="text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{aiError}</span>
                  </p>
                )}

                {/* AI Suggestion Card - Solid Styling, No gradients/purple */}
                {aiSuggestion && (
                  <div className="p-4 bg-slate-50 border border-blue-300 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-700" />
                        <span className="text-xs font-bold text-slate-900">
                          AI Suggested Category:
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                          {aiSuggestion.suggestedType}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-slate-500">
                        {Math.round(aiSuggestion.confidence * 100)}% Match
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      {aiSuggestion.explanation}
                    </p>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                      <div className="text-[11px] text-slate-600">
                        {hasConfirmedAi ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Suggestion Confirmed & Applied
                          </span>
                        ) : (
                          <span>Do you want to apply this recommended category?</span>
                        )}
                      </div>

                      {!hasConfirmedAi ? (
                        <button
                          type="button"
                          onClick={handleConfirmSuggestion}
                          className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirm & Apply Suggestion</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500">Confirmed</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Section 3: Leave Type Selection & Contact */}
              <div className="pt-3 border-t border-slate-100 space-y-4">
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  3. Selected Category & Contact
                </h2>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Leave Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={leaveType}
                    onChange={(e) => {
                      setLeaveType(e.target.value as LeaveCategory);
                      setHasConfirmedAi(false);
                    }}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-700 font-medium"
                  >
                    <option value="Casual Leave">Casual Leave (CL)</option>
                    <option value="Sick Leave">Sick Leave (SL)</option>
                    <option value="Earned Leave">Earned Leave (EL)</option>
                    <option value="Emergency Leave">Emergency Leave</option>
                    <option value="Maternity / Paternity Leave">Maternity / Paternity Leave</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Emergency Contact During Absence
                  </label>
                  <input
                    type="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-700"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('emp-dashboard')}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded shadow-sm transition-colors flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Leave Application</span>
                </button>
              </div>
            </div>

            {/* Right 1 Col: Balance & Quota Check */}
            <div className="space-y-4">
              {/* Balance Widget */}
              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-700" />
                  <span>Leave Balances Summary</span>
                </h3>

                <div className="mt-3 space-y-2 text-xs">
                  <div
                    className={`p-2.5 rounded border ${
                      leaveType === 'Casual Leave'
                        ? 'bg-blue-50 border-blue-300 font-semibold text-blue-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex justify-between">
                      <span>Casual Leave (CL)</span>
                      <span>{getRemainingBalance('Casual Leave')} days left</span>
                    </div>
                  </div>

                  <div
                    className={`p-2.5 rounded border ${
                      leaveType === 'Sick Leave'
                        ? 'bg-blue-50 border-blue-300 font-semibold text-blue-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex justify-between">
                      <span>Sick Leave (SL)</span>
                      <span>{getRemainingBalance('Sick Leave')} days left</span>
                    </div>
                  </div>

                  <div
                    className={`p-2.5 rounded border ${
                      leaveType === 'Earned Leave'
                        ? 'bg-blue-50 border-blue-300 font-semibold text-blue-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex justify-between">
                      <span>Earned Leave (EL)</span>
                      <span>{getRemainingBalance('Earned Leave')} days left</span>
                    </div>
                  </div>

                  <div
                    className={`p-2.5 rounded border ${
                      leaveType === 'Emergency Leave'
                        ? 'bg-blue-50 border-blue-300 font-semibold text-blue-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex justify-between">
                      <span>Emergency Leave</span>
                      <span>{getRemainingBalance('Emergency Leave')} days left</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex justify-between py-1">
                    <span>Requested:</span>
                    <span className="font-bold text-slate-900">{daysCount} day(s)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Available:</span>
                    <span
                      className={`font-bold ${
                        currentAvailable >= daysCount ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {currentAvailable} day(s)
                    </span>
                  </div>
                </div>
              </div>

              {/* Approval Process Note */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600 space-y-2">
                <span className="font-bold text-slate-800 block">Approval Workflow</span>
                <p>1. Application is received by HR Manager.</p>
                <p>2. HR validates quota and team availability.</p>
                <p>3. Status updates to Approved or Rejected with reason.</p>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
