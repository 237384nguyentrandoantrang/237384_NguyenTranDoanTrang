const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const employeeRoutes = require("./routes/employeeRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Ghi log mọi request
app.use((req, res, next) => {
    console.log("Request:", req.method, req.originalUrl);
    next();
});

// API quản lý nhân viên
app.use("/api/employees", employeeRoutes);

// Kiểm tra tình trạng server và MongoDB
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "HR Management API is running",
        database:
            mongoose.connection.readyState === 1
                ? "connected"
                : "disconnected"
    });
});

// API giới thiệu
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Human Resource Management System API",
        student: "Nguyen Tran Doan Trang",
        studentId: "237384"
    });
});

// Xử lý lỗi chung
app.use((err, req, res, next) => {
    console.error("API error:", err.message);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        success: false,
        message: "Lỗi máy chủ",
        error: err.message
    });
});

// Khởi động server sau khi kết nối MongoDB thành công
async function startServer() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error(
                "Chưa cấu hình MONGODB_URI trong file .env"
            );
        }

        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000
        });

        console.log("MongoDB Atlas connected successfully");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`API: http://localhost:${PORT}/api/employees`);
            console.log(`Health: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error("Không thể khởi động backend:", error.message);
        process.exit(1);
    }
}

startServer();