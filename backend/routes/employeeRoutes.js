
const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");

// GET: Danh sach va tim kiem nhan vien
router.get("/", async (req, res) => {
    try {
        const search = String(req.query.search || "").trim();

        // Lay danh sach nhan vien tu MongoDB
        let employees = await Employee.find({})
            .sort({ createdAt: -1 })
            .maxTimeMS(8000)
            .exec();

        // Loc theo ma nhan vien hoac ho ten
        if (search) {
            const keyword = search.toLowerCase();

            employees = employees.filter((employee) => {
                const employeeId = String(employee.employeeId || "").toLowerCase();
                const fullName = String(employee.fullName || "").toLowerCase();

                return employeeId.includes(keyword) ||
                       fullName.includes(keyword);
            });
        }

        return res.status(200).json({
            success: true,
            count: employees.length,
            data: employees
        });
    } catch (error) {
        console.error("GET employees error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Khong the lay danh sach nhan vien",
            error: error.message
        });
    }
});

// GET: Lay nhan vien theo ma
router.get("/:id", async (req, res) => {
    try {
        const employee = await Employee.findOne({
            employeeId: req.params.id
        }).maxTimeMS(8000).exec();

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Khong tim thay nhan vien"
            });
        }

        return res.status(200).json({
            success: true,
            data: employee
        });
    } catch (error) {
        console.error("GET employee error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Loi khi lay nhan vien",
            error: error.message
        });
    }
});

// POST: Them nhan vien
router.post("/", async (req, res) => {
    try {
        const required = [
            "employeeId", "fullName", "gender", "dateOfBirth",
            "department", "position", "email", "phone", "hireDate"
        ];

        const missing = required.filter(
            (field) => !String(req.body[field] ?? "").trim()
        );

        if (missing.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Thieu truong bat buoc",
                fields: missing
            });
        }

        const employee = await Employee.create(req.body);

        return res.status(201).json({
            success: true,
            message: "Them nhan vien thanh cong",
            data: employee
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Ma nhan vien hoac email da ton tai"
            });
        }

        if (error.name === "ValidationError" ||
            error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Du lieu khong hop le",
                error: error.message
            });
        }

        console.error("POST employee error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Loi khi them nhan vien",
            error: error.message
        });
    }
});

// PUT: Cap nhat nhan vien theo ma
router.put("/:id", async (req, res) => {
    try {
        const allowedFields = [
            "fullName", "gender", "dateOfBirth", "department",
            "position", "email", "phone", "hireDate", "status"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Khong co truong hop le de cap nhat"
            });
        }

        const employee = await Employee.findOneAndUpdate(
            { employeeId: req.params.id },
            { $set: updates },
            { new: true, runValidators: true }
        ).exec();

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Khong tim thay nhan vien"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cap nhat thanh cong",
            data: employee
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Ma nhan vien hoac email da ton tai"
            });
        }

        if (error.name === "ValidationError" ||
            error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Du lieu khong hop le",
                error: error.message
            });
        }

        console.error("PUT employee error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Loi khi cap nhat",
            error: error.message
        });
    }
});

// DELETE: Xoa nhan vien theo ma
router.delete("/:id", async (req, res) => {
    try {
        const employee = await Employee.findOneAndDelete({
            employeeId: req.params.id
        }).exec();

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Khong tim thay nhan vien"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Xoa nhan vien thanh cong",
            data: employee
        });
    } catch (error) {
        console.error("DELETE employee error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Loi khi xoa nhan vien",
            error: error.message
        });
    }
});

module.exports = router;
