const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            required: [true, "Mã nhân viên là bắt buộc"],
            unique: true,
            trim: true
        },
        fullName: {
            type: String,
            required: [true, "Họ tên nhân viên là bắt buộc"],
            trim: true
        },
        gender: {
            type: String,
            enum: ["Nam", "Nữ", "Khác"],
            required: [true, "Giới tính là bắt buộc"]
        },
        dateOfBirth: {
            type: Date,
            required: [true, "Ngày sinh là bắt buộc"]
        },
        department: {
            type: String,
            required: [true, "Phòng ban là bắt buộc"],
            trim: true
        },
        position: {
            type: String,
            required: [true, "Chức vụ là bắt buộc"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email là bắt buộc"],
            unique: true,
            lowercase: true,
            trim: true
        },
        phone: {
            type: String,
            required: [true, "Số điện thoại là bắt buộc"],
            trim: true
        },
        hireDate: {
            type: Date,
            required: [true, "Ngày vào làm là bắt buộc"]
        },
        status: {
            type: String,
            enum: ["Đang làm việc", "Đã nghỉ việc", "Tạm nghỉ"],
            default: "Đang làm việc"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Employee", employeeSchema);