# 237384_NguyenTranDoanTrang

## 1. Thông tin sinh viên

- **Họ và tên:** Nguyễn Trần Đoan Trang
- **MSSV:** 237384
- **Lớp:** DH23TIN10

## 2. Mô tả dự án

Hệ thống quản lý nhân sự là ứng dụng web hỗ trợ quản lý thông tin nhân viên, bao gồm xem danh sách, tìm kiếm, thêm mới, cập nhật và xóa nhân viên.

## 3. Công nghệ sử dụng

- **Frontend:** React, Vite
- **Backend:** Node.js, Express.js
- **Cơ sở dữ liệu:** MongoDB Atlas
- **Quản lý mã nguồn:** Git, GitHub
- **Đóng gói ứng dụng:** Docker
- **Lưu trữ Docker image:** Docker Hub
- **Triển khai ứng dụng:** Render

## 4. Hướng dẫn chạy ở môi trường phát triển

### Yêu cầu

- Node.js và npm
- Git
- Tài khoản MongoDB Atlas khi sử dụng cơ sở dữ liệu trực tuyến

### Chạy Backend

Mở Terminal tại thư mục `backend` và thực hiện:

```bash
npm install
```

Tạo file `.env` trong thư mục `backend`, sau đó cấu hình:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Khởi động Backend:

```bash
npm start
```

Backend mặc định chạy tại `http://localhost:5000`.

### Chạy Frontend

Mở một Terminal khác tại thư mục `frontend` và thực hiện:

```bash
npm install
npm run dev
```

Mở địa chỉ Frontend được Vite hiển thị trong Terminal, thường là `http://localhost:5173`.

**Lưu ý:** Các bước trên là hướng dẫn chạy cơ bản. Cấu hình kết nối MongoDB và các chức năng cần được hoàn thiện tương ứng trong mã nguồn trước khi sử dụng đầy đủ.

Không đưa mật khẩu, token hoặc chuỗi kết nối chứa thông tin xác thực vào repository.

## 5. Liên kết dự án

- **GitHub Repository:** https://github.com/237384nguyentrandoantrang/237384_NguyenTranDoanTrang
- **Docker Hub Backend:** Bổ sung sau khi đăng tải image.
- **Docker Hub Frontend:** Bổ sung sau khi đăng tải image.
- **Render App:** Bổ sung sau khi triển khai.
- **Render API:** Bổ sung sau khi triển khai.
- **MongoDB Atlas:** https://cloud.mongodb.com/

## 6. Cấu trúc dự án

```text
237384_NguyenTranDoanTrang/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── Dockerfile
├── README.md
└── .gitignore
```