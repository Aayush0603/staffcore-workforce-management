import { Request, Response } from "express";
import pool from "../config/db";

export const createEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
  employee_code,
  full_name,
  email,
  phone,
  department_id,
  designation,
  joining_date,
  leaving_date,
  joining_letter_url,
} = req.body;

const result = await pool.query(
      `
      INSERT INTO employees
(
  employee_code,
  full_name,
  email,
  phone,
  department_id,
  designation,
  joining_date,
  leaving_date,
  joining_letter_url
)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *
      `,
      [
  employee_code,
  full_name,
  email,
  phone,
  department_id,
  designation,
  joining_date,
  leaving_date || null,
  joining_letter_url || null,
]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error: any) {

  console.error(error);

 if (error.code === "23505") {

  if (
    error.constraint ===
    "employees_employee_code_key"
  ) {

    res.status(400).json({
      success: false,
      message:
        "Employee Code already exists",
    });

    return;
  }

  if (
  error.constraint ===
  "unique_phone"
) {

    res.status(400).json({
      success: false,
      message:
        "Phone number already exists",
    });

    return;
  }

  if (
  error.constraint ===
  "employees_email_key"
) {

  res.status(400).json({
    success: false,
    message:
      "Email address already exists. Please use a different email.",
  });

  return;
 }
}

  res.status(500).json({
    success: false,
    message:
      "Failed to create employee",
  });
}
};

export const getEmployees = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await pool.query(`
  SELECT
    e.id,
    e.employee_code,
    e.full_name,
    e.email,
    e.phone,
    e.designation,
    e.joining_date,
    e.leaving_date,
    e.joining_letter_url,
    e.status,
    e.department_id,
    e.shift_id,
    d.name AS department_name,
    s.shift_name
  FROM employees e
  LEFT JOIN departments d
    ON e.department_id = d.id
  LEFT JOIN shifts s
    ON e.shift_id = s.id
  ORDER BY e.id DESC
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
      message: "Failed to fetch employees",
    });
  }
};

export const getEmployeeById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        e.*,
        d.name AS department_name
      FROM employees e
      LEFT JOIN departments d
      ON e.department_id = d.id
      WHERE e.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Employee not found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch employee"
    });
  }
};

export const updateEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const {
  full_name,
  email,
  phone,
  department_id,
  designation,
  joining_date,
  leaving_date,
  joining_letter_url,
  status,
} = req.body;

    const result = await pool.query(
  `
  UPDATE employees
SET
  full_name = $1,
  email = $2,
  phone = $3,
  department_id = $4,
  designation = $5,
  joining_date = $6,
  leaving_date = $7,
  joining_letter_url = $8,
  status = $9,
  updated_at = CURRENT_TIMESTAMP
WHERE id = $10

  RETURNING *
  `,
  [
  full_name,
  email,
  phone,
  department_id,
  designation,
  joining_date,
  leaving_date || null,
  joining_letter_url || null,
  status,
  id,
]
);

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error: any) {

  console.error(error);

  if (error.code === "23505") {

    if (
  error.constraint ===
  "unique_phone"
) {

      res.status(400).json({
  success: false,
  message:
    "This mobile number is already assigned to another staff member. Please enter a different mobile number.",
});

      return;
    }

    if (
  error.constraint ===
  "employees_email_key"
) {

  res.status(400).json({
    success: false,
    message:
      "Email address already exists. Please use a different email.",
  });

  return;
  }
}

  res.status(500).json({
    success: false,
    message:
      "Failed to update employee",
  });
}
};

export const deleteEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM employees
      WHERE id = $1
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete employee"
    });
  }
};