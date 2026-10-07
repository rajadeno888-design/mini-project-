export type Role = 'employee' | 'hr';

export type LeaveCategory = 
  | 'Casual Leave'
  | 'Sick Leave'
  | 'Earned Leave'
  | 'Emergency Leave'
  | 'Maternity / Paternity Leave';

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';

export type DurationType = 'Full Day' | 'First Half' | 'Second Half';

export interface LeaveBalance {
  casual: { total: number; used: number };
  sick: { total: number; used: number };
  earned: { total: number; used: number };
  emergency: { total: number; used: number };
  maternityPaternity: { total: number; used: number };
}

export interface Employee {
  id: string;
  employeeCode: string; // e.g. "EMP-101"
  name: string;
  email: string;
  phone: string;
  role: Role;
  department: string;
  designation: string;
  joiningDate: string;
  avatarUrl?: string;
  leaveBalance: LeaveBalance;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  leaveType: LeaveCategory;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  daysCount: number;
  durationType: DurationType;
  reason: string;
  status: LeaveStatus;
  appliedOn: string; // YYYY-MM-DD
  reviewedBy?: string;
  reviewedOn?: string;
  hrRemarks?: string;
  aiSuggested?: boolean;
  aiConfidence?: number;
  aiExplanation?: string;
  contactDuringLeave?: string;
}

export interface LeaveSuggestionResult {
  suggestedType: LeaveCategory;
  confidence: number;
  explanation: string;
  source: 'gemini' | 'heuristic';
}
