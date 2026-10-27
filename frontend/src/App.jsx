import React, { useState } from "react";

function App() {
  const [employees] = useState([
    {
      employeeId: "NV001",
      fullName: "Nguyễn Văn An",
      gender: "Nam",
      department: "Công nghệ thông tin",
      position: "Nhân viên",
      email: "an@example.com",
      status: "Đang làm việc",
    },
    {
      employeeId: "NV002",
      fullName: "Trần Thị Bình",
      gender: "Nữ",
      department: "Nhân sự",
      position: "Chuyên viên",
      email: "binh@example.com",
      status: "Đang làm việc",
    },
    {
      employeeId: "NV003",
      fullName: "Lê Minh Khánh",
      gender: "Nam",
      department: "Kế toán",
      position: "Trưởng phòng",
      email: "khanh@example.com",
      status: "Đang làm việc",
    },
  ]);

  return (
    <main className="page">
      <header className="header">
        <div>
          <p className="eyebrow">HUMAN RESOURCE MANAGEMENT</p>
          <h1>Quản lý nhân sự</h1>
          <p className="subtitle">
            Hệ thống quản lý thông tin nhân viên
          </p>
        </div>
        <div className="student">
          <strong>Nguyễn Trần Đoan Trang</strong>
          <span>MSSV: 237384 · DH23TIN10</span>
        </div>
      </header>

      <section className="summary">
        <div className="summary-card">
          <span>Tổng số nhân viên</span>
          <strong>{employees.length}</strong>
        </div>
        <div className="summary-card">
          <span>Đang làm việc</span>
          <strong>{employees.filter((e) => e.status === "Đang làm việc").length}</strong>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Danh sách nhân viên</h2>
            <p>Thông tin nhân sự trong hệ thống</p>
          </div>
          <span className="badge">{employees.length} nhân viên</span>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Mã nhân viên</th>
                <th>Họ và tên</th>
                <th>Giới tính</th>
                <th>Phòng ban</th>
                <th>Chức vụ</th>
                <th>Email</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.employeeId}>
                  <td className="employee-id">{employee.employeeId}</td>
                  <td>{employee.fullName}</td>
                  <td>{employee.gender}</td>
                  <td>{employee.department}</td>
                  <td>{employee.position}</td>
                  <td>{employee.email}</td>
                  <td>
                    <span className="status">
                      {employee.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer>
        Bài thi Điện toán đám mây · Hệ thống quản lý nhân sự
      </footer>
    </main>
  );
}

export default App;