import sqlite3
import json
from http.server import HTTPServer, BaseHTTPRequestHandler

class DBHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            try:
                conn = sqlite3.connect('leave_ease.db')
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                
                cursor.execute("SELECT * FROM employees")
                employees = cursor.fetchall()
                
                cursor.execute("SELECT * FROM leave_requests")
                leave_requests = cursor.fetchall()
                
                conn.close()
                
                html = """
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
                """
                
                if employees:
                    html += "<tr>"
                    for key in employees[0].keys():
                        html += f"<th>{key}</th>"
                    html += "</tr>"
                    
                    for row in employees:
                        html += "<tr>"
                        for val in row:
                            html += f"<td>{val}</td>"
                        html += "</tr>"
                else:
                    html += "<tr><th>No Data</th></tr>"
                    
                html += """
                    </table>
                    
                    <h2>Leave Requests Table</h2>
                    <table>
                """
                
                if leave_requests:
                    html += "<tr>"
                    for key in leave_requests[0].keys():
                        html += f"<th>{key}</th>"
                    html += "</tr>"
                    
                    for row in leave_requests:
                        html += "<tr>"
                        for val in row:
                            html += f"<td>{val}</td>"
                        html += "</tr>"
                else:
                    html += "<tr><th>No Data</th></tr>"
                    
                html += """
                    </table>
                  </body>
                </html>
                """
                
                self.wfile.write(html.encode('utf-8'))
            except Exception as e:
                self.wfile.write(f"Error: {e}".encode('utf-8'))

if __name__ == '__main__':
    port = 4000
    server_address = ('', port)
    httpd = HTTPServer(server_address, DBHandler)
    print(f'Database Viewer running at http://localhost:{port}')
    httpd.serve_forever()
