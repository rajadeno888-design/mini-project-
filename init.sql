
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
INSERT INTO employees (id, employeeCode, name, email, phone, role, department, designation, joiningDate, leaveBalance) VALUES ('emp-1', 'EMP-101', 'Rahul Sharma', 'xyz@gmail.com', '+91 98765 43210', 'employee', 'Software Engineering', 'Senior Frontend Developer', '2023-04-15', '{"casual":{"total":12,"used":2},"sick":{"total":10,"used":2},"earned":{"total":15,"used":5},"emergency":{"total":5,"used":0},"maternityPaternity":{"total":15,"used":0}}');
INSERT INTO employees (id, employeeCode, name, email, phone, role, department, designation, joiningDate, leaveBalance) VALUES ('emp-2', 'EMP-102', 'Priya Patel', 'priya.patel@apextech.com', '+91 98765 43211', 'employee', 'Product Design', 'UI/UX Lead Designer', '2022-09-01', '{"casual":{"total":12,"used":4},"sick":{"total":10,"used":1},"earned":{"total":15,"used":6},"emergency":{"total":5,"used":0},"maternityPaternity":{"total":90,"used":0}}');
INSERT INTO employees (id, employeeCode, name, email, phone, role, department, designation, joiningDate, leaveBalance) VALUES ('emp-3', 'EMP-103', 'Amit Verma', 'amit.verma@apextech.com', '+91 98765 43212', 'employee', 'Quality Assurance', 'QA Automation Lead', '2023-01-10', '{"casual":{"total":12,"used":5},"sick":{"total":10,"used":3},"earned":{"total":15,"used":4},"emergency":{"total":5,"used":1},"maternityPaternity":{"total":15,"used":0}}');
INSERT INTO employees (id, employeeCode, name, email, phone, role, department, designation, joiningDate, leaveBalance) VALUES ('emp-4', 'EMP-104', 'Sneha Reddy', 'sneha.reddy@apextech.com', '+91 98765 43213', 'employee', 'Marketing', 'Growth Marketing Manager', '2024-02-01', '{"casual":{"total":12,"used":3},"sick":{"total":10,"used":1},"earned":{"total":15,"used":2},"emergency":{"total":5,"used":0},"maternityPaternity":{"total":90,"used":0}}');
INSERT INTO employees (id, employeeCode, name, email, phone, role, department, designation, joiningDate, leaveBalance) VALUES ('emp-5', 'EMP-105', 'Vikram Sethi', 'vikram.sethi@apextech.com', '+91 98765 43214', 'employee', 'Cloud Infrastructure', 'DevOps & Site Reliability Engineer', '2022-11-20', '{"casual":{"total":12,"used":4},"sick":{"total":10,"used":2},"earned":{"total":15,"used":7},"emergency":{"total":5,"used":1},"maternityPaternity":{"total":15,"used":0}}');
INSERT INTO employees (id, employeeCode, name, email, phone, role, department, designation, joiningDate, leaveBalance) VALUES ('emp-hr', 'HR-001', 'Anita Desai', 'zyx@gmail.com', '+91 98765 43215', 'hr', 'Human Resources', 'Head of Human Resources', '2021-06-01', '{"casual":{"total":12,"used":1},"sick":{"total":10,"used":0},"earned":{"total":15,"used":3},"emergency":{"total":5,"used":0},"maternityPaternity":{"total":90,"used":0}}');
INSERT INTO leave_requests (id, employeeId, employeeName, employeeCode, department, leaveType, startDate, endDate, daysCount, durationType, reason, status, appliedOn, reviewedBy, reviewedOn, hrRemarks, aiSuggested, aiConfidence, aiExplanation, contactDuringLeave) VALUES ('LR-2026-001', 'emp-1', 'Rahul Sharma', 'EMP-101', 'Software Engineering', 'Sick Leave', '2026-10-12', '2026-10-13', 2, 'Full Day', 'Down with viral fever and throat infection, advised 2 days bed rest by physician.', 'Pending', '2026-10-06', NULL, NULL, NULL, 1, 0.96, 'Health-related illness with fever and medical bed rest advice falls under Sick Leave.', '+91 98765 43210');
INSERT INTO leave_requests (id, employeeId, employeeName, employeeCode, department, leaveType, startDate, endDate, daysCount, durationType, reason, status, appliedOn, reviewedBy, reviewedOn, hrRemarks, aiSuggested, aiConfidence, aiExplanation, contactDuringLeave) VALUES ('LR-2026-002', 'emp-2', 'Priya Patel', 'EMP-102', 'Product Design', 'Casual Leave', '2026-10-15', '2026-10-16', 2, 'Full Day', 'Attending cousin’s wedding ceremony in Ahmedabad with family.', 'Pending', '2026-10-05', NULL, NULL, NULL, 1, 0.94, 'Family function and wedding ceremony qualifies as Casual Leave.', '+91 98765 43211');
INSERT INTO leave_requests (id, employeeId, employeeName, employeeCode, department, leaveType, startDate, endDate, daysCount, durationType, reason, status, appliedOn, reviewedBy, reviewedOn, hrRemarks, aiSuggested, aiConfidence, aiExplanation, contactDuringLeave) VALUES ('LR-2026-003', 'emp-3', 'Amit Verma', 'EMP-103', 'Quality Assurance', 'Emergency Leave', '2026-10-08', '2026-10-08', 1, 'Full Day', 'Urgent home pipe breakdown and electrical short circuit repair needed immediate presence.', 'Pending', '2026-10-07', NULL, NULL, NULL, 1, 0.92, 'Unforeseen domestic crisis requiring immediate presence qualifies as Emergency Leave.', '+91 98765 43212');
INSERT INTO leave_requests (id, employeeId, employeeName, employeeCode, department, leaveType, startDate, endDate, daysCount, durationType, reason, status, appliedOn, reviewedBy, reviewedOn, hrRemarks, aiSuggested, aiConfidence, aiExplanation, contactDuringLeave) VALUES ('LR-2026-004', 'emp-4', 'Sneha Reddy', 'EMP-104', 'Marketing', 'Earned Leave', '2026-10-20', '2026-10-23', 4, 'Full Day', 'Annual pre-planned family vacation to Kerala backwaters.', 'Pending', '2026-10-06', NULL, NULL, NULL, 1, 0.95, 'Multi-day leisure vacation planned in advance belongs under Earned Leave.', '+91 98765 43213');
INSERT INTO leave_requests (id, employeeId, employeeName, employeeCode, department, leaveType, startDate, endDate, daysCount, durationType, reason, status, appliedOn, reviewedBy, reviewedOn, hrRemarks, aiSuggested, aiConfidence, aiExplanation, contactDuringLeave) VALUES ('LR-2026-005', 'emp-5', 'Vikram Sethi', 'EMP-105', 'Cloud Infrastructure', 'Casual Leave', '2026-10-07', '2026-10-07', 1, 'Full Day', 'Regional passport renewal appointment and biometric verification.', 'Approved', '2026-10-03', 'Anita Desai (HR)', '2026-10-04', 'Approved. Cloud on-call support handed over to primary backup.', 1, 0.91, 'Government appointment and documentation falls under Casual Leave.', '+91 98765 43214');
INSERT INTO leave_requests (id, employeeId, employeeName, employeeCode, department, leaveType, startDate, endDate, daysCount, durationType, reason, status, appliedOn, reviewedBy, reviewedOn, hrRemarks, aiSuggested, aiConfidence, aiExplanation, contactDuringLeave) VALUES ('LR-2026-006', 'emp-2', 'Priya Patel', 'EMP-102', 'Product Design', 'Casual Leave', '2026-10-07', '2026-10-07', 0.5, 'Second Half', 'Dental checkup and orthodontic consultation scheduled at clinic.', 'Approved', '2026-10-04', 'Anita Desai (HR)', '2026-10-05', 'Approved for second half.', 1, 0.93, 'Medical checkup and dental consultation falls under Casual / Medical Leave.', '+91 98765 43211');
INSERT INTO leave_requests (id, employeeId, employeeName, employeeCode, department, leaveType, startDate, endDate, daysCount, durationType, reason, status, appliedOn, reviewedBy, reviewedOn, hrRemarks, aiSuggested, aiConfidence, aiExplanation, contactDuringLeave) VALUES ('LR-2026-007', 'emp-1', 'Rahul Sharma', 'EMP-101', 'Software Engineering', 'Casual Leave', '2026-09-18', '2026-09-18', 1, 'Full Day', 'Attending parent-teacher conference and family function in native town.', 'Approved', '2026-09-14', 'Anita Desai (HR)', '2026-09-15', 'Approved. Sprint deliverables were handed over.', 1, 0.93, 'Family function and personal errand falls under Casual Leave.', '+91 98765 43210');
INSERT INTO leave_requests (id, employeeId, employeeName, employeeCode, department, leaveType, startDate, endDate, daysCount, durationType, reason, status, appliedOn, reviewedBy, reviewedOn, hrRemarks, aiSuggested, aiConfidence, aiExplanation, contactDuringLeave) VALUES ('LR-2026-008', 'emp-1', 'Rahul Sharma', 'EMP-101', 'Software Engineering', 'Earned Leave', '2026-09-28', '2026-09-30', 3, 'Full Day', 'Weekend trip extension for personal travel.', 'Rejected', '2026-09-25', 'Anita Desai (HR)', '2026-09-26', 'Critical client demo scheduled on September 29th. Please plan leave for next week instead.', 0, NULL, NULL, '+91 98765 43210');
INSERT INTO leave_requests (id, employeeId, employeeName, employeeCode, department, leaveType, startDate, endDate, daysCount, durationType, reason, status, appliedOn, reviewedBy, reviewedOn, hrRemarks, aiSuggested, aiConfidence, aiExplanation, contactDuringLeave) VALUES ('LR-2026-009', 'emp-5', 'Vikram Sethi', 'EMP-105', 'Cloud Infrastructure', 'Earned Leave', '2026-09-08', '2026-09-12', 5, 'Full Day', 'Annual trekking expedition in Manali planned well in advance.', 'Approved', '2026-08-20', 'Anita Desai (HR)', '2026-08-22', 'Approved. Handover confirmed.', 0, NULL, NULL, '+91 98765 43214');
INSERT INTO leave_requests (id, employeeId, employeeName, employeeCode, department, leaveType, startDate, endDate, daysCount, durationType, reason, status, appliedOn, reviewedBy, reviewedOn, hrRemarks, aiSuggested, aiConfidence, aiExplanation, contactDuringLeave) VALUES ('LR-2026-010', 'emp-3', 'Amit Verma', 'EMP-103', 'Quality Assurance', 'Sick Leave', '2026-09-15', '2026-09-16', 2, 'Full Day', 'Severe food poisoning and dehydration, under doctor medical treatment.', 'Approved', '2026-09-14', 'Anita Desai (HR)', '2026-09-15', 'Approved. Get well soon.', 0, NULL, NULL, '+91 98765 43212');
