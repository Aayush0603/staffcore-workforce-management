import { Request, Response } from "express";
import pool from "../config/db";

export const createEmploymentDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const {
      uan_number,
      pan_number,
      aadhaar_number,
      pf_number,
      pf_joining_date,
      esi_number,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO employee_employment_details
      (
        employee_id,
        uan_number,
        pan_number,
        aadhaar_number,
        pf_number,
        pf_joining_date,
        esi_number
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [
        id,
        uan_number,
        pan_number,
        aadhaar_number,
        pf_number,
        pf_joining_date,
        esi_number,
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
      message:
        "Failed to create employment details",
    });
  }
};

export const getEmploymentDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM employee_employment_details
      WHERE employee_id = $1
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch employment details",
    });
  }
};

export const updateEmploymentDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const {
      uan_number,
      pan_number,
      aadhaar_number,
      pf_number,
      pf_joining_date,
      esi_number,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE employee_employment_details
      SET
        uan_number = $1,
        pan_number = $2,
        aadhaar_number = $3,
        pf_number = $4,
        pf_joining_date = $5,
        esi_number = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE employee_id = $7
      RETURNING *
      `,
      [
        uan_number,
        pan_number,
        aadhaar_number,
        pf_number,
        pf_joining_date,
        esi_number,
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
      message:
        "Failed to update employment details",
    });
  }
};