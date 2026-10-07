import * as fs from 'fs';
import { INITIAL_EMPLOYEES, INITIAL_LEAVE_REQUESTS } from './src/data/mockData';

let sql = `
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
);

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
);

DELETE FROM employees;
DELETE FROM leave_requests;
`;

function escapeString(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

for (const emp of INITIAL_EMPLOYEES) {
  const values = [
    escapeString(emp.id),
    escapeString(emp.employeeCode),
    escapeString(emp.name),
    escapeString(emp.email),
    escapeString(emp.phone),
    escapeString(emp.role),
    escapeString(emp.department),
    escapeString(emp.designation),
    escapeString(emp.joiningDate),
    escapeString(JSON.stringify(emp.leaveBalance))
  ];
  sql += `INSERT INTO employees (id, employeeCode, name, email, phone, role, department, designation, joiningDate, leaveBalance) VALUES (${values.join(', ')});\n`;
}

for (const req of INITIAL_LEAVE_REQUESTS) {
  const values = [
    escapeString(req.id),
    escapeString(req.employeeId),
    escapeString(req.employeeName),
    escapeString(req.employeeCode),
    escapeString(req.department),
    escapeString(req.leaveType),
    escapeString(req.startDate),
    escapeString(req.endDate),
    req.daysCount,
    escapeString(req.durationType),
    escapeString(req.reason),
    escapeString(req.status),
    escapeString(req.appliedOn),
    escapeString(req.reviewedBy),
    escapeString(req.reviewedOn),
    escapeString(req.hrRemarks),
    req.aiSuggested ? 1 : 0,
    req.aiConfidence !== undefined ? req.aiConfidence : 'NULL',
    escapeString(req.aiExplanation),
    escapeString(req.contactDuringLeave)
  ];
  sql += `INSERT INTO leave_requests (id, employeeId, employeeName, employeeCode, department, leaveType, startDate, endDate, daysCount, durationType, reason, status, appliedOn, reviewedBy, reviewedOn, hrRemarks, aiSuggested, aiConfidence, aiExplanation, contactDuringLeave) VALUES (${values.join(', ')});\n`;
}

fs.writeFileSync('init.sql', sql);
console.log('init.sql generated successfully.');
