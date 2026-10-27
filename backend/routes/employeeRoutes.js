const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");

// GET: Lấy danh sách nhân viên và tìm kiếm theo mã hoặc họ tên
router.get("/", async (req, res) => {
    try {
        const { search } = req.query;

        let filter = {};

        if (search) {
            filter = {
                $or: [
                    { employeeId: { $regex: search, $options: "i" } },
                    { fullName: { $regex: search, $options: "i" } }
                ]
            };
        }

        const employees = await Employee.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: employees.length,
            data: employees
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi khi lấy danh sách nhân viên",
            error: error.message
        });
    }
});

// GET: Lấy thông tin một nhân viên theo mã nhân viên
router.get("/:id", async (req, res) => {
    try {
        const employee = await Employee.findOne({
            employeeId: req.params.id
        });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy nhân viên"
            });
        }

        res.status(200).json({
            success: true,
            data: employee
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi khi lấy thông tin nhân viên",
            error: error.message
        });
    }
});

 // POST: Thêm nhân viên mới
router.post("/", async (req, res) => {
    try {
        const {
            employeeId,
            fullName,
            gender,
            dateOfBirth,
            department,
            position,
            email,
            phone,
            hireDate,
            status
        } = req.body;

        const newEmployee = new Employee({
            employeeId,
            fullName,
            gender,
            dateOfBirth,
            department,
            position,
            email,
            phone,
            hireDate,
            status
        });

        const savedEmployee = await newEmployee.save();

        res.status(201).json({
            success: true,
            message: "Thêm nhân viên thành công",
            data: savedEmployee
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Mã nhân viên hoặc email đã tồn tại"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Dữ liệu nhân viên không hợp lệ",
                errors: Object.values(error.errors).map(item => item.message)
            });
        }

        res.status(500).json({
            success: false,
            message: "Lỗi khi thêm nhân viên",
            error: error.message
        });
    }
});

 // PUT: Cập nhật thông tin nhân viên theo mã nhân viên
router.put("/:id", async (req, res) => {
    try {
        const allowedFields = [
            "fullName",
            "gender",
            "dateOfBirth",
            "department",
            "position",
            "email",
            "phone",
            "hireDate",
            "status"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        const updatedEmployee = await Employee.findOneAndUpdate(
            { employeeId: req.params.id },
            { $set: updates },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedEmployee) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy nhân viên cần cập nhật"
            });
        }

        res.status(200).json({
            success: true,
            message: "Cập nhật nhân viên thành công",
            data: updatedEmployee
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email đã được sử dụng bởi nhân viên khác"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Dữ liệu cập nhật không hợp lệ",
                errors: Object.values(error.errors).map(item => item.message)
            });
        }

        res.status(500).json({
            success: false,
            message: "Lỗi khi cập nhật nhân viên",
            error: error.message
        });
    }
});

// DELETE: Xóa nhân viên theo mã nhân viên
router.delete("/:id", async (req, res) => {
    try {
        const deletedEmployee = await Employee.findOneAndDelete({
            employeeId: req.params.id
        });

        if (!deletedEmployee) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy nhân viên cần xóa"
            });
        }

        res.status(200).json({
            success: true,
            message: "Xóa nhân viên thành công",
            data: deletedEmployee
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi khi xóa nhân viên",
            error: error.message
        });
    }
});

module.exports = router;