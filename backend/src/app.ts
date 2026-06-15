import express from "express";
import cors from "cors";
import pool from "./config/db";
import path from "path";

import departmentRoutes from "./routes/department.routes";
import employeeRoutes from "./routes/employee.routes";
import authRoutes from "./routes/auth.routes";
import shiftRoutes from "./routes/shift.routes";
import attendanceRoutes from "./routes/attendance.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import payrollRoutes from "./routes/payroll.routes";
import salarySlipRoutes from "./routes/salarySlip.routes";
import employeePersonalRoutes from "./routes/employeePersonalRoutes";
import employeeAddressRoutes from "./routes/employeeAddressRoutes";
import employeeEmploymentRoutes from "./routes/employeeEmploymentRoutes";
import employeeBankRoutes from "./routes/employeeBankRoutes";
import employeeWeeklyOffRoutes from "./routes/employeeWeeklyOffRoutes";
import uploadRoutes from "./routes/upload.routes";
import salaryStructureRoutes from "./routes/salaryStructure.routes";
import payrollAdjustmentRoutes from "./routes/payrollAdjustment.routes";
import payrollExportRoutes from "./routes/payrollExport.routes";


const app = express();

app.use(cors());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use("/api/departments", departmentRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/shifts", shiftRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/salary-slip",salarySlipRoutes);
app.use("/api/employees",employeePersonalRoutes);
app.use("/api/employees",employeeAddressRoutes);
app.use("/api/employees",employeeEmploymentRoutes);
app.use("/api/employees",employeeBankRoutes);
app.use("/api/employees",employeeWeeklyOffRoutes);
app.use("/api/upload",uploadRoutes);
app.use("/api/salary-structures",salaryStructureRoutes);
app.use("/api/payroll-adjustments",payrollAdjustmentRoutes);
app.use("/api/payroll/export",payrollExportRoutes);


app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "../uploads"
    )
  )
);




app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.status(200).json({
      success: true,
      message: "Hospital Management API Running",
      databaseTime: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

export default app;