
const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const employeeRoutes = require("./routes/employeeRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Ghi log mọi request để kiểm tra API
app.use((req, res, next) => {
    console.log("Request:", req.method, req.originalUrl);
    next();
});

// API quản lý nhân viên
app.use("/api/employees", employeeRoutes);

// Kết nối MongoDB Atlas
mongoose
    .connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000
    })
    .then(() => {
        console.log("MongoDB Atlas connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error.message);
    });

// Kiểm tra máy chủ
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "HR Management API is running",
        database: mongoose.connection.readyState === 1
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

// Khởi động máy chủ
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
