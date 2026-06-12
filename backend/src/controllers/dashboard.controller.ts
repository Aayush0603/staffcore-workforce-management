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

    const presentToday = await pool.query(
      `
      SELECT COUNT(*)
      FROM attendance
      WHERE attendance_date = CURRENT_DATE
      `
    );

  const absentToday = Math.max(
  Number(totalEmployees.rows[0].count) -
  Number(presentToday.rows[0].count),
  0
);

  const monthlyPayroll = await pool.query(`
  SELECT
    COALESCE(
      SUM(net_salary),
      0
    ) AS total
  FROM payroll
  WHERE payroll_month =
    EXTRACT(MONTH FROM CURRENT_DATE)
  AND payroll_year =
    EXTRACT(YEAR FROM CURRENT_DATE)
`);

const attendancePercentage =
  Number(totalEmployees.rows[0].count) > 0
    ? Math.round(
        (
          Number(
            presentToday.rows[0].count
          ) /
          Number(
            totalEmployees.rows[0].count
          )
        ) * 100
      )
    : 0;

    const pendingLeaves = await pool.query(
      `
      SELECT COUNT(*)
      FROM leave_requests
      WHERE status = 'PENDING'
      `
    );

    res.status(200).json({
      success: true,

      data: {
  totalEmployees:
    Number(totalEmployees.rows[0].count),

  presentToday:
    Number(presentToday.rows[0].count),

  absentToday,

  pendingLeaves:
    Number(pendingLeaves.rows[0].count),

  monthlyPayroll:
    Number(
      monthlyPayroll.rows[0].total
    ),

  attendancePercentage,
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