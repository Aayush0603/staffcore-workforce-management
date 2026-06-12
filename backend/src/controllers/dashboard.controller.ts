import { Request, Response } from "express";
import pool from "../config/db";

export const getDashboardStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const totalEmployees = await pool.query(
      "SELECT COUNT(*) FROM employees"
    );

    const totalDepartments = await pool.query(
      "SELECT COUNT(*) FROM departments"
    );

    const presentToday = await pool.query(
      `
      SELECT COUNT(*)
      FROM attendance
      WHERE attendance_date = CURRENT_DATE
      `
    );

    const pendingLeaves = await pool.query(
      `
      SELECT COUNT(*)
      FROM leave_requests
      WHERE status = 'PENDING'
      `
    );

    const totalPayrolls = await pool.query(
  "SELECT COUNT(*) FROM payroll"
);

const totalSalarySlips = await pool.query(
  "SELECT COUNT(*) FROM salary_slips"
);

const approvedLeaves = await pool.query(`
  SELECT COUNT(*)
  FROM leave_requests
  WHERE status = 'APPROVED'
`);

    res.status(200).json({
      success: true,

      data: {
  totalEmployees:
    Number(totalEmployees.rows[0].count),

  totalDepartments:
    Number(totalDepartments.rows[0].count),

  presentToday:
    Number(presentToday.rows[0].count),

  pendingLeaves:
    Number(pendingLeaves.rows[0].count),

  totalPayrolls:
    Number(totalPayrolls.rows[0].count),

  totalSalarySlips:
    Number(totalSalarySlips.rows[0].count),

  approvedLeaves:
    Number(approvedLeaves.rows[0].count),
}
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};