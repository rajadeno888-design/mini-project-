import express from 'express';
import Database from 'better-sqlite3';
import path from 'path';

const app = express();
const port = 4000;

const db = new Database('leave_ease.db');

app.get('/', (req, res) => {
  const employees = db.prepare('SELECT * FROM employees').all();
  const leaveRequests = db.prepare('SELECT * FROM leave_requests').all();

  const html = `
    <html>
      <head>
        <title>SQLite Database Viewer</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 20px; background: #f8fafc; }
          h1, h2 { color: #0f172a; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          th, td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; }
          th { background: #f1f5f9; font-weight: 600; }
        </style>
      </head>
      <body>
        <h1>LeaveEase SQLite Database Viewer</h1>
        
        <h2>Employees Table</h2>
        <table>
          <tr>
            ${employees.length > 0 ? Object.keys(employees[0]).map(k => `<th>${k}</th>`).join('') : '<th>No Data</th>'}
          </tr>
          ${employees.map(e => `
            <tr>
              ${Object.values(e).map(v => `<td>${v}</td>`).join('')}
            </tr>
          `).join('')}
        </table>

        <h2>Leave Requests Table</h2>
        <table>
          <tr>
            ${leaveRequests.length > 0 ? Object.keys(leaveRequests[0]).map(k => `<th>${k}</th>`).join('') : '<th>No Data</th>'}
          </tr>
          ${leaveRequests.map(lr => `
            <tr>
              ${Object.values(lr).map(v => `<td>${v}</td>`).join('')}
            </tr>
          `).join('')}
        </table>
      </body>
    </html>
  `;
  res.send(html);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Database Viewer running at http://localhost:${port}`);
});
