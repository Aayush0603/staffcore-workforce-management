import { Request, Response } from "express";
import pool from "../config/db";

export const createWeeklyOff = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const { day_of_week } = req.body;

    const result = await pool.query(
      `
      INSERT INTO employee_weekly_offs
      (
        employee_id,
        day_of_week
      )
      VALUES ($1,$2)
      RETURNING *
      `,
      [
        id,
        day_of_week,
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
        "Failed to create weekly off",
    });
  }
};

export const getWeeklyOff = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM employee_weekly_offs
      WHERE employee_id = $1
      AND is_active = TRUE
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
        "Failed to fetch weekly off",
    });
  }
};

export const updateWeeklyOff = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const { day_of_week } = req.body;

    const result = await pool.query(
      `
      UPDATE employee_weekly_offs
      SET
        day_of_week = $1
      WHERE employee_id = $2
      RETURNING *
      `,
      [
        day_of_week,
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
        "Failed to update weekly off",
    });
  }
};