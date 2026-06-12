import { Request, Response } from "express";
import pool from "../config/db";

export const getDepartments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await pool.query(
      "SELECT * FROM departments ORDER BY id"
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
      message: "Failed to fetch departments",
    });
  }
};

export const createDepartment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        message: "Department name is required",
      });
      return;
    }

    const result = await pool.query(
      `
      INSERT INTO departments(name, description)
      VALUES($1, $2)
      RETURNING *
      `,
      [name, description]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create department",
    });
  }
};