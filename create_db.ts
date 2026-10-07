import Database from 'better-sqlite3';
import { INITIAL_EMPLOYEES, INITIAL_LEAVE_REQUESTS } from './src/data/mockData';

const db = new Database('leave_ease.db');

// Create Employees Table
db.exec(`
  CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    employeeCode TEXT,
    name TEXT,
    email TEXT,
    phone TEXT,
    role TEXT,
    department TEXT,
    designation TEXT,
    joiningDate TEXT,
    leaveBalance TEXT
  )
`);

// Create Leave Requests Table
db.exec(`
  CREATE TABLE IF NOT EXISTS leave_requests (
    id TEXT PRIMARY KEY,
    employeeId TEXT,
    employeeName TEXT,
    employeeCode TEXT,
    department TEXT,
    leaveType TEXT,
    startDate TEXT,
    endDate TEXT,
    daysCount REAL,
    durationType TEXT,
    reason TEXT,
    status TEXT,
    appliedOn TEXT,
    reviewedBy TEXT,
    reviewedOn TEXT,
    hrRemarks TEXT,
    aiSuggested INTEGER,
    aiConfidence REAL,
    aiExplanation TEXT,
    contactDuringLeave TEXT
  )
`);

// Clear existing data to avoid duplicates
db.exec('DELETE FROM employees');
db.exec('DELETE FROM leave_requests');

// Insert Employees
const insertEmployee = db.prepare(`
  INSERT INTO employees (
    id, employeeCode, name, email, phone, role, department, designation, joiningDate, leaveBalance
  ) VALUES (
    @id, @employeeCode, @name, @email, @phone, @role, @department, @designation, @joiningDate, @leaveBalance
  )
`);

INITIAL_EMPLOYEES.forEach(emp => {
  insertEmployee.run({
    ...emp,
    leaveBalance: JSON.stringify(emp.leaveBalance)
  });
});

// Insert Leave Requests
const insertLeaveRequest = db.prepare(`
  INSERT INTO leave_requests (
    id, employeeId, employeeName, employeeCode, department, leaveType, startDate, endDate, daysCount, durationType, reason, status, appliedOn, reviewedBy, reviewedOn, hrRemarks, aiSuggested, aiConfidence, aiExplanation, contactDuringLeave
  ) VALUES (
    @id, @employeeId, @employeeName, @employeeCode, @department, @leaveType, @startDate, @endDate, @daysCount, @durationType, @reason, @status, @appliedOn, @reviewedBy, @reviewedOn, @hrRemarks, @aiSuggested, @aiConfidence, @aiExplanation, @contactDuringLeave
  )
`);

INITIAL_LEAVE_REQUESTS.forEach(req => {
  insertLeaveRequest.run({
    ...req,
    reviewedBy: req.reviewedBy || null,
    reviewedOn: req.reviewedOn || null,
    hrRemarks: req.hrRemarks || null,
    aiSuggested: req.aiSuggested ? 1 : 0,
    aiConfidence: req.aiConfidence || null,
    aiExplanation: req.aiExplanation || null,
    contactDuringLeave: req.contactDuringLeave || null
  });
});

console.log('Successfully created leave_ease.db and populated with mock data.');
