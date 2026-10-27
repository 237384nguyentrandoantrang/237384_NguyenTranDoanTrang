
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Users, UserPlus, Search, RefreshCw, Pencil, Trash2,
  Eye, X, BriefcaseBusiness, Mail, Phone, Building2
} from "lucide-react";
import "./index.css";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000")
  .replace(/\/$/, "") + "/api/employees";

const EMPTY_FORM = {
  employeeId: "",
  fullName: "",
  gender: "Nam",
  dateOfBirth: "",
  department: "",
  position: "",
  email: "",
  phone: "",
  hireDate: "",
  status: "Đang làm việc"
};

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers
    }
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(result.message || `Lỗi máy chủ (${response.status})`);
  }

  return result;
}

function formatDate(value) {
  if (!value) return "—";
  return String(value).slice(0, 10);
}

function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState({ type: "", message: "" });
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const showNotice = (type, message) => setNotice({ type, message });

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiRequest(API_URL);
      setEmployees(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      showNotice("error", `Không tải được danh sách: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  // Loc o Frontend de tim kiem van hoat dong
  // ngay ca khi Backend chua loc query search chinh xac.
  const filteredEmployees = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase("vi");
    if (!keyword) return employees;

    return employees.filter((employee) =>
      String(employee.employeeId || "").toLocaleLowerCase("vi").includes(keyword) ||
      String(employee.fullName || "").toLocaleLowerCase("vi").includes(keyword)
    );
  }, [employees, search]);

  function openCreate() {
    setForm(EMPTY_FORM);
    setModal({ type: "create" });
  }

  function openEdit(employee) {
    setForm({
      ...EMPTY_FORM,
      ...employee,
      dateOfBirth: formatDate(employee.dateOfBirth),
      hireDate: formatDate(employee.hireDate)
    });
    setModal({ type: "edit", employee });
  }

  function openDetail(employee) {
    setModal({ type: "detail", employee });
  }

  function closeModal() {
    if (!saving) setModal(null);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const required = [
      "employeeId", "fullName", "gender", "dateOfBirth",
      "department", "position", "email", "phone", "hireDate"
    ];

    const missing = required.filter(
      (field) => !String(form[field] || "").trim()
    );

    if (missing.length) {
      showNotice("error", "Vui lòng nhập đầy đủ các trường bắt buộc.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      showNotice("error", "Email không đúng định dạng.");
      return;
    }

    setSaving(true);

    try {
      const isEdit = modal.type === "edit";
      const url = isEdit
        ? `${API_URL}/${encodeURIComponent(modal.employee.employeeId)}`
        : API_URL;

      const payload = { ...form };
      if (isEdit) delete payload.employeeId;

      await apiRequest(url, {
        method: isEdit ? "PUT" : "POST",
        body: JSON.stringify(payload)
      });

      setModal(null);
      showNotice("success", isEdit
        ? "Cập nhật nhân viên thành công."
        : "Thêm nhân viên thành công.");

      await loadEmployees();
    } catch (error) {
      showNotice("error", `Không lưu được nhân viên: ${error.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(employee) {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa nhân viên ${employee.fullName} (${employee.employeeId}) không?`
    );

    if (!confirmed) return;

    try {
      await apiRequest(`${API_URL}/${encodeURIComponent(employee.employeeId)}`, {
        method: "DELETE"
      });

      showNotice("success", "Xóa nhân viên thành công.");
      await loadEmployees();
    } catch (error) {
      showNotice("error", `Không xóa được nhân viên: ${error.message}`);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo"><Users size={24} /></div>
          <div>
            <strong>HR Manager</strong>
            <span>QUẢN LÝ NHÂN SỰ</span>
          </div>
        </div>

        <div className="sidebar-label">MENU CHÍNH</div>
        <div className="nav-item active">
          <Users size={19} /> Danh sách nhân viên
        </div>

        <div className="sidebar-bottom">
          <div className="avatar">TT</div>
          <div className="user-info">
            <strong>Quản trị viên</strong>
            <span>Hệ thống nhân sự</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <div className="breadcrumb">Trang chủ / Nhân sự</div>
            <h1>Quản lý nhân sự</h1>
            <p>Quản lý hồ sơ và thông tin nhân viên của doanh nghiệp.</p>
          </div>
          <button className="primary-button" onClick={openCreate}>
            <UserPlus size={18} /> Thêm nhân viên
          </button>
        </header>

        {notice.message && (
          <div className={`notice ${notice.type}`} role="status">
            <span>{notice.message}</span>
            <button className="notice-close" onClick={() => setNotice({ type: "", message: "" })}>
              <X size={17} />
            </button>
          </div>
        )}

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple"><Users size={22} /></div>
            <div><span>Tổng nhân viên</span><strong>{employees.length}</strong></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green"><BriefcaseBusiness size={22} /></div>
            <div><span>Đang làm việc</span><strong>{employees.filter(e => e.status === "Đang làm việc").length}</strong></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange"><Building2 size={22} /></div>
            <div><span>Phòng ban</span><strong>{new Set(employees.map(e => e.department).filter(Boolean)).size}</strong></div>
          </div>
        </section>

        <section className="content-card">
          <div className="table-heading">
            <div>
              <h2>Danh sách nhân viên</h2>
              <p>Thông tin nhân sự được đồng bộ từ hệ thống.</p>
            </div>
            <button className="secondary-button" onClick={loadEmployees} disabled={loading}>
              <RefreshCw size={16} className={loading ? "spin" : ""} />
              Làm mới
            </button>
          </div>

          <div className="toolbar">
            <div className="search-box">
              <Search size={19} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm theo mã nhân viên hoặc họ tên..."
                aria-label="Tìm nhân viên"
              />
              {search && (
                <button className="clear-search" onClick={() => setSearch("")} aria-label="Xóa tìm kiếm">
                  <X size={16} />
                </button>
              )}
            </div>
            <span className="result-count">{filteredEmployees.length} nhân viên</span>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>NHÂN VIÊN</th>
                  <th>PHÒNG BAN</th>
                  <th>CHỨC VỤ</th>
                  <th>LIÊN HỆ</th>
                  <th>TRẠNG THÁI</th>
                  <th>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="empty-state">Đang tải dữ liệu nhân viên...</td></tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr><td colSpan="6" className="empty-state">Không tìm thấy nhân viên phù hợp.</td></tr>
                ) : filteredEmployees.map((employee) => (
                  <tr key={employee._id || employee.employeeId}>
                    <td>
                      <div className="employee-cell">
                        <div className="employee-avatar">
                          {String(employee.fullName || "?").trim().charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{employee.fullName}</strong>
                          <span>{employee.employeeId}</span>
                        </div>
                      </div>
                    </td>
                    <td>{employee.department || "—"}</td>
                    <td>{employee.position || "—"}</td>
                    <td>
                      <div className="contact-cell">
                        <span><Mail size={14} /> {employee.email || "—"}</span>
                        <span><Phone size={14} /> {employee.phone || "—"}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${employee.status === "Đang làm việc" ? "working" : "other"}`}>
                        {employee.status || "Chưa cập nhật"}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button className="icon-button view" title="Xem chi tiết" onClick={() => openDetail(employee)}>
                          <Eye size={17} />
                        </button>
                        <button className="icon-button edit" title="Chỉnh sửa" onClick={() => openEdit(employee)}>
                          <Pencil size={17} />
                        </button>
                        <button className="icon-button delete" title="Xóa nhân viên" onClick={() => handleDelete(employee)}>
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-footer">
            <span>Hiển thị {filteredEmployees.length} / {employees.length} nhân viên</span>
            <span>HR Management System</span>
          </div>
        </section>

        <footer className="page-footer">
          <span>© 2026 HR Management System</span>
          <span>Nguyễn Trần Đoan Trang · MSSV 237384</span>
        </footer>
      </main>

      {modal && (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeModal();
        }}>
          <section className="modal-card" role="dialog" aria-modal="true">
            <div className="modal-heading">
              <div>
                <h2>
                  {modal.type === "create" ? "Thêm nhân viên mới"
                    : modal.type === "edit" ? "Cập nhật nhân viên"
                    : "Thông tin nhân viên"}
                </h2>
                <p>
                  {modal.type === "detail" ? "Chi tiết hồ sơ nhân sự" : "Vui lòng nhập thông tin nhân viên."}
                </p>
              </div>
              <button className="icon-button" onClick={closeModal} aria-label="Đóng">
                <X size={20} />
              </button>
            </div>

            {modal.type === "detail" ? (
              <div className="detail-grid">
                {[
                  ["Mã nhân viên", modal.employee.employeeId],
                  ["Họ và tên", modal.employee.fullName],
                  ["Giới tính", modal.employee.gender],
                  ["Ngày sinh", formatDate(modal.employee.dateOfBirth)],
                  ["Phòng ban", modal.employee.department],
                  ["Chức vụ", modal.employee.position],
                  ["Email", modal.employee.email],
                  ["Số điện thoại", modal.employee.phone],
                  ["Ngày vào làm", formatDate(modal.employee.hireDate)],
                  ["Trạng thái", modal.employee.status]
                ].map(([label, value]) => (
                  <div className="detail-item" key={label}>
                    <span>{label}</span><strong>{value || "—"}</strong>
                  </div>
                ))}
                <div className="modal-actions">
                  <button className="secondary-button" onClick={closeModal}>Đóng</button>
                  <button className="primary-button" onClick={() => openEdit(modal.employee)}>
                    <Pencil size={16} /> Chỉnh sửa
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <label>
                    Mã nhân viên *
                    <input name="employeeId" value={form.employeeId} onChange={handleChange}
                      required disabled={modal.type === "edit"} placeholder="VD: NV004" />
                  </label>
                  <label>
                    Họ và tên *
                    <input name="fullName" value={form.fullName} onChange={handleChange}
                      required placeholder="Nhập họ và tên" />
                  </label>
                  <label>
                    Giới tính *
                    <select name="gender" value={form.gender} onChange={handleChange} required>
                      <option>Nam</option><option>Nữ</option><option>Khác</option>
                    </select>
                  </label>
                  <label>
                    Ngày sinh *
                    <input type="date" name="dateOfBirth" value={form.dateOfBirth}
                      onChange={handleChange} required />
                  </label>
                  <label>
                    Phòng ban *
                    <input name="department" value={form.department} onChange={handleChange}
                      required placeholder="VD: Công nghệ thông tin" />
                  </label>
                  <label>
                    Chức vụ *
                    <input name="position" value={form.position} onChange={handleChange}
                      required placeholder="VD: Nhân viên" />
                  </label>
                  <label>
                    Email *
                    <input type="email" name="email" value={form.email} onChange={handleChange}
                      required placeholder="name@example.com" />
                  </label>
                  <label>
                    Số điện thoại *
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                      required placeholder="Nhập số điện thoại" />
                  </label>
                  <label>
                    Ngày vào làm *
                    <input type="date" name="hireDate" value={form.hireDate}
                      onChange={handleChange} required />
                  </label>
                  <label>
                    Trạng thái
                    <select name="status" value={form.status} onChange={handleChange}>
                      <option>Đang làm việc</option>
                      <option>Tạm nghỉ</option>
                      <option>Đã nghỉ việc</option>
                    </select>
                  </label>
                </div>
                <div className="modal-actions">
                  <button type="button" className="secondary-button" onClick={closeModal} disabled={saving}>
                    Hủy
                  </button>
                  <button type="submit" className="primary-button" disabled={saving}>
                    {saving ? "Đang lưu..." : modal.type === "edit" ? "Lưu thay đổi" : "Thêm nhân viên"}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
