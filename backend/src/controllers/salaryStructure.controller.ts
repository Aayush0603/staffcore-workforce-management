import { Request, Response } from "express";
import pool from "../config/db";

export const createSalaryStructure = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
  employee_id,
  basic_salary,
  hra,
  allowance,
  overtime_rate,
  pf,
  pt,
  lic,
  deduction,
  effective_from,
} = req.body;

    const employeeCheck =
  await pool.query(
    `
    SELECT id
    FROM employees
    WHERE id = $1
    `,
    [employee_id]
  );

if (
  employeeCheck.rows.length === 0
) {
  res.status(404).json({
    success: false,
    message: "Employee not found",
  });
  return;
}

const existingSalary =
  await pool.query(
    `
    SELECT id
    FROM salary_structures
    WHERE employee_id = $1
    AND effective_from = $2
    `,
    [
      employee_id,
      effective_from,
    ]
  );

if (
  existingSalary.rows.length > 0
) {
  res.status(400).json({
    success: false,
    message:
      "Salary structure already exists for this effective date",
  });
  return;
}

    const result = await pool.query(

      `
      INSERT INTO salary_structures
(
  employee_id,
  basic_salary,
  hra,
  allowance,
  overtime_rate,
  pf,
  pt,
  lic,
  deduction,
  effective_from
)
VALUES
(
  $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
)
      RETURNING *
      `,
      [
  employee_id,
  basic_salary,
  hra,
  allowance,
  overtime_rate,
  pf,
  pt,
  lic,
  deduction,
  effective_from,
]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create salary structure",
    });
  }
};

export const getSalaryStructures = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const result = await pool.query(`
      SELECT
  ss.*,
  e.employee_code,
  e.full_name,
  e.designation
FROM salary_structures ss

INNER JOIN (
  SELECT
    employee_id,
    MAX(effective_from)
      AS latest_date
  FROM salary_structures
  GROUP BY employee_id
) latest

ON ss.employee_id =
   latest.employee_id

AND ss.effective_from =
    latest.latest_date

LEFT JOIN employees e
ON ss.employee_id = e.id

ORDER BY e.full_name;
    `);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch salary structures",
    });

  }
};

export const getSalaryHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const { employeeId } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM salary_structures
      WHERE employee_id = $1
      ORDER BY effective_from DESC
      `,
      [employeeId]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch salary history",
    });

  }
};