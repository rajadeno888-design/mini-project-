import React, { createContext, useContext, useState, useEffect } from 'react';
import { Employee, LeaveRequest, LeaveCategory, LeaveStatus } from '../types';
import { INITIAL_EMPLOYEES, INITIAL_LEAVE_REQUESTS } from '../data/mockData';

interface LeaveContextType {
  currentUser: Employee | null;
  setCurrentUser: (user: Employee | null) => void;
  loginAs: (empIdOrCode: string) => boolean;
  loginWithCredentials: (emailOrCode: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  applyLeave: (data: {
    leaveType: LeaveCategory;
    startDate: string;
    endDate: string;
    daysCount: number;
    durationType: 'Full Day' | 'First Half' | 'Second Half';
    reason: string;
    aiSuggested?: boolean;
    aiConfidence?: number;
    aiExplanation?: string;
    contactDuringLeave?: string;
  }) => { success: boolean; message: string; request?: LeaveRequest };
  approveLeave: (requestId: string, remarks?: string) => void;
  rejectLeave: (requestId: string, remarks: string) => void;
  cancelLeave: (requestId: string) => void;
  addEmployee: (empData: Omit<Employee, 'id'>) => Employee;
  updateEmployeeBalance: (employeeId: string, balances: Employee['leaveBalance']) => void;
  resetToSampleData: () => void;
}

const STORAGE_KEY_EMPLOYEES = 'leave_mgmt_employees_v4';
const STORAGE_KEY_REQUESTS = 'leave_mgmt_requests_v4';
const STORAGE_KEY_CURRENT_USER = 'leave_mgmt_current_user_v4';

const LeaveContext = createContext<LeaveContextType | undefined>(undefined);

export const LeaveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_EMPLOYEES);
      return stored ? JSON.parse(stored) : INITIAL_EMPLOYEES;
    } catch {
      return INITIAL_EMPLOYEES;
    }
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_REQUESTS);
      return stored ? JSON.parse(stored) : INITIAL_LEAVE_REQUESTS;
    } catch {
      return INITIAL_LEAVE_REQUESTS;
    }
  });

  const [currentUser, setCurrentUser] = useState<Employee | null>(() => {
    try {
      const storedId = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      if (storedId) {
        const found = employees.find((e) => e.id === storedId || e.employeeCode === storedId);
        if (found) return found;
      }
      return null;
    } catch {
      return null;
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EMPLOYEES, JSON.stringify(employees));
    } catch (e) {
      console.error(e);
    }
  }, [employees]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(leaveRequests));
    } catch (e) {
      console.error(e);
    }
  }, [leaveRequests]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_CURRENT_USER, currentUser.id);
      } else {
        localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  // Keep currentUser reference synchronized when employees state updates
  useEffect(() => {
    if (currentUser) {
      const updated = employees.find((e) => e.id === currentUser.id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(currentUser)) {
        setCurrentUser(updated);
      }
    }
  }, [employees]);

  const loginAs = (empIdOrCode: string): boolean => {
    const trimmed = empIdOrCode.trim().toLowerCase();
    const found = employees.find(
      (e) =>
        e.id.toLowerCase() === trimmed ||
        e.employeeCode.toLowerCase() === trimmed ||
        e.email.toLowerCase() === trimmed
    );
    if (found) {
      setCurrentUser(found);
      return true;
    }
    return false;
  };

  const loginWithCredentials = (
    emailOrCode: string,
    password: string
  ): { success: boolean; message?: string } => {
    const inputId = emailOrCode.trim().toLowerCase();
    const inputPass = password.trim();

    // Check Employee credentials
    if (
      inputId === 'rahul.sharma@apextech.com' ||
      inputId === 'rahul.sharma@apex.com' ||
      inputId === 'xyz@gmail.com' ||
      inputId === 'emp-101' ||
      inputId === 'emp101' ||
      inputId.includes('rahul') ||
      inputId.includes('emp')
    ) {
      if (inputPass === 'emp123' || inputPass === 'password123' || inputPass.length > 0) {
        const emp = employees.find((e) => e.role === 'employee') || employees[0];
        setCurrentUser(emp);
        return { success: true };
      }
      return { success: false, message: 'Incorrect password for Employee.' };
    }

    // Check HR credentials
    if (
      inputId === 'anita.desai@apextech.com' ||
      inputId === 'anita.desai@apex.com' ||
      inputId === 'zyx@gmail.com' ||
      inputId === 'hr-001' ||
      inputId === 'hr001' ||
      inputId.includes('anita') ||
      inputId.includes('hr')
    ) {
      if (inputPass === 'hr123' || inputPass === 'password123' || inputPass.length > 0) {
        const hr = employees.find((e) => e.role === 'hr') || employees[employees.length - 1];
        setCurrentUser(hr);
        return { success: true };
      }
      return { success: false, message: 'Incorrect password for HR Manager.' };
    }

    // Default fallback matching employee list
    const matched = employees.find(
      (e) => e.email.toLowerCase() === inputId || e.employeeCode.toLowerCase() === inputId
    );
    if (matched) {
      setCurrentUser(matched);
      return { success: true };
    }

    // Auto sign in as employee if any credentials entered
    const defaultUser = employees.find((e) => e.role === 'employee') || employees[0];
    setCurrentUser(defaultUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const applyLeave = (data: {
    leaveType: LeaveCategory;
    startDate: string;
    endDate: string;
    daysCount: number;
    durationType: 'Full Day' | 'First Half' | 'Second Half';
    reason: string;
    aiSuggested?: boolean;
    aiConfidence?: number;
    aiExplanation?: string;
    contactDuringLeave?: string;
  }) => {
    if (!currentUser) {
      return { success: false, message: 'You must be logged in to apply for leave.' };
    }

    // Check balance availability
    const balanceKeyMap: Record<LeaveCategory, keyof Employee['leaveBalance']> = {
      'Casual Leave': 'casual',
      'Sick Leave': 'sick',
      'Earned Leave': 'earned',
      'Emergency Leave': 'emergency',
      'Maternity / Paternity Leave': 'maternityPaternity',
    };

    const key = balanceKeyMap[data.leaveType];
    const categoryBalance = currentUser.leaveBalance[key];
    const available = categoryBalance.total - categoryBalance.used;

    if (data.daysCount > available) {
      return {
        success: false,
        message: `Insufficient leave balance! You requested ${data.daysCount} day(s), but only have ${available} day(s) remaining for ${data.leaveType}.`,
      };
    }

    const newRequest: LeaveRequest = {
      id: `LR-${new Date().getFullYear()}-${String(leaveRequests.length + 1).padStart(3, '0')}`,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      employeeCode: currentUser.employeeCode,
      department: currentUser.department,
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      daysCount: data.daysCount,
      durationType: data.durationType,
      reason: data.reason,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0],
      aiSuggested: data.aiSuggested,
      aiConfidence: data.aiConfidence,
      aiExplanation: data.aiExplanation,
      contactDuringLeave: data.contactDuringLeave || currentUser.phone,
    };

    setLeaveRequests((prev) => [newRequest, ...prev]);

    return {
      success: true,
      message: 'Leave application submitted successfully for HR review.',
      request: newRequest,
    };
  };

  const approveLeave = (requestId: string, remarks?: string) => {
    const target = leaveRequests.find((r) => r.id === requestId);
    if (!target) return;

    const reviewerName = currentUser ? `${currentUser.name} (HR)` : 'HR Department';
    const today = new Date().toISOString().split('T')[0];

    // Update request status
    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'Approved' as LeaveStatus,
              reviewedBy: reviewerName,
              reviewedOn: today,
              hrRemarks: remarks || 'Leave request approved by HR.',
            }
          : r
      )
    );

    // Deduct leave balance from employee
    const balanceKeyMap: Record<LeaveCategory, keyof Employee['leaveBalance']> = {
      'Casual Leave': 'casual',
      'Sick Leave': 'sick',
      'Earned Leave': 'earned',
      'Emergency Leave': 'emergency',
      'Maternity / Paternity Leave': 'maternityPaternity',
    };

    const bKey = balanceKeyMap[target.leaveType];

    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === target.employeeId) {
          const currentCategory = emp.leaveBalance[bKey];
          return {
            ...emp,
            leaveBalance: {
              ...emp.leaveBalance,
              [bKey]: {
                ...currentCategory,
                used: currentCategory.used + target.daysCount,
              },
            },
          };
        }
        return emp;
      })
    );
  };

  const rejectLeave = (requestId: string, remarks: string) => {
    const reviewerName = currentUser ? `${currentUser.name} (HR)` : 'HR Department';
    const today = new Date().toISOString().split('T')[0];

    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'Rejected' as LeaveStatus,
              reviewedBy: reviewerName,
              reviewedOn: today,
              hrRemarks: remarks || 'Rejected by HR due to operational requirements.',
            }
          : r
      )
    );
  };

  const cancelLeave = (requestId: string) => {
    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === requestId && r.status === 'Pending'
          ? {
              ...r,
              status: 'Cancelled' as LeaveStatus,
              hrRemarks: 'Cancelled by employee.',
            }
          : r
      )
    );
  };

  const addEmployee = (empData: Omit<Employee, 'id'>): Employee => {
    const newEmp: Employee = {
      ...empData,
      id: `emp-${Date.now()}`,
    };
    setEmployees((prev) => [...prev, newEmp]);
    return newEmp;
  };

  const updateEmployeeBalance = (employeeId: string, balances: Employee['leaveBalance']) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === employeeId ? { ...emp, leaveBalance: balances } : emp))
    );
  };

  const resetToSampleData = () => {
    localStorage.removeItem(STORAGE_KEY_EMPLOYEES);
    localStorage.removeItem(STORAGE_KEY_REQUESTS);
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    setEmployees(INITIAL_EMPLOYEES);
    setLeaveRequests(INITIAL_LEAVE_REQUESTS);
    setCurrentUser(INITIAL_EMPLOYEES[0]);
  };

  return (
    <LeaveContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loginAs,
        loginWithCredentials,
        logout,
        employees,
        leaveRequests,
        applyLeave,
        approveLeave,
        rejectLeave,
        cancelLeave,
        addEmployee,
        updateEmployeeBalance,
        resetToSampleData,
      }}
    >
      {children}
    </LeaveContext.Provider>
  );
};

export const useLeave = () => {
  const context = useContext(LeaveContext);
  if (!context) {
    throw new Error('useLeave must be used within a LeaveProvider');
  }
  return context;
};
