import { Request, Response } from "express";
import pool from "../config/db";

export const createPayrollAdjustment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
  employee_id,
  payroll_month,
  payroll_year,
  electricity_bill,
  advance_amount,
  bonus,
  special_allowance,
  remarks,
} = req.body;


    const result = await pool.query(
      `
      INSERT INTO payroll_adjustments
(
  employee_id,
  payroll_month,
  payroll_year,
  electricity_bill,
  advance_amount,
  bonus,
  special_allowance,
  remarks
)
VALUES
(
  $1,$2,$3,$4,$5,$6,$7,$8
)

ON CONFLICT
(
  employee_id,
  payroll_month,
  payroll_year
)

DO UPDATE SET
  electricity_bill = EXCLUDED.electricity_bill,
  advance_amount = EXCLUDED.advance_amount,
  bonus = EXCLUDED.bonus,
  special_allowance = EXCLUDED.special_allowance,
  remarks = EXCLUDED.remarks

RETURNING *;
      `,
      [
        employee_id,
        payroll_month,
        payroll_year,
        electricity_bill,
        advance_amount,
        bonus,
        special_allowance,
        remarks,
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
      message: "Failed to create adjustment",
    });
  }
};

export const getPayrollAdjustments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const result = await pool.query(`
      SELECT
        pa.*,
        e.employee_code,
        e.full_name
      FROM payroll_adjustments pa
      LEFT JOIN employees e
      ON pa.employee_id = e.id
      ORDER BY pa.id DESC
    `);

    res.status(200).json({
      success: true,
      data: result.rows,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch adjustments",
    });

  }
};

export const updatePayrollAdjustment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const { id } = req.params;

    const {
  electricity_bill,
  advance_amount,
  bonus,
  special_allowance,
  remarks,
} = req.body;

    const result = await pool.query(
      `
      UPDATE payroll_adjustments
      SET
  electricity_bill = $1,
  advance_amount = $2,
  bonus = $3,
  special_allowance = $4,
  remarks = $5
WHERE id = $6
      RETURNING *
      `,
      [
        electricity_bill,
        advance_amount,
        bonus,
        special_allowance,
        remarks,
        id,
      ]
    );

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update adjustment",
    });

  }
};

export const getAdjustmentByEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const {
      employeeId,
      month,
      year,
    } = req.query;

    const result = await pool.query(
      `
      SELECT *
      FROM payroll_adjustments
      WHERE employee_id = $1
      AND payroll_month = $2
      AND payroll_year = $3
      ORDER BY id DESC
      LIMIT 1
      `,
      [
        employeeId,
        month,
        year,
      ]
    );

    res.status(200).json({
      success: true,
      data: result.rows[0] || null,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch adjustment",
    });

  }
};