import { Request, Response } from "express";
import pool from "../config/db";

export const createPersonalDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const {
      gender,
      date_of_birth,
      blood_group,
      marital_status,
      father_name,
      mother_name,
      spouse_name,
      emergency_contact,
      physically_challenged,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO employee_personal_details
      (
        employee_id,
        gender,
        date_of_birth,
        blood_group,
        marital_status,
        father_name,
        mother_name,
        spouse_name,
        emergency_contact,
        physically_challenged
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
      `,
      [
        id,
        gender,
        date_of_birth,
        blood_group,
        marital_status,
        father_name,
        mother_name,
        spouse_name,
        emergency_contact,
        physically_challenged,
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
      message: "Failed to create personal details",
    });
  }
};

export const getPersonalDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM employee_personal_details
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
      message: "Failed to fetch personal details",
    });
  }
};

export const updatePersonalDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const {
      gender,
      date_of_birth,
      blood_group,
      marital_status,
      father_name,
      mother_name,
      spouse_name,
      emergency_contact,
      physically_challenged,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE employee_personal_details
      SET
        gender = $1,
        date_of_birth = $2,
        blood_group = $3,
        marital_status = $4,
        father_name = $5,
        mother_name = $6,
        spouse_name = $7,
        emergency_contact = $8,
        physically_challenged = $9,
        updated_at = CURRENT_TIMESTAMP
      WHERE employee_id = $10
      RETURNING *
      `,
      [
        gender,
        date_of_birth,
        blood_group,
        marital_status,
        father_name,
        mother_name,
        spouse_name,
        emergency_contact,
        physically_challenged,
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
      message: "Failed to update personal details",
    });
  }
};