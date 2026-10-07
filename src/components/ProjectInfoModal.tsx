import React from 'react';
import { X, GraduationCap, Code2, Cpu, CheckCircle2, FileText, Database } from 'lucide-react';

interface ProjectInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectInfoModal: React.FC<ProjectInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="relative w-full max-w-2xl bg-white border border-slate-300 shadow-xl rounded-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded">
              <GraduationCap className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold leading-tight">Academic Project Documentation</h2>
              <p className="text-xs text-slate-300">3rd-Year B.Sc. Computer Science Mini Project</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          <div className="border border-slate-200 rounded p-4 bg-slate-50">
            <h3 className="font-semibold text-slate-900 mb-1">Project Title</h3>
            <p className="text-slate-800 font-medium">Digital Employee Leave Management & Automated Classification System</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-medium">B.Sc. CS 3rd Year</span>
              <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded font-medium">Full Stack Architecture</span>
              <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-medium">Gemini 3.8 Flash SDK</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-700" /> Problem Statement & Objective
            </h4>
            <p className="text-slate-600 leading-relaxed text-xs">
              Small organizations often rely on unstructured WhatsApp messages, verbal requests, or physical paper slips to manage leave requests. This causes lost audit trails, inaccurate leave balance tracking, and scheduling conflicts. This system digitizes the end-to-end workflow: role-based access for Employees and HR, dynamic leave balance deduction, multi-criteria filtering, report generation, and an automated text classification assistant to suggest proper leave types.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-slate-700" /> AI Leave Classification Engine
            </h4>
            <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs space-y-2">
              <p className="text-slate-700">
                <strong>Mechanism:</strong> When an employee writes an explanation (e.g., <em>"High fever and doctor prescribed 2 days rest"</em>), the server-side Gemini 3.8 Flash model parses the semantic intent and categorizes it into standard HR categories:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                <li><strong>Sick Leave:</strong> Medical ailments, symptoms, clinical appointments</li>
                <li><strong>Casual Leave:</strong> Personal commitments, ceremonies, private errands</li>
                <li><strong>Emergency Leave:</strong> Sudden accidents, domestic crises, unforeseen urgency</li>
                <li><strong>Earned Leave:</strong> Planned annual vacations and multi-day holidays</li>
              </ul>
              <p className="text-slate-500 italic">
                * Strict verification rule: The employee must explicitly confirm or override the AI suggestion before final submission.
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-slate-700" /> Technologies Employed
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 border border-slate-200 rounded">
                <span className="font-medium text-slate-900 block">Frontend Framework</span>
                <span className="text-slate-500">React 19 + TypeScript + Vite</span>
              </div>
              <div className="p-2 border border-slate-200 rounded">
                <span className="font-medium text-slate-900 block">Server & Proxy</span>
                <span className="text-slate-500">Express + Node.js (Fullstack)</span>
              </div>
              <div className="p-2 border border-slate-200 rounded">
                <span className="font-medium text-slate-900 block">Styling Standards</span>
                <span className="text-slate-500">Tailwind CSS (Solid Palette, No Purple)</span>
              </div>
              <div className="p-2 border border-slate-200 rounded">
                <span className="font-medium text-slate-900 block">Language Model</span>
                <span className="text-slate-500">Google GenAI SDK (@google/genai)</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <Database className="w-4 h-4 text-slate-700" /> Key Modules Implemented
            </h4>
            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span><strong>Employee Portal:</strong> Dashboard, balance tracking, leave application with AI assist, status monitor.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span><strong>HR Administration:</strong> Pending queue, 1-click approve/reject with remarks, quota adjustments.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span><strong>Reporting & Audit:</strong> Dynamic metrics, department breakdown, CSV export, print summary layout.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-50 border-t border-slate-200">
          <span className="text-xs text-slate-500">Department of Computer Science • College Mini Project</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
