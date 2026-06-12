import { Request, Response } from "express";
import pool from "../config/db";

export const getShifts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await pool.query(
      "SELECT * FROM shifts ORDER BY id"
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch shifts",
    });
  }
};

export const createShift = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
  shift_name,
  start_time,
  end_time,
  grace_minutes,
  overtime_allowed,
  required_hours
} = req.body;
    const result = await pool.query(
      `
      INSERT INTO shifts
(
  shift_name,
  start_time,
  end_time,
  grace_minutes,
  overtime_allowed,
  required_hours
)
VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [
  shift_name,
  start_time,
  end_time,
  grace_minutes,
  overtime_allowed,
  required_hours
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
      message: "Failed to create shift",
    });
  }
};

export const assignShift = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      employee_id,
      shift_id,
      effective_from
    } = req.body;

    await pool.query(
      `
      UPDATE employee_shift_assignments
      SET effective_to = CURRENT_DATE - INTERVAL '1 day'
      WHERE employee_id = $1
      AND effective_to IS NULL
      `,
      [employee_id]
    );

    const result = await pool.query(
      `
      INSERT INTO employee_shift_assignments
      (
        employee_id,
        shift_id,
        effective_from
      )
      VALUES ($1,$2,$3)
      RETURNING *
      `,
      [
        employee_id,
        shift_id,
        effective_from
      ]
    );

    await pool.query(
      `
      UPDATE employees
      SET shift_id = $1
      WHERE id = $2
      `,
      [shift_id, employee_id]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to assign shift"
    });
  }
};

export const getCurrentShift = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { employeeId } = req.params;

    const result = await pool.query(
      `
      SELECT
  esa.*,
  s.shift_name,
  s.start_time,
  s.end_time,
  s.required_hours
      FROM employee_shift_assignments esa
      JOIN shifts s
        ON esa.shift_id = s.id
      WHERE esa.employee_id = $1
      AND esa.effective_to IS NULL
      `,
      [employeeId]
    );

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch current shift"
    });
  }
};

export const getShiftHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { employeeId } = req.params;

    const result = await pool.query(
      `
     SELECT
  esa.*,
  s.shift_name,
  s.required_hours
      FROM employee_shift_assignments esa
      JOIN shifts s
        ON esa.shift_id = s.id
      WHERE esa.employee_id = $1
      ORDER BY effective_from DESC
      `,
      [employeeId]
    );

    res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch shift history"
    });
  }
};