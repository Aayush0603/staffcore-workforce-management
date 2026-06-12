import { Request, Response } from "express";
import pool from "../config/db";

export const createBankDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const {
      bank_name,
      ifsc_code,
      account_number,
      account_holder_name,
      upi_id,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO employee_bank_details
      (
        employee_id,
        bank_name,
        ifsc_code,
        account_number,
        account_holder_name,
        upi_id
      )
      VALUES
      ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [
        id,
        bank_name,
        ifsc_code,
        account_number,
        account_holder_name,
        upi_id,
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
        "Failed to create bank details",
    });
  }
};

export const getBankDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM employee_bank_details
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
        "Failed to fetch bank details",
    });
  }
};

export const updateBankDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const {
      bank_name,
      ifsc_code,
      account_number,
      account_holder_name,
      upi_id,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE employee_bank_details
      SET
        bank_name = $1,
        ifsc_code = $2,
        account_number = $3,
        account_holder_name = $4,
        upi_id = $5,
        updated_at = CURRENT_TIMESTAMP
      WHERE employee_id = $6
      RETURNING *
      `,
      [
        bank_name,
        ifsc_code,
        account_number,
        account_holder_name,
        upi_id,
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
        "Failed to update bank details",
    });
  }
};