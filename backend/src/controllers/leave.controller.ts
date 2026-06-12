import { Request, Response } from "express";
import pool from "../config/db";

export const applyLeave = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      employee_id,
      leave_type_id,
      start_date,
      end_date,
      reason
    } = req.body;

    if (
      !employee_id ||
      !leave_type_id ||
      !start_date ||
      !end_date
    ) {
      res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
      return;
    }

    const result = await pool.query(
      `
      INSERT INTO leave_requests
      (
        employee_id,
        leave_type_id,
        start_date,
        end_date,
        reason
      )
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *
      `,
      [
        employee_id,
        leave_type_id,
        start_date,
        end_date,
        reason
      ]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Leave application failed"
    });
  }
};

export const getLeaveRequests = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await pool.query(`
      SELECT
        lr.id,
        lr.start_date,
        lr.end_date,
        lr.reason,
        lr.status,
        e.employee_code,
        e.full_name,
        lt.name AS leave_type
      FROM leave_requests lr
      LEFT JOIN employees e
      ON lr.employee_id = e.id
      LEFT JOIN leave_types lt
      ON lr.leave_type_id = lt.id
      ORDER BY lr.id DESC
    `);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch leave requests"
    });
  }
};

export const approveLeave = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE leave_requests
      SET status = 'APPROVED'
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Leave approval failed"
    });
  }
};

export const rejectLeave = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE leave_requests
      SET status = 'REJECTED'
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Leave rejection failed"
    });
  }
};