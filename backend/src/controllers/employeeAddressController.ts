import { Request, Response } from "express";
import pool from "../config/db";

export const createAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const {
      address_type,
      address_line1,
      address_line2,
      city,
      state,
      pincode,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO employee_addresses
      (
        employee_id,
        address_type,
        address_line1,
        address_line2,
        city,
        state,
        pincode
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [
        id,
        address_type,
        address_line1,
        address_line2,
        city,
        state,
        pincode,
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
      message: "Failed to create address",
    });
  }
};

export const getAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM employee_addresses
      WHERE employee_id = $1
      ORDER BY id
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch address",
    });
  }
};

export const updateAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const {
      address_type,
      address_line1,
      address_line2,
      city,
      state,
      pincode,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE employee_addresses
      SET
        address_line1 = $1,
        address_line2 = $2,
        city = $3,
        state = $4,
        pincode = $5
      WHERE
        employee_id = $6
        AND address_type = $7
      RETURNING *
      `,
      [
        address_line1,
        address_line2,
        city,
        state,
        pincode,
        id,
        address_type,
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
      message: "Failed to update address",
    });
  }
};